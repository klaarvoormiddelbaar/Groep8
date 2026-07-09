-- Schema voor Voorspel de klas (Les 5) — live klassikale sessie.
-- Dit hele bestand kan in één keer geplakt worden.
-- Plak dit in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql

-- ── Leerlinglink per leerkracht (ongewijzigd, blijft bestaan als je dit al eerder draaide) ──
CREATE SEQUENCE IF NOT EXISTS voorspel_links_volgnummer_seq START 1491;

CREATE TABLE IF NOT EXISTS voorspel_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  docent_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  volgnummer integer NOT NULL UNIQUE DEFAULT nextval('voorspel_links_volgnummer_seq'),
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE voorspel_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Docent kan eigen link aanmaken" ON voorspel_links;
CREATE POLICY "Docent kan eigen link aanmaken" ON voorspel_links
  FOR INSERT TO authenticated
  WITH CHECK (docent_id = auth.uid());

DROP POLICY IF EXISTS "Docent kan eigen link lezen" ON voorspel_links;
CREATE POLICY "Docent kan eigen link lezen" ON voorspel_links
  FOR SELECT TO authenticated
  USING (docent_id = auth.uid());

CREATE OR REPLACE FUNCTION resolve_voorspel_link(p_volgnummer integer)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM voorspel_links WHERE volgnummer = p_volgnummer;
$$;

GRANT EXECUTE ON FUNCTION resolve_voorspel_link(integer) TO anon;

-- ── Oude async-tabel vervangen door de live-sessie tabellen hieronder ──
DROP TABLE IF EXISTS voorspel_reacties;

-- ── Eén rij per "ronde" die de docent start ──
CREATE TABLE IF NOT EXISTS voorspel_sessies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid NOT NULL REFERENCES voorspel_links(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'wachtkamer',
  huidige_stelling_index integer NOT NULL DEFAULT 0,
  onthuld boolean NOT NULL DEFAULT false,
  huidig_resultaat jsonb,
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);

-- Voorkomt dat er per ongeluk twee tegelijk-actieve sessies voor dezelfde
-- link ontstaan (zou leerlingen en docent uit elkaar laten lopen).
CREATE UNIQUE INDEX IF NOT EXISTS voorspel_sessies_een_open_per_link
  ON voorspel_sessies (link_id) WHERE status <> 'afgelopen';

ALTER TABLE voorspel_sessies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leerling kan sessie van de link lezen" ON voorspel_sessies
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Docent kan eigen sessie aanmaken" ON voorspel_sessies
  FOR INSERT TO authenticated
  WITH CHECK (link_id IN (SELECT id FROM voorspel_links WHERE docent_id = auth.uid()));

CREATE POLICY "Docent kan eigen sessie lezen" ON voorspel_sessies
  FOR SELECT TO authenticated
  USING (link_id IN (SELECT id FROM voorspel_links WHERE docent_id = auth.uid()));

CREATE POLICY "Docent kan eigen sessie bijwerken" ON voorspel_sessies
  FOR UPDATE TO authenticated
  USING (link_id IN (SELECT id FROM voorspel_links WHERE docent_id = auth.uid()))
  WITH CHECK (link_id IN (SELECT id FROM voorspel_links WHERE docent_id = auth.uid()));

-- ── Eén rij per leerling die meedoet aan een sessie (anoniem, "Speler N") ──
CREATE TABLE IF NOT EXISTS voorspel_deelnemers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sessie_id uuid NOT NULL REFERENCES voorspel_sessies(id) ON DELETE CASCADE,
  spelernummer integer NOT NULL,
  score numeric NOT NULL DEFAULT 0,
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE voorspel_deelnemers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leerling kan meedoen" ON voorspel_deelnemers
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Leerling kan deelnemers van de sessie lezen" ON voorspel_deelnemers
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Docent kan eigen sessie deelnemers lezen" ON voorspel_deelnemers
  FOR SELECT TO authenticated
  USING (sessie_id IN (
    SELECT s.id FROM voorspel_sessies s
    JOIN voorspel_links l ON l.id = s.link_id
    WHERE l.docent_id = auth.uid()
  ));

CREATE POLICY "Docent kan score bijwerken" ON voorspel_deelnemers
  FOR UPDATE TO authenticated
  USING (sessie_id IN (
    SELECT s.id FROM voorspel_sessies s
    JOIN voorspel_links l ON l.id = s.link_id
    WHERE l.docent_id = auth.uid()
  ))
  WITH CHECK (sessie_id IN (
    SELECT s.id FROM voorspel_sessies s
    JOIN voorspel_links l ON l.id = s.link_id
    WHERE l.docent_id = auth.uid()
  ));

-- ── Eén rij per leerling per stelling ──
CREATE TABLE IF NOT EXISTS voorspel_antwoorden (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sessie_id uuid NOT NULL REFERENCES voorspel_sessies(id) ON DELETE CASCADE,
  deelnemer_id uuid NOT NULL REFERENCES voorspel_deelnemers(id) ON DELETE CASCADE,
  stelling_index integer NOT NULL,
  antwoord text NOT NULL,
  voorspelling integer NOT NULL,
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE voorspel_antwoorden ENABLE ROW LEVEL SECURITY;

-- Leerlingen lezen elkaars antwoorden nooit, alleen zelf insturen.
CREATE POLICY "Leerling kan antwoord insturen" ON voorspel_antwoorden
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Docent kan eigen sessie antwoorden lezen" ON voorspel_antwoorden
  FOR SELECT TO authenticated
  USING (sessie_id IN (
    SELECT s.id FROM voorspel_sessies s
    JOIN voorspel_links l ON l.id = s.link_id
    WHERE l.docent_id = auth.uid()
  ));

-- Realtime aanzetten voor voorspel_sessies, voorspel_deelnemers en
-- voorspel_antwoorden doe je zelf nog handmatig via Database > Replication.
