-- PRIVACY STAP 4B — KvM Kwiz en PollParty: tabellen dichtzetten voor leerlingen
-- Voer dit pas uit NADAT stap 4A is uitgevoerd EN ik heb gezegd dat de nieuwe pagina's live staan.
-- Plak in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql  en klik Run.
--
-- Daarna kan de openbare sleutel: geen namen of scores meer lezen, geen scores meer aanpassen,
-- geen vragen (met goede antwoorden) meer lezen en geen antwoorden meer rechtstreeks invoegen.
-- Meedoen (naam invoeren) kan nog, maar alleen bij een sessie die niet is afgelopen.
-- Leerlingen gebruiken de functies uit 4A.

BEGIN;
DROP POLICY IF EXISTS "leerling_klassement_zien"    ON public.participants;
DROP POLICY IF EXISTS "leerling_score_bijwerken"    ON public.participants;
DROP POLICY IF EXISTS "leerling_aanmelden"          ON public.participants;
DROP POLICY IF EXISTS "leerling_vragen_lezen"       ON public.questions;
DROP POLICY IF EXISTS "leerling_antwoord_insturen"  ON public.answers;

CREATE POLICY "leerling_aanmelden" ON public.participants
  FOR INSERT TO anon
  WITH CHECK (EXISTS (SELECT 1 FROM sessions s WHERE s.id = session_id AND s.status <> 'ended'));

REVOKE SELECT, UPDATE ON public.participants FROM anon;
REVOKE SELECT         ON public.questions    FROM anon;
REVOKE INSERT         ON public.answers      FROM anon;
COMMIT;

-- Controle
SELECT tablename, policyname, cmd, roles FROM pg_policies
WHERE tablename IN ('participants', 'questions', 'answers') ORDER BY 1, 2;

-- TERUGDRAAIEN als er iets misgaat:
--   GRANT SELECT, UPDATE ON public.participants TO anon;  GRANT SELECT ON public.questions TO anon;  GRANT INSERT ON public.answers TO anon;
--   CREATE POLICY "leerling_klassement_zien" ON public.participants FOR SELECT TO anon USING (true);
--   CREATE POLICY "leerling_score_bijwerken" ON public.participants FOR UPDATE TO anon USING (true);
--   CREATE POLICY "leerling_vragen_lezen" ON public.questions FOR SELECT TO anon USING (true);
--   CREATE POLICY "leerling_antwoord_insturen" ON public.answers FOR INSERT TO anon WITH CHECK (true);
