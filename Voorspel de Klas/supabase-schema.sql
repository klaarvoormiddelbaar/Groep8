-- Schema voor Voorspel de klas (Les 5). Dit hele bestand kan in één keer geplakt worden.
-- Plak dit in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql

CREATE SEQUENCE IF NOT EXISTS voorspel_links_volgnummer_seq START 1491;

CREATE TABLE IF NOT EXISTS voorspel_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  docent_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  volgnummer integer NOT NULL UNIQUE DEFAULT nextval('voorspel_links_volgnummer_seq'),
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE voorspel_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Docent kan eigen link aanmaken" ON voorspel_links
  FOR INSERT TO authenticated
  WITH CHECK (docent_id = auth.uid());

CREATE POLICY "Docent kan eigen link lezen" ON voorspel_links
  FOR SELECT TO authenticated
  USING (docent_id = auth.uid());

-- Leerlingen krijgen GEEN directe SELECT-toegang tot voorspel_links (anders kan
-- iedereen met de publieke anon-key de hele tabel met alle volgnummers en
-- docent_id's uitlezen). In plaats daarvan mogen ze alleen één volgnummer
-- vertalen naar het bijbehorende link-id, via deze functie.
CREATE OR REPLACE FUNCTION resolve_voorspel_link(p_volgnummer integer)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM voorspel_links WHERE volgnummer = p_volgnummer;
$$;

GRANT EXECUTE ON FUNCTION resolve_voorspel_link(integer) TO anon;

-- Eén rij per leerling, volledig anoniem (geen naam-kolom).
CREATE TABLE IF NOT EXISTS voorspel_reacties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid NOT NULL REFERENCES voorspel_links(id) ON DELETE CASCADE,
  antwoorden jsonb NOT NULL DEFAULT '{}'::jsonb,
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE voorspel_reacties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leerling kan reactie insturen" ON voorspel_reacties
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Leerling mag alle reacties van dezelfde link lezen, nodig om direct na het
-- insturen het actuele klas-percentage te kunnen tonen (zelfde bewuste
-- afweging als bij missie_groepjes: de echte klas-scoping voor de leerkracht
-- zit op de authenticated-rol hieronder, niet op deze anon-policy).
CREATE POLICY "Leerling kan reacties van de link lezen" ON voorspel_reacties
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Docent kan eigen klas reacties lezen" ON voorspel_reacties
  FOR SELECT TO authenticated
  USING (link_id IN (SELECT id FROM voorspel_links WHERE docent_id = auth.uid()));

-- Realtime aanzetten voor voorspel_reacties doe je zelf nog handmatig via
-- Database > Replication, zelfde stap als bij missie_groepjes.
