-- PRIVACY STAP 3B — Woordwolk: namen echt dichtzetten
-- Voer dit pas uit NADAT stap 3A is uitgevoerd EN ik heb gezegd dat de nieuwe Woordwolk-pagina's live staan.
-- Plak in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql  en klik Run.
--
-- Daarna: leerlingen (openbare sleutel) kunnen woorden alleen nog insturen en via de functie zonder naam lezen;
-- een docent ziet alleen de woorden van de eigen sessies (nu kan elke ingelogde docent alles lezen).
-- Insturen kan alleen nog naar een sessie die bestaat en niet is afgelopen.

BEGIN;
DROP POLICY IF EXISTS "Woorden zijn zichtbaar voor klas en docent" ON public.woordwolk_woorden;
DROP POLICY IF EXISTS "Leerling kan woord insturen"                ON public.woordwolk_woorden;
DROP POLICY IF EXISTS "Docent kan eigen woorden lezen"             ON public.woordwolk_woorden;

CREATE POLICY "Docent kan eigen woorden lezen" ON public.woordwolk_woorden
  FOR SELECT TO authenticated
  USING (sessie_id IN (SELECT s.id FROM woordwolk_sessies s JOIN woordwolk_links l ON l.id = s.link_id
                       WHERE l.docent_id = auth.uid()));

CREATE POLICY "Leerling kan woord insturen" ON public.woordwolk_woorden
  FOR INSERT TO anon
  WITH CHECK (EXISTS (SELECT 1 FROM woordwolk_sessies s WHERE s.id = sessie_id AND s.status <> 'afgelopen'));

REVOKE SELECT ON public.woordwolk_woorden FROM anon;
COMMIT;

-- Controle
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'woordwolk_woorden' ORDER BY 1;

-- TERUGDRAAIEN als er iets misgaat:
--   GRANT SELECT ON public.woordwolk_woorden TO anon;
--   CREATE POLICY "Woorden zijn zichtbaar voor klas en docent" ON public.woordwolk_woorden FOR SELECT TO anon, authenticated USING (true);
