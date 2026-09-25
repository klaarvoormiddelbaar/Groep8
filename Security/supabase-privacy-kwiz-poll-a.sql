-- PRIVACY STAP 4A — KvM Kwiz (les 1, 3, 5) en PollParty: namen en goede antwoorden afschermen
-- Plak in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql  en klik Run.
--
-- Nu kan iedereen met de openbare sleutel: (1) de namen van alle leerlingen van alle sessies lezen,
-- (2) het goede antwoord van elke quizvraag opvragen, (3) de eigen score naar een willekeurig getal zetten.
-- Straks: leerlingen mogen alleen nog hun EIGEN gegevens ophalen (via functies), de vragen zonder goed
-- antwoord zien, en het punten-berekenen gebeurt in de database.
-- Deze stap is veilig: de bestaande pagina's blijven werken.

-- 1. Eigen gegevens ophalen (alleen wie het willekeurige deelnemer-id kent)
CREATE OR REPLACE FUNCTION public.deelnemer_lezen(p_id uuid)
RETURNS jsonb LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT to_jsonb(d) FROM (SELECT id, session_id, naam, score FROM participants WHERE id = p_id) d;
$$;

-- 2. Aantal deelnemers van een sessie (wachtkamer)
CREATE OR REPLACE FUNCTION public.kwiz_deelnemers_aantal(p_session_id uuid)
RETURNS integer LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT count(*)::integer FROM participants WHERE session_id = p_session_id;
$$;

-- 3. Vragen zonder goed antwoord (is_poll = vraag zonder goed antwoord, zoals nu goed_index IS NULL)
CREATE OR REPLACE FUNCTION public.kwiz_vragen_lezen(p_session_id uuid)
RETURNS TABLE (id uuid, volgorde integer, type text, vraag text, afbeelding text, opties jsonb,
               tijdslimiet_seconden integer, is_poll boolean)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT q.id, q.volgorde, q.type, q.vraag, q.afbeelding, q.opties, q.tijdslimiet_seconden, (q.goed_index IS NULL)
  FROM questions q WHERE q.session_id = p_session_id ORDER BY q.volgorde;
$$;

-- 4. Antwoord insturen: de database bepaalt of het goed is en hoeveel punten het geeft
CREATE OR REPLACE FUNCTION public.kwiz_antwoord(p_deelnemer uuid, p_question uuid, p_optie integer, p_tijd_ms integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  d   participants%ROWTYPE;
  q   questions%ROWTYPE;
  s   sessions%ROWTYPE;
  vorig integer;
  pos integer;
  tijd integer;
  pt  integer := 0;
  ingevoegd integer;
BEGIN
  SELECT * INTO d FROM participants WHERE id = p_deelnemer;
  IF NOT FOUND THEN RETURN jsonb_build_object('fout', 'onbekende deelnemer'); END IF;
  SELECT * INTO q FROM questions WHERE id = p_question AND session_id = d.session_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('fout', 'onbekende vraag'); END IF;
  SELECT * INTO s FROM sessions WHERE id = d.session_id;
  IF p_optie IS NULL OR p_optie < 0 OR p_optie >= jsonb_array_length(q.opties) THEN
    RETURN jsonb_build_object('fout', 'ongeldig antwoord');
  END IF;

  -- al eerder beantwoord: niets dubbel tellen
  SELECT punten INTO vorig FROM answers WHERE participant_id = d.id AND question_id = q.id;
  IF FOUND THEN RETURN jsonb_build_object('punten', vorig, 'al_beantwoord', true); END IF;

  -- alleen tijdens de quiz en alleen op de vraag die nu aan de beurt is
  SELECT count(*)::integer INTO pos FROM questions WHERE session_id = q.session_id AND volgorde < q.volgorde;
  IF s.status <> 'active' OR pos <> s.huidige_vraag_index THEN
    RETURN jsonb_build_object('punten', 0, 'te_laat', true);
  END IF;

  tijd := greatest(0, least(coalesce(p_tijd_ms, q.tijdslimiet_seconden * 1000), q.tijdslimiet_seconden * 1000));
  IF q.goed_index IS NOT NULL AND p_optie = q.goed_index THEN
    pt := round(500 + 500 * greatest(0, 1 - tijd::numeric / (q.tijdslimiet_seconden * 1000)));
  END IF;

  INSERT INTO answers (session_id, question_id, participant_id, optie_index, tijd_ms, punten)
  VALUES (q.session_id, q.id, d.id, p_optie, tijd, pt)
  ON CONFLICT DO NOTHING;
  GET DIAGNOSTICS ingevoegd = ROW_COUNT;

  IF ingevoegd > 0 AND pt > 0 THEN
    UPDATE participants SET score = score + pt WHERE id = d.id;
  END IF;
  RETURN jsonb_build_object('punten', pt);
END $$;

-- 5. Eigen plek in de stand (zonder de namen van anderen)
CREATE OR REPLACE FUNCTION public.kwiz_stand(p_deelnemer uuid)
RETURNS jsonb LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'score',   d.score,
    'positie', 1 + (SELECT count(*) FROM participants p WHERE p.session_id = d.session_id AND p.score > d.score),
    'totaal',  (SELECT count(*) FROM participants p WHERE p.session_id = d.session_id))
  FROM participants d WHERE d.id = p_deelnemer;
$$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY[
    'deelnemer_lezen(uuid)', 'kwiz_deelnemers_aantal(uuid)', 'kwiz_vragen_lezen(uuid)',
    'kwiz_antwoord(uuid, uuid, integer, integer)', 'kwiz_stand(uuid)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO anon, authenticated', f);
  END LOOP;
END $$;

-- 6. Lengtegrens op namen (bestaande rijen worden niet gecontroleerd)
ALTER TABLE public.participants DROP CONSTRAINT IF EXISTS participants_naam_lengte;
ALTER TABLE public.participants ADD CONSTRAINT participants_naam_lengte CHECK (char_length(naam) BETWEEN 1 AND 40) NOT VALID;

-- Controle: 5 functies
SELECT proname FROM pg_proc WHERE pronamespace = 'public'::regnamespace
  AND proname IN ('deelnemer_lezen', 'kwiz_deelnemers_aantal', 'kwiz_vragen_lezen', 'kwiz_antwoord', 'kwiz_stand') ORDER BY 1;
