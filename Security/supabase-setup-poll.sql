-- ══════════════════════════════════════════════════════════════════════════════
-- SUPABASE SETUP — Live Poll (stellingen)
-- Uitvoeren in: Supabase Dashboard → SQL Editor
-- Vereist dat de 'sessions' en 'participants' tabellen al bestaan (van de quiz).
-- Veilig om meerdere keren uit te voeren.
-- ══════════════════════════════════════════════════════════════════════════════

-- Tabellen aanmaken
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

-- Realtime inschakelen
ALTER PUBLICATION supabase_realtime ADD TABLE poll_statements;
ALTER PUBLICATION supabase_realtime ADD TABLE poll_responses;

-- RLS inschakelen
ALTER TABLE poll_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_responses  ENABLE ROW LEVEL SECURITY;

-- Oude policies verwijderen
DROP POLICY IF EXISTS "anon_read_statements"           ON poll_statements;
DROP POLICY IF EXISTS "anon_insert_statements"         ON poll_statements;
DROP POLICY IF EXISTS "anon_update_statements"         ON poll_statements;
DROP POLICY IF EXISTS "poll_statements open"           ON poll_statements;
DROP POLICY IF EXISTS "leerling_stellingen_lezen"      ON poll_statements;
DROP POLICY IF EXISTS "docent_stellingen_beheren"      ON poll_statements;
DROP POLICY IF EXISTS "stelling_lezen"                 ON poll_statements;
DROP POLICY IF EXISTS "stelling_aanmaken"              ON poll_statements;
DROP POLICY IF EXISTS "stelling_bijwerken"             ON poll_statements;
DROP POLICY IF EXISTS "docent_stelling_alles"          ON poll_statements;

DROP POLICY IF EXISTS "anon_read_responses"            ON poll_responses;
DROP POLICY IF EXISTS "anon_insert_responses"          ON poll_responses;
DROP POLICY IF EXISTS "poll_responses open"            ON poll_responses;
DROP POLICY IF EXISTS "leerling_stem_insturen"         ON poll_responses;
DROP POLICY IF EXISTS "leerling_stemverdeling_zien"    ON poll_responses;
DROP POLICY IF EXISTS "docent_poll_resultaten_beheren" ON poll_responses;
DROP POLICY IF EXISTS "stem_insturen"                  ON poll_responses;
DROP POLICY IF EXISTS "stem_lezen"                     ON poll_responses;
DROP POLICY IF EXISTS "docent_stem_alles"              ON poll_responses;

-- Nieuwe policies — poll_statements
-- Leerling (anon): lezen + stemmen
CREATE POLICY "stelling_lezen"        ON poll_statements FOR SELECT TO anon      USING (true);
CREATE POLICY "stelling_bijwerken"    ON poll_statements FOR UPDATE TO anon      USING (true);
-- Docent (authenticated): alles (aanmaken, activeren, sluiten)
CREATE POLICY "docent_stelling_alles" ON poll_statements FOR ALL    TO authenticated USING (true) WITH CHECK (true);

-- Nieuwe policies — poll_responses
-- Leerling (anon): stem insturen + teller zien
CREATE POLICY "stem_insturen"         ON poll_responses FOR INSERT TO anon      WITH CHECK (true);
CREATE POLICY "stem_lezen"            ON poll_responses FOR SELECT TO anon      USING (true);
-- Docent (authenticated): resultaten inzien + beheren
CREATE POLICY "docent_stem_alles"     ON poll_responses FOR ALL    TO authenticated USING (true) WITH CHECK (true);
