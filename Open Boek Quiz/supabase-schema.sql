-- Schema voor de Open Boek Quiz (Les 7), volledig los van de KvM Quiz-tabellen.
-- Plak dit in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql
-- Plak elk statement liever los, multi-line statements verliezen soms de eerste regel bij plakken.

-- 1. Eén sessie per keer dat een leerkracht de quiz start.
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  les_id text NOT NULL,
  docent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'lobby',
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);

-- 2. De vragen die bij een sessie horen (vragenset wordt bij aanmaken gekopieerd).
CREATE TABLE IF NOT EXISTS quiz_vragen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  volgorde int NOT NULL,
  vraag text NOT NULL,
  goed_antwoord boolean NOT NULL
);

-- 3. Eén rij per leerling die meedoet.
CREATE TABLE IF NOT EXISTS quiz_deelnemers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  naam text NOT NULL,
  status text NOT NULL DEFAULT 'bezig',
  aantal_goed int,
  gestart_op timestamptz NOT NULL DEFAULT now(),
  ingeleverd_op timestamptz
);

ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_vragen ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_deelnemers ENABLE ROW LEVEL SECURITY;

-- Docent mag eigen sessies aanmaken, lezen en bijwerken (status wijzigen).
CREATE POLICY "Docent kan eigen quizsessie aanmaken" ON quiz_sessions
  FOR INSERT TO authenticated
  WITH CHECK (docent_id = auth.uid());

CREATE POLICY "Docent kan eigen quizsessie lezen" ON quiz_sessions
  FOR SELECT TO authenticated
  USING (docent_id = auth.uid());

CREATE POLICY "Docent kan eigen quizsessie bijwerken" ON quiz_sessions
  FOR UPDATE TO authenticated
  USING (docent_id = auth.uid());

-- Docent mag vragen van eigen sessie aanmaken en lezen (incl. goed_antwoord, voor eigen overzicht).
CREATE POLICY "Docent kan vragen van eigen sessie aanmaken" ON quiz_vragen
  FOR INSERT TO authenticated
  WITH CHECK (session_id IN (SELECT id FROM quiz_sessions WHERE docent_id = auth.uid()));

CREATE POLICY "Docent kan vragen van eigen sessie lezen" ON quiz_vragen
  FOR SELECT TO authenticated
  USING (session_id IN (SELECT id FROM quiz_sessions WHERE docent_id = auth.uid()));

-- Docent mag deelnemers van eigen sessie lezen (live leerlingenlijst en resultaten).
CREATE POLICY "Docent kan deelnemers van eigen sessie lezen" ON quiz_deelnemers
  FOR SELECT TO authenticated
  USING (session_id IN (SELECT id FROM quiz_sessions WHERE docent_id = auth.uid()));

-- Anon krijgt GEEN directe SELECT op quiz_sessions/quiz_vragen (voorkomt dat iemand met de
-- publieke anon-key alle sessiecodes of antwoorden kan uitlezen). Alles loopt via functies die
-- maar het strikt noodzakelijke teruggeven.

-- Leerling mag zelf een deelnemersrij aanmaken (meedoen).
CREATE POLICY "Leerling kan meedoen aan een sessie" ON quiz_deelnemers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Vertaalt een sessiecode naar het sessie-id, zonder de rest van de tabel bloot te geven.
CREATE OR REPLACE FUNCTION resolve_quiz_sessie(p_code text)
RETURNS TABLE(id uuid, status text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, status FROM quiz_sessions WHERE code = p_code AND status <> 'ended';
$$;

GRANT EXECUTE ON FUNCTION resolve_quiz_sessie(text) TO anon;

-- Geeft de vraagteksten van een sessie terug, NOOIT het goede antwoord.
CREATE OR REPLACE FUNCTION quiz_vragen_voor_sessie(p_session_id uuid)
RETURNS TABLE(id uuid, volgorde int, vraag text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, volgorde, vraag FROM quiz_vragen WHERE session_id = p_session_id ORDER BY volgorde;
$$;

GRANT EXECUTE ON FUNCTION quiz_vragen_voor_sessie(uuid) TO anon;

-- Berekent de score server-side bij inleveren, zodat het goede antwoord nooit naar de leerling gaat.
-- p_antwoorden is een jsonb-object: { "<vraag_id>": true|false, ... }
CREATE OR REPLACE FUNCTION quiz_inleveren(p_deelnemer_id uuid, p_antwoorden jsonb)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_aantal_goed int;
BEGIN
  SELECT count(*) INTO v_aantal_goed
  FROM quiz_vragen v
  WHERE v.session_id = (SELECT session_id FROM quiz_deelnemers WHERE id = p_deelnemer_id)
    AND (p_antwoorden ->> v.id::text)::boolean = v.goed_antwoord;

  UPDATE quiz_deelnemers
  SET status = 'ingeleverd', aantal_goed = v_aantal_goed, ingeleverd_op = now()
  WHERE id = p_deelnemer_id AND status = 'bezig';

  RETURN v_aantal_goed;
END;
$$;

GRANT EXECUTE ON FUNCTION quiz_inleveren(uuid, jsonb) TO anon;

-- Realtime aanzetten zodat de docent leerlingen live ziet binnenkomen en inleveren.
ALTER PUBLICATION supabase_realtime ADD TABLE quiz_deelnemers;
