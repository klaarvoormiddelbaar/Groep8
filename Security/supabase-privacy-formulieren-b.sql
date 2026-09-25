-- PRIVACY STAP 5B — Tips en Tops: lijst met codes dichtzetten
-- Voer dit pas uit NADAT stap 5A is uitgevoerd EN ik heb gezegd dat de nieuwe pagina's live staan.
-- Plak in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql  en klik Run.
-- Daarna kan de openbare sleutel de codes en leerkracht-id's niet meer opvragen; leerlingen gebruiken de functie.
-- Een leerkracht ziet alleen de eigen code (nu kan elke ingelogde leerkracht alle codes zien).

BEGIN;
DROP POLICY IF EXISTS "Code opzoeken is openbaar" ON public.tips_en_tops_links;
DROP POLICY IF EXISTS "Leerkracht leest eigen code" ON public.tips_en_tops_links;
CREATE POLICY "Leerkracht leest eigen code" ON public.tips_en_tops_links
  FOR SELECT TO authenticated USING (auth.uid() = leerkracht_id);
REVOKE SELECT ON public.tips_en_tops_links FROM anon;
COMMIT;

SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'tips_en_tops_links' ORDER BY 1;

-- TERUGDRAAIEN:
--   GRANT SELECT ON public.tips_en_tops_links TO anon;
--   CREATE POLICY "Code opzoeken is openbaar" ON public.tips_en_tops_links FOR SELECT TO anon, authenticated USING (true);
