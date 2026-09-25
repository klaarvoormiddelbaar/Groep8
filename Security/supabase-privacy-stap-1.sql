-- PRIVACY STAP 1 — afschermen zonder dat er iets aan de pagina's verandert
-- Plak in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql  en klik Run.
--
-- Wat dit doet:
--  1. Verwijdert de oude "iedereen mag lezen en schrijven"-regels (answers, participants, questions,
--     sessions). Daardoor kon iedereen met de openbare sleutel vragen, sessies en scores aanpassen.
--     Leerlingen houden precies de rechten die de huidige pagina's nodig hebben (zie stap 3).
--  2. Sluit de oude, ongebruikte tabellen wordcloud_sessions / wordcloud_submissions volledig af.
--  3. Zet de rechten van de openbare sleutel (anon) per tabel terug naar het minimum:
--     alleen wat de leerlingpagina's aantoonbaar gebruiken. Docenttabellen (profiles met e-mail,
--     links, quizsessies, quizvragen, ...) zijn voor de openbare sleutel dan niet meer bereikbaar.
--  4. Haalt gevaarlijke rechten weg (TRUNCATE, TRIGGER, REFERENCES) van anon.
--
-- Docenten (ingelogd) merken hier niets van. Terugdraaien kan; onderaan staat hoe.

BEGIN;

-- 1. Oude "iedereen mag alles"-regels weg -----------------------------------------------------------
DROP POLICY IF EXISTS "iedereen mag lezen en schrijven - answers"      ON public.answers;
DROP POLICY IF EXISTS "iedereen mag lezen en schrijven - participants" ON public.participants;
DROP POLICY IF EXISTS "iedereen mag lezen en schrijven - questions"    ON public.questions;
DROP POLICY IF EXISTS "iedereen mag lezen en schrijven - sessions"     ON public.sessions;

-- 2. Oude woordenwolk-tabellen (nergens meer in gebruik) --------------------------------------------
DROP POLICY IF EXISTS "Woordenwolk sessies open"     ON public.wordcloud_sessions;
DROP POLICY IF EXISTS "Woordenwolk inzendingen open" ON public.wordcloud_submissions;
REVOKE ALL ON public.wordcloud_sessions, public.wordcloud_submissions FROM anon;

-- 3. anon: alles intrekken op alle tabellen en weergaven, daarna alleen teruggeven wat nodig is -------
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT c.relname FROM pg_class c
           WHERE c.relnamespace = 'public'::regnamespace AND c.relkind IN ('r','v','m','p') LOOP
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', r.relname);
  END LOOP;
END $$;

-- KvM Quiz (les 2, 4, 6) en Live poll: leerlingen
GRANT SELECT                 ON public.sessions               TO anon;
GRANT SELECT                 ON public.questions              TO anon;
GRANT SELECT, INSERT, UPDATE ON public.participants           TO anon;
GRANT INSERT                 ON public.answers                TO anon;
GRANT SELECT                 ON public.poll_statements        TO anon;
GRANT SELECT, INSERT         ON public.poll_responses         TO anon;
-- Open Boek Quiz: leerlingen (verder alles via functies)
GRANT INSERT                 ON public.quiz_deelnemers        TO anon;
-- KlasKompas (Voorspel de Klas)
GRANT SELECT                 ON public.voorspel_sessies       TO anon;
GRANT SELECT, INSERT         ON public.voorspel_deelnemers    TO anon;
GRANT INSERT                 ON public.voorspel_antwoorden    TO anon;
GRANT INSERT                 ON public.voorspel_open_antwoorden TO anon;
-- Woordenwolk
GRANT SELECT                 ON public.woordwolk_sessies      TO anon;
GRANT INSERT                 ON public.woordwolk_deelnemers   TO anon;
GRANT SELECT, INSERT         ON public.woordwolk_woorden      TO anon;
-- Missie Middelbaar (wordt in een volgende stap ook via functies gedaan)
GRANT SELECT, INSERT, UPDATE ON public.missie_groepjes        TO anon;
-- Formele Mail en Tips en Tops
GRANT INSERT                 ON public.mail_inzendingen       TO anon;
GRANT SELECT                 ON public.tips_en_tops_links     TO anon;
GRANT INSERT                 ON public.tips_en_tops_reacties  TO anon;

-- Functies (rpc) die leerlingen aanroepen blijven werken: die krijgen hun recht via EXECUTE, niet via tabellen.

COMMIT;

-- Controle: dit moet precies bovenstaande lijst laten zien (en niets van profiles, *_links behalve tips_en_tops_links,
-- quiz_sessions, quiz_vragen, wordcloud_*):
SELECT table_name, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS anon_rechten
FROM information_schema.role_table_grants
WHERE grantee = 'anon' AND table_schema = 'public'
GROUP BY table_name ORDER BY table_name;

-- TERUGDRAAIEN (alleen als er iets misgaat): geef anon weer alle rechten op een tabel, bijvoorbeeld
--   GRANT ALL ON public.sessions TO anon;
-- en maak de oude regel opnieuw:
--   CREATE POLICY "iedereen mag lezen en schrijven - sessions" ON public.sessions FOR ALL TO public USING (true) WITH CHECK (true);
