-- Schema voor de klas-scoping van Missie Middelbaar.
-- Plak dit in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql
-- Dit hele bestand kan in één keer geplakt en uitgevoerd worden.

-- 1. Eén vaste, niet-raadbare link per leerkracht.
-- Volgnummer is het korte, voor de klas leesbare nummer in groep8.klaarvoormiddelbaar.nl/missie/<nummer>.
CREATE SEQUENCE IF NOT EXISTS missie_links_volgnummer_seq START 1491;

CREATE TABLE IF NOT EXISTS missie_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  docent_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  volgnummer integer NOT NULL UNIQUE DEFAULT nextval('missie_links_volgnummer_seq'),
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE missie_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Docent kan eigen link aanmaken" ON missie_links
  FOR INSERT TO authenticated
  WITH CHECK (docent_id = auth.uid());

CREATE POLICY "Docent kan eigen link lezen" ON missie_links
  FOR SELECT TO authenticated
  USING (docent_id = auth.uid());

-- Leerlingen krijgen GEEN directe SELECT-toegang tot missie_links (anders kan
-- iedereen met de publieke anon-key de hele tabel met alle volgnummers en
-- docent_id's uitlezen). In plaats daarvan mogen ze alleen één volgnummer
-- vertalen naar het bijbehorende link-id, via deze functie.
CREATE OR REPLACE FUNCTION resolve_missie_link(p_volgnummer integer)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM missie_links WHERE volgnummer = p_volgnummer;
$$;

GRANT EXECUTE ON FUNCTION resolve_missie_link(integer) TO anon;

-- 2. Koppel elk groepje aan de link van de leerkracht die de link heeft gedeeld.
ALTER TABLE missie_groepjes ADD COLUMN IF NOT EXISTS link_id uuid REFERENCES missie_links(id) ON DELETE SET NULL;

-- 3. RLS op missie_groepjes: leerlingen mogen zelf een groepje aanmaken en hun
-- eigen groepje lezen/bijwerken (ze kennen alleen hun eigen groepje-id, dat
-- werkt hier hetzelfde als bij de andere Klaar voor Middelbaar-tools).
-- Een leerkracht (ingelogd) mag alleen groepjes zien die aan zijn/haar eigen
-- link hangen, dus nooit groepjes van een andere klas.
ALTER TABLE missie_groepjes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leerling kan groepje aanmaken" ON missie_groepjes
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Leerling kan groepje lezen" ON missie_groepjes
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Leerling kan groepje bijwerken" ON missie_groepjes
  FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Docent kan eigen klas groepjes lezen" ON missie_groepjes
  FOR SELECT TO authenticated
  USING (link_id IN (SELECT id FROM missie_links WHERE docent_id = auth.uid()));

-- Realtime aanzetten voor missie_groepjes stond je al eerder handmatig aan te zetten
-- via Database > Replication, dat blijft ongewijzigd werken met deze RLS-policies.
