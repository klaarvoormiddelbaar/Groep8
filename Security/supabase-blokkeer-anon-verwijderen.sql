-- Beveiligingsfix (gevonden tijdens de belastingtest, 24-09-2026)
-- Plak dit hele bestand in de SQL Editor en voer het in één keer uit:
-- https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql
--
-- Probleem: met de publieke anon-sleutel (die in elke leerlingpagina staat) kon
-- iedereen rijen VERWIJDEREN uit o.a. sessions, participants, questions, answers
-- en missie_groepjes — ook van andere docenten/klassen.
-- Geen enkele leerlingpagina heeft verwijderen nodig; alleen ingelogde docenten
-- (rol 'authenticated') verwijderen iets. Die blijven gewoon werken.

-- 1. Anonieme bezoekers mogen in geen enkele tabel meer iets verwijderen.
REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM anon;

-- 2. Ook niet in tabellen die later worden aangemaakt.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE DELETE ON TABLES FROM anon;

-- 3. Docent mag groepjes van zijn/haar EIGEN missie-link verwijderen
--    (knoppen "Groepje verwijderen" / "Alle groepjes verwijderen" in Missie Middelbaar/docent.html).
DROP POLICY IF EXISTS "Docent kan eigen klas groepjes verwijderen" ON missie_groepjes;
CREATE POLICY "Docent kan eigen klas groepjes verwijderen" ON missie_groepjes
  FOR DELETE TO authenticated
  USING (link_id IN (SELECT id FROM missie_links WHERE docent_id = auth.uid()));

-- Controle: deze query moet 0 rijen teruggeven (geen tabel waar anon nog mag verwijderen).
SELECT table_name
FROM information_schema.role_table_grants
WHERE grantee = 'anon' AND privilege_type = 'DELETE' AND table_schema = 'public';
