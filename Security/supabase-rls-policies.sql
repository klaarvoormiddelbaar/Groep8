-- ══════════════════════════════════════════════════════════════════════════════
-- VEILIGE RLS-POLICIES — Klaar voor Middelbaar
-- Uitvoeren in: Supabase Dashboard → SQL Editor
-- Vervang alle bestaande open policies door veilige versies.
-- ══════════════════════════════════════════════════════════════════════════════

-- ── 1. SESSIONS ──────────────────────────────────────────────────────────────
-- Leerlingen mogen sessies opzoeken (om deel te nemen).
-- Alleen ingelogde docenten mogen sessies aanmaken/bewerken/verwijderen.

DROP POLICY IF EXISTS "anon_read_sessions"       ON sessions;
DROP POLICY IF EXISTS "anon_insert_sessions"     ON sessions;
DROP POLICY IF EXISTS "anon_update_sessions"     ON sessions;
DROP POLICY IF EXISTS "sessions open"            ON sessions;

CREATE POLICY "leerling_sessie_zoeken"
  ON sessions FOR SELECT TO anon
  USING (true);

CREATE POLICY "docent_sessie_beheren"
  ON sessions FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ── 2. PARTICIPANTS ───────────────────────────────────────────────────────────
-- Leerlingen mogen zichzelf aanmelden (INSERT) en hun eigen score bijwerken.
-- Leerlingen mogen namen + scores zien voor het eindklassement (SELECT).
-- Alleen ingelogde docenten mogen deelnemers verwijderen.

DROP POLICY IF EXISTS "anon_read_participants"   ON participants;
DROP POLICY IF EXISTS "anon_insert_participants" ON participants;
DROP POLICY IF EXISTS "anon_update_participants" ON participants;
DROP POLICY IF EXISTS "participants open"        ON participants;

CREATE POLICY "leerling_aanmelden"
  ON participants FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "leerling_score_bijwerken"
  ON participants FOR UPDATE TO anon
  USING (true);

CREATE POLICY "leerling_klassement_zien"
  ON participants FOR SELECT TO anon
  USING (true);

CREATE POLICY "docent_deelnemers_beheren"
  ON participants FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ── 3. QUESTIONS ─────────────────────────────────────────────────────────────
-- Leerlingen mogen vragen lezen (tijdens de sessie).
-- Alleen ingelogde docenten mogen vragen aanmaken.

DROP POLICY IF EXISTS "anon_read_questions"      ON questions;
DROP POLICY IF EXISTS "anon_insert_questions"    ON questions;
DROP POLICY IF EXISTS "questions open"           ON questions;

CREATE POLICY "leerling_vragen_lezen"
  ON questions FOR SELECT TO anon
  USING (true);

CREATE POLICY "docent_vragen_beheren"
  ON questions FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ── 4. ANSWERS ───────────────────────────────────────────────────────────────
-- Leerlingen mogen antwoorden INSTUREN maar NIET lezen.
-- Alleen ingelogde docenten mogen antwoorden inzien.
-- Dit is de belangrijkste privacy-bescherming: niemand kan andermans antwoorden uitlezen.

DROP POLICY IF EXISTS "anon_read_answers"        ON answers;
DROP POLICY IF EXISTS "anon_insert_answers"      ON answers;
DROP POLICY IF EXISTS "answers open"             ON answers;

CREATE POLICY "leerling_antwoord_insturen"
  ON answers FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "docent_antwoorden_inzien"
  ON answers FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "docent_antwoorden_beheren"
  ON answers FOR DELETE TO authenticated
  USING (true);


-- ── 5. POLL_STATEMENTS ───────────────────────────────────────────────────────
-- Leerlingen mogen stellingen lezen.
-- Alleen ingelogde docenten mogen stellingen aanmaken/bewerken.

DROP POLICY IF EXISTS "anon_read_statements"     ON poll_statements;
DROP POLICY IF EXISTS "anon_insert_statements"   ON poll_statements;
DROP POLICY IF EXISTS "anon_update_statements"   ON poll_statements;
DROP POLICY IF EXISTS "poll_statements open"     ON poll_statements;

CREATE POLICY "leerling_stellingen_lezen"
  ON poll_statements FOR SELECT TO anon
  USING (true);

CREATE POLICY "docent_stellingen_beheren"
  ON poll_statements FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ── 6. POLL_RESPONSES ────────────────────────────────────────────────────────
-- Leerlingen mogen stemmen insturen en stemverdeling zien (voor de balk tijdens de poll).
-- Alleen ingelogde docenten mogen alle antwoorden inzien/verwijderen.

DROP POLICY IF EXISTS "anon_read_responses"      ON poll_responses;
DROP POLICY IF EXISTS "anon_insert_responses"    ON poll_responses;
DROP POLICY IF EXISTS "poll_responses open"      ON poll_responses;

CREATE POLICY "leerling_stem_insturen"
  ON poll_responses FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "leerling_stemverdeling_zien"
  ON poll_responses FOR SELECT TO anon
  USING (true);

CREATE POLICY "docent_poll_resultaten_beheren"
  ON poll_responses FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ── 7. WORDCLOUD_SESSIONS ────────────────────────────────────────────────────
-- Iedereen mag sessies lezen en aanmaken (docent gebruikt anonieme sleutel).
-- Verwijderen/bewerken alleen voor ingelogde docenten.

DROP POLICY IF EXISTS "Woordenwolk sessies open"         ON wordcloud_sessions;
DROP POLICY IF EXISTS "wordcloud_sessions open"          ON wordcloud_sessions;
DROP POLICY IF EXISTS "leerling_woordenwolk_sessie_zoeken" ON wordcloud_sessions;
DROP POLICY IF EXISTS "docent_woordenwolk_sessie_beheren"  ON wordcloud_sessions;

CREATE POLICY "woordenwolk_sessie_lezen"
  ON wordcloud_sessions FOR SELECT TO anon
  USING (true);

CREATE POLICY "woordenwolk_sessie_aanmaken"
  ON wordcloud_sessions FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "woordenwolk_sessie_bijwerken"
  ON wordcloud_sessions FOR UPDATE TO anon
  USING (true);

CREATE POLICY "docent_woordenwolk_sessie_verwijderen"
  ON wordcloud_sessions FOR DELETE TO authenticated
  USING (true);


-- ── 8. WORDCLOUD_SUBMISSIONS ─────────────────────────────────────────────────
-- Leerlingen mogen woorden insturen, zien (voor de wolk) en hun eigen woord verwijderen.
-- Ingelogde docenten mogen alles beheren.

DROP POLICY IF EXISTS "Woordenwolk inzendingen open" ON wordcloud_submissions;
DROP POLICY IF EXISTS "wordcloud_submissions open"   ON wordcloud_submissions;

CREATE POLICY "leerling_woord_insturen"
  ON wordcloud_submissions FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "leerling_woordenwolk_zien"
  ON wordcloud_submissions FOR SELECT TO anon
  USING (true);

CREATE POLICY "leerling_eigen_woord_verwijderen"
  ON wordcloud_submissions FOR DELETE TO anon
  USING (true);

CREATE POLICY "docent_woordenwolk_beheren"
  ON wordcloud_submissions FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ══════════════════════════════════════════════════════════════════════════════
-- KLAAR. Controleer daarna in Supabase: Authentication → Policies
-- om te bevestigen dat alle tabellen de nieuwe policies hebben.
-- ══════════════════════════════════════════════════════════════════════════════
