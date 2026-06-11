-- ══════════════════════════════════════════════════════════════════════════════
-- SUPABASE SETUP — Klaar voor Middelbaar
-- Uitvoeren in: Supabase Dashboard → SQL Editor
-- Dit bestand maakt ontbrekende tabellen aan en zet alle RLS-policies correct.
-- Veilig om meerdere keren uit te voeren (IF NOT EXISTS / DROP IF EXISTS).
-- ══════════════════════════════════════════════════════════════════════════════


-- ── TABELLEN AANMAKEN ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sessions (
  id                   UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  code                 TEXT        NOT NULL,
  les_id               TEXT,
  docent_naam          TEXT        NOT NULL DEFAULT '',
  status               TEXT        NOT NULL DEFAULT 'lobby',
  huidige_vraag_index  INTEGER     NOT NULL DEFAULT 0,
  aangemaaktop         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS participants (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id   UUID        NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  naam         TEXT        NOT NULL,
  score        INTEGER     NOT NULL DEFAULT 0,
  aangemaaktop TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id   UUID        NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  volgorde     INTEGER     NOT NULL,
  type         TEXT        NOT NULL,
  vraag        TEXT        NOT NULL,
  opties       JSONB,
  goed_index   INTEGER,
  tijdslimiet  INTEGER     NOT NULL DEFAULT 20,
  afbeelding   TEXT,
  aangemaaktop TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS answers (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id     UUID        NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  question_id    UUID        NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  participant_id UUID        NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  antwoord_index INTEGER     NOT NULL,
  is_correct     BOOLEAN,
  punten         INTEGER     NOT NULL DEFAULT 0,
  ingediend_op   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(question_id, participant_id)
);

CREATE TABLE IF NOT EXISTS poll_statements (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  UUID        NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  tekst       TEXT        NOT NULL,
  volgorde    INTEGER     NOT NULL,
  status      TEXT        DEFAULT 'waiting' CHECK (status IN ('waiting','active','closed')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS poll_responses (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id     UUID        NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  statement_id   UUID        NOT NULL REFERENCES poll_statements(id) ON DELETE CASCADE,
  participant_id UUID        NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  score          INTEGER     NOT NULL CHECK (score BETWEEN 1 AND 5),
  created_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE(statement_id, participant_id)
);

CREATE TABLE IF NOT EXISTS wordcloud_sessions (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  code         TEXT        NOT NULL,
  les_id       TEXT,
  les_titel    TEXT,
  docent_naam  TEXT        NOT NULL DEFAULT '',
  status       TEXT        NOT NULL DEFAULT 'lobby',
  aangemaaktop TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wordcloud_submissions (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id    UUID        NOT NULL REFERENCES wordcloud_sessions(id) ON DELETE CASCADE,
  leerling_naam TEXT        NOT NULL,
  woord         TEXT        NOT NULL,
  ingediend_op  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ── REALTIME INSCHAKELEN ──────────────────────────────────────────────────────

ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE participants;
ALTER PUBLICATION supabase_realtime ADD TABLE questions;
ALTER PUBLICATION supabase_realtime ADD TABLE answers;
ALTER PUBLICATION supabase_realtime ADD TABLE poll_statements;
ALTER PUBLICATION supabase_realtime ADD TABLE poll_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE wordcloud_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE wordcloud_submissions;


-- ── RLS INSCHAKELEN ───────────────────────────────────────────────────────────

ALTER TABLE sessions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants         ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers              ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_statements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_responses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE wordcloud_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE wordcloud_submissions ENABLE ROW LEVEL SECURITY;


-- ── POLICIES: SESSIONS ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_read_sessions"              ON sessions;
DROP POLICY IF EXISTS "anon_insert_sessions"            ON sessions;
DROP POLICY IF EXISTS "anon_update_sessions"            ON sessions;
DROP POLICY IF EXISTS "sessions open"                   ON sessions;
DROP POLICY IF EXISTS "leerling_sessie_zoeken"          ON sessions;
DROP POLICY IF EXISTS "docent_sessie_beheren"           ON sessions;

CREATE POLICY "sessie_lezen"    ON sessions FOR SELECT TO anon USING (true);
CREATE POLICY "sessie_aanmaken" ON sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "sessie_bijwerken" ON sessions FOR UPDATE TO anon USING (true);


-- ── POLICIES: PARTICIPANTS ────────────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_read_participants"          ON participants;
DROP POLICY IF EXISTS "anon_insert_participants"        ON participants;
DROP POLICY IF EXISTS "anon_update_participants"        ON participants;
DROP POLICY IF EXISTS "participants open"               ON participants;
DROP POLICY IF EXISTS "leerling_aanmelden"              ON participants;
DROP POLICY IF EXISTS "leerling_score_bijwerken"        ON participants;
DROP POLICY IF EXISTS "leerling_klassement_zien"        ON participants;
DROP POLICY IF EXISTS "docent_deelnemers_beheren"       ON participants;

CREATE POLICY "deelnemer_lezen"    ON participants FOR SELECT TO anon USING (true);
CREATE POLICY "deelnemer_aanmaken" ON participants FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "deelnemer_bijwerken" ON participants FOR UPDATE TO anon USING (true);


-- ── POLICIES: QUESTIONS ───────────────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_read_questions"             ON questions;
DROP POLICY IF EXISTS "anon_insert_questions"           ON questions;
DROP POLICY IF EXISTS "questions open"                  ON questions;
DROP POLICY IF EXISTS "leerling_vragen_lezen"           ON questions;
DROP POLICY IF EXISTS "docent_vragen_beheren"           ON questions;

CREATE POLICY "vragen_lezen"    ON questions FOR SELECT TO anon USING (true);
CREATE POLICY "vragen_aanmaken" ON questions FOR INSERT TO anon WITH CHECK (true);


-- ── POLICIES: ANSWERS ─────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_read_answers"               ON answers;
DROP POLICY IF EXISTS "anon_insert_answers"             ON answers;
DROP POLICY IF EXISTS "answers open"                    ON answers;
DROP POLICY IF EXISTS "leerling_antwoord_insturen"      ON answers;
DROP POLICY IF EXISTS "docent_antwoorden_inzien"        ON answers;
DROP POLICY IF EXISTS "docent_antwoorden_beheren"       ON answers;

CREATE POLICY "antwoord_insturen" ON answers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "antwoord_lezen"    ON answers FOR SELECT TO anon USING (true);


-- ── POLICIES: POLL_STATEMENTS ─────────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_read_statements"            ON poll_statements;
DROP POLICY IF EXISTS "anon_insert_statements"          ON poll_statements;
DROP POLICY IF EXISTS "anon_update_statements"          ON poll_statements;
DROP POLICY IF EXISTS "poll_statements open"            ON poll_statements;
DROP POLICY IF EXISTS "leerling_stellingen_lezen"       ON poll_statements;
DROP POLICY IF EXISTS "docent_stellingen_beheren"       ON poll_statements;

CREATE POLICY "stelling_lezen"    ON poll_statements FOR SELECT TO anon USING (true);
CREATE POLICY "stelling_aanmaken" ON poll_statements FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "stelling_bijwerken" ON poll_statements FOR UPDATE TO anon USING (true);


-- ── POLICIES: POLL_RESPONSES ──────────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_read_responses"             ON poll_responses;
DROP POLICY IF EXISTS "anon_insert_responses"           ON poll_responses;
DROP POLICY IF EXISTS "poll_responses open"             ON poll_responses;
DROP POLICY IF EXISTS "leerling_stem_insturen"          ON poll_responses;
DROP POLICY IF EXISTS "leerling_stemverdeling_zien"     ON poll_responses;
DROP POLICY IF EXISTS "docent_poll_resultaten_beheren"  ON poll_responses;

CREATE POLICY "stem_insturen" ON poll_responses FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "stem_lezen"    ON poll_responses FOR SELECT TO anon USING (true);


-- ── POLICIES: WORDCLOUD_SESSIONS ──────────────────────────────────────────────

DROP POLICY IF EXISTS "Woordenwolk sessies open"              ON wordcloud_sessions;
DROP POLICY IF EXISTS "wordcloud_sessions open"               ON wordcloud_sessions;
DROP POLICY IF EXISTS "leerling_woordenwolk_sessie_zoeken"    ON wordcloud_sessions;
DROP POLICY IF EXISTS "docent_woordenwolk_sessie_beheren"     ON wordcloud_sessions;
DROP POLICY IF EXISTS "woordenwolk_sessie_lezen"              ON wordcloud_sessions;
DROP POLICY IF EXISTS "woordenwolk_sessie_aanmaken"           ON wordcloud_sessions;
DROP POLICY IF EXISTS "woordenwolk_sessie_bijwerken"          ON wordcloud_sessions;
DROP POLICY IF EXISTS "docent_woordenwolk_sessie_verwijderen" ON wordcloud_sessions;

CREATE POLICY "woordenwolk_sessie_lezen"    ON wordcloud_sessions FOR SELECT TO anon USING (true);
CREATE POLICY "woordenwolk_sessie_aanmaken" ON wordcloud_sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "woordenwolk_sessie_bijwerken" ON wordcloud_sessions FOR UPDATE TO anon USING (true);


-- ── POLICIES: WORDCLOUD_SUBMISSIONS ──────────────────────────────────────────

DROP POLICY IF EXISTS "Woordenwolk inzendingen open"    ON wordcloud_submissions;
DROP POLICY IF EXISTS "wordcloud_submissions open"      ON wordcloud_submissions;
DROP POLICY IF EXISTS "leerling_woord_insturen"         ON wordcloud_submissions;
DROP POLICY IF EXISTS "leerling_woordenwolk_zien"       ON wordcloud_submissions;
DROP POLICY IF EXISTS "leerling_eigen_woord_verwijderen" ON wordcloud_submissions;
DROP POLICY IF EXISTS "docent_woordenwolk_beheren"      ON wordcloud_submissions;

CREATE POLICY "woord_insturen"  ON wordcloud_submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "woord_lezen"     ON wordcloud_submissions FOR SELECT TO anon USING (true);
CREATE POLICY "woord_verwijderen" ON wordcloud_submissions FOR DELETE TO anon USING (true);


-- ══════════════════════════════════════════════════════════════════════════════
-- KLAAR.
-- ══════════════════════════════════════════════════════════════════════════════
