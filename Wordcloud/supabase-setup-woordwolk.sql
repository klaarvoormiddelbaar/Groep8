-- ══════════════════════════════════════════════════════════════════════════════
-- SUPABASE SETUP — Woordenwolk
-- Uitvoeren in: Supabase Dashboard → SQL Editor
-- Veilig om meerdere keren uit te voeren.
-- ══════════════════════════════════════════════════════════════════════════════

-- Tabellen aanmaken (als ze nog niet bestaan)
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

-- Realtime inschakelen (fout wordt genegeerd als tabel al in publicatie zit)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE wordcloud_sessions;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE wordcloud_submissions;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- RLS inschakelen
ALTER TABLE wordcloud_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE wordcloud_submissions ENABLE ROW LEVEL SECURITY;

-- Oude policies verwijderen
DROP POLICY IF EXISTS "Woordenwolk sessies open"               ON wordcloud_sessions;
DROP POLICY IF EXISTS "wordcloud_sessions open"                ON wordcloud_sessions;
DROP POLICY IF EXISTS "leerling_woordenwolk_sessie_zoeken"     ON wordcloud_sessions;
DROP POLICY IF EXISTS "docent_woordenwolk_sessie_beheren"      ON wordcloud_sessions;
DROP POLICY IF EXISTS "woordenwolk_sessie_lezen"               ON wordcloud_sessions;
DROP POLICY IF EXISTS "woordenwolk_sessie_aanmaken"            ON wordcloud_sessions;
DROP POLICY IF EXISTS "woordenwolk_sessie_bijwerken"           ON wordcloud_sessions;
DROP POLICY IF EXISTS "docent_woordenwolk_sessie_verwijderen"  ON wordcloud_sessions;

DROP POLICY IF EXISTS "Woordenwolk inzendingen open"           ON wordcloud_submissions;
DROP POLICY IF EXISTS "wordcloud_submissions open"             ON wordcloud_submissions;
DROP POLICY IF EXISTS "leerling_woord_insturen"                ON wordcloud_submissions;
DROP POLICY IF EXISTS "leerling_woordenwolk_zien"              ON wordcloud_submissions;
DROP POLICY IF EXISTS "leerling_eigen_woord_verwijderen"       ON wordcloud_submissions;
DROP POLICY IF EXISTS "docent_woordenwolk_beheren"             ON wordcloud_submissions;

-- Nieuwe policies
CREATE POLICY "woordenwolk_sessie_lezen"     ON wordcloud_sessions FOR SELECT TO anon USING (true);
CREATE POLICY "woordenwolk_sessie_aanmaken"  ON wordcloud_sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "woordenwolk_sessie_bijwerken" ON wordcloud_sessions FOR UPDATE TO anon USING (true);

CREATE POLICY "woord_insturen"    ON wordcloud_submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "woord_lezen"       ON wordcloud_submissions FOR SELECT TO anon USING (true);
CREATE POLICY "woord_verwijderen" ON wordcloud_submissions FOR DELETE TO anon USING (true);
