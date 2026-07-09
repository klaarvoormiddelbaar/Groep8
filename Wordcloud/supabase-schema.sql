-- Schema voor Woordenwolk (Les 5) — live klassikale sessie, 3 fases.
-- Dit hele bestand kan in één keer geplakt worden.
-- Plak dit in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql

-- ── Leerlinglink per leerkracht (zelfde patroon als Voorspel de Klas) ──
CREATE SEQUENCE IF NOT EXISTS woordwolk_links_volgnummer_seq START 1493;

CREATE TABLE IF NOT EXISTS woordwolk_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  docent_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  volgnummer integer NOT NULL UNIQUE DEFAULT nextval('woordwolk_links_volgnummer_seq'),
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE woordwolk_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Docent kan eigen link aanmaken" ON woordwolk_links;
CREATE POLICY "Docent kan eigen link aanmaken" ON woordwolk_links
  FOR INSERT TO authenticated
  WITH CHECK (docent_id = auth.uid());

DROP POLICY IF EXISTS "Docent kan eigen link lezen" ON woordwolk_links;
CREATE POLICY "Docent kan eigen link lezen" ON woordwolk_links
  FOR SELECT TO authenticated
  USING (docent_id = auth.uid());

CREATE OR REPLACE FUNCTION resolve_woordwolk_link(p_volgnummer integer)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM woordwolk_links WHERE volgnummer = p_volgnummer;
$$;

GRANT EXECUTE ON FUNCTION resolve_woordwolk_link(integer) TO anon;

-- ── Eén "ronde" die de docent start ──
CREATE TABLE IF NOT EXISTS woordwolk_sessies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid NOT NULL REFERENCES woordwolk_links(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'wachtkamer',
  huidige_fase_index integer NOT NULL DEFAULT 0,
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);

-- Voorkomt dat er per ongeluk twee tegelijk-actieve sessies voor dezelfde link ontstaan.
CREATE UNIQUE INDEX IF NOT EXISTS woordwolk_sessies_een_open_per_link
  ON woordwolk_sessies (link_id) WHERE status <> 'afgelopen';

ALTER TABLE woordwolk_sessies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leerling kan sessie van de link lezen" ON woordwolk_sessies;
CREATE POLICY "Leerling kan sessie van de link lezen" ON woordwolk_sessies
  FOR SELECT TO anon
  USING (true);

DROP POLICY IF EXISTS "Docent kan eigen sessie aanmaken" ON woordwolk_sessies;
CREATE POLICY "Docent kan eigen sessie aanmaken" ON woordwolk_sessies
  FOR INSERT TO authenticated
  WITH CHECK (link_id IN (SELECT id FROM woordwolk_links WHERE docent_id = auth.uid()));

DROP POLICY IF EXISTS "Docent kan eigen sessie lezen" ON woordwolk_sessies;
CREATE POLICY "Docent kan eigen sessie lezen" ON woordwolk_sessies
  FOR SELECT TO authenticated
  USING (link_id IN (SELECT id FROM woordwolk_links WHERE docent_id = auth.uid()));

DROP POLICY IF EXISTS "Docent kan eigen sessie bijwerken" ON woordwolk_sessies;
CREATE POLICY "Docent kan eigen sessie bijwerken" ON woordwolk_sessies
  FOR UPDATE TO authenticated
  USING (link_id IN (SELECT id FROM woordwolk_links WHERE docent_id = auth.uid()))
  WITH CHECK (link_id IN (SELECT id FROM woordwolk_links WHERE docent_id = auth.uid()));

-- ── Deelnemers (voornaam, zodat de docent live kan zien wie er meedoet) ──
CREATE TABLE IF NOT EXISTS woordwolk_deelnemers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sessie_id uuid NOT NULL REFERENCES woordwolk_sessies(id) ON DELETE CASCADE,
  naam text NOT NULL,
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE woordwolk_deelnemers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leerling kan meedoen" ON woordwolk_deelnemers;
CREATE POLICY "Leerling kan meedoen" ON woordwolk_deelnemers
  FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Docent kan eigen deelnemers lezen" ON woordwolk_deelnemers;
CREATE POLICY "Docent kan eigen deelnemers lezen" ON woordwolk_deelnemers
  FOR SELECT TO authenticated
  USING (sessie_id IN (
    SELECT s.id FROM woordwolk_sessies s
    JOIN woordwolk_links l ON l.id = s.link_id
    WHERE l.docent_id = auth.uid()
  ));

-- ── Woorden per fase (met voornaam van de leerling, zichtbaar voor moderatie) ──
CREATE TABLE IF NOT EXISTS woordwolk_woorden (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sessie_id uuid NOT NULL REFERENCES woordwolk_sessies(id) ON DELETE CASCADE,
  fase_index integer NOT NULL,
  leerling_naam text NOT NULL DEFAULT '',
  woord text NOT NULL,
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);

-- Idempotent: voegt de kolom ook toe als de tabel al bestond zonder leerling_naam.
ALTER TABLE woordwolk_woorden ADD COLUMN IF NOT EXISTS leerling_naam text NOT NULL DEFAULT '';

ALTER TABLE woordwolk_woorden ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leerling kan woord insturen" ON woordwolk_woorden;
CREATE POLICY "Leerling kan woord insturen" ON woordwolk_woorden
  FOR INSERT TO anon
  WITH CHECK (true);

-- Woorden en namen zijn bedoeld om live gezamenlijk te zien, dus open leesbaar.
DROP POLICY IF EXISTS "Woorden zijn zichtbaar voor klas en docent" ON woordwolk_woorden;
CREATE POLICY "Woorden zijn zichtbaar voor klas en docent" ON woordwolk_woorden
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Docent kan ongepast woord verwijderen" ON woordwolk_woorden;
CREATE POLICY "Docent kan ongepast woord verwijderen" ON woordwolk_woorden
  FOR DELETE TO authenticated
  USING (sessie_id IN (
    SELECT s.id FROM woordwolk_sessies s
    JOIN woordwolk_links l ON l.id = s.link_id
    WHERE l.docent_id = auth.uid()
  ));

-- ── Realtime aanzetten (direct in SQL, niet afhankelijk van de Replication-toggle in de UI) ──
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE woordwolk_sessies;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE woordwolk_woorden;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE woordwolk_deelnemers;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
