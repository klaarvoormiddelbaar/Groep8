-- Schema voor de docentenpagina van Formele Mail Oefenen.
-- Plak dit in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql
-- Plak elk statement liever los, in dit bestand staan ze al als losse blokken.

-- 1. Eén vaste, niet-raadbare link per leerkracht.
-- Volgnummer is het korte, voor de klas leesbare nummer in groep8.klaarvoormiddelbaar.nl/formeel/<nummer>.
CREATE SEQUENCE IF NOT EXISTS mail_links_volgnummer_seq START 1490;

CREATE TABLE IF NOT EXISTS mail_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  docent_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  volgnummer integer NOT NULL UNIQUE DEFAULT nextval('mail_links_volgnummer_seq'),
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);

-- 2. Eén rij per ingeleverde e-mail.
CREATE TABLE IF NOT EXISTS mail_inzendingen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid NOT NULL REFERENCES mail_links(id) ON DELETE CASCADE,
  voornaam text NOT NULL,
  onderwerp text NOT NULL,
  bericht text NOT NULL,
  checklist jsonb NOT NULL,
  aantal_goed int NOT NULL,
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE mail_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE mail_inzendingen ENABLE ROW LEVEL SECURITY;

-- De docent mag alleen zijn/haar eigen link aanmaken en lezen.
CREATE POLICY "Docent kan eigen link aanmaken" ON mail_links
  FOR INSERT TO authenticated
  WITH CHECK (docent_id = auth.uid());

CREATE POLICY "Docent kan eigen link lezen" ON mail_links
  FOR SELECT TO authenticated
  USING (docent_id = auth.uid());

-- Leerlingen krijgen GEEN directe SELECT-toegang tot mail_links (anders kan
-- iedereen met de publieke anon-key de hele tabel met alle volgnummers en
-- docent_id's uitlezen). In plaats daarvan mogen ze alleen één volgnummer
-- vertalen naar het bijbehorende link-id, via deze functie.
CREATE OR REPLACE FUNCTION resolve_mail_link(p_volgnummer integer)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM mail_links WHERE volgnummer = p_volgnummer;
$$;

GRANT EXECUTE ON FUNCTION resolve_mail_link(integer) TO anon;

-- Leerlingen (niet ingelogd) mogen alleen een inzending toevoegen, nooit lezen.
CREATE POLICY "Iedereen mag een inzending insturen" ON mail_inzendingen
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Alleen de docent die de bijbehorende link bezit mag de inzendingen lezen.
CREATE POLICY "Docent kan eigen inzendingen lezen" ON mail_inzendingen
  FOR SELECT TO authenticated
  USING (
    link_id IN (SELECT id FROM mail_links WHERE docent_id = auth.uid())
  );

-- Realtime aanzetten zodat inzendingen live binnenkomen bij de docent.
ALTER PUBLICATION supabase_realtime ADD TABLE mail_inzendingen;
