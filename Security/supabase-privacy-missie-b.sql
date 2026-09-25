-- PRIVACY STAP 2B — Missie Middelbaar: tabel volledig dichtzetten voor leerlingen
-- Voer dit pas uit NADAT stap 2A is uitgevoerd EN de nieuwe Missie-pagina's live staan (ik zeg wanneer).
-- Plak in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql  en klik Run.
--
-- Daarna kan niemand met de openbare sleutel of een willekeurig docentaccount nog groepjes lezen,
-- aanmaken of wijzigen. Alleen nog: de eigen docent leest/verwijdert groepjes van de eigen klas,
-- en leerlingen gebruiken de drie functies uit stap 2A.

BEGIN;
DROP POLICY IF EXISTS "Iedereen kan lezen en schrijven"     ON public.missie_groepjes;
DROP POLICY IF EXISTS "Leerling kan groepje aanmaken"       ON public.missie_groepjes;
DROP POLICY IF EXISTS "Leerling kan groepje bijwerken"      ON public.missie_groepjes;
DROP POLICY IF EXISTS "Leerling kan groepje lezen"          ON public.missie_groepjes;
REVOKE ALL ON public.missie_groepjes FROM anon;
COMMIT;

-- Controle: alleen de twee docentregels (lezen, verwijderen) mogen overblijven
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'missie_groepjes';

-- TERUGDRAAIEN als er iets misgaat:
--   GRANT SELECT, INSERT, UPDATE ON public.missie_groepjes TO anon;
--   CREATE POLICY "Iedereen kan lezen en schrijven" ON public.missie_groepjes FOR ALL TO anon USING (true) WITH CHECK (true);
