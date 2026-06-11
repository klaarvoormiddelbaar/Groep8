-- ══════════════════════════════════════════════════════════════════════════════
-- SUPABASE SECURITY SETUP — Klaar voor Middelbaar
-- Uitvoeren in: Supabase Dashboard → SQL Editor
-- Veilig om meerdere keren uit te voeren.
-- ══════════════════════════════════════════════════════════════════════════════


-- ── PROFILES ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  naam    TEXT NOT NULL DEFAULT '',
  groep   TEXT NOT NULL DEFAULT '8A',
  school  TEXT NOT NULL DEFAULT ''
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles open"                    ON profiles;
DROP POLICY IF EXISTS "docent_eigen_profiel_lezen"       ON profiles;
DROP POLICY IF EXISTS "docent_eigen_profiel_schrijven"   ON profiles;

CREATE POLICY "docent_eigen_profiel_lezen"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "docent_eigen_profiel_schrijven"
  ON profiles FOR ALL TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);


-- ── PARTICIPANTS ───────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "leerling_aanmelden"               ON participants;
DROP POLICY IF EXISTS "leerling_score_bijwerken"         ON participants;
DROP POLICY IF EXISTS "leerling_klassement_zien"         ON participants;
DROP POLICY IF EXISTS "docent_deelnemers_beheren"        ON participants;
DROP POLICY IF EXISTS "deelnemer_lezen"                  ON participants;
DROP POLICY IF EXISTS "deelnemer_aanmaken"               ON participants;
DROP POLICY IF EXISTS "deelnemer_bijwerken"              ON participants;
DROP POLICY IF EXISTS "deelnemer_eigen_rij_lezen"        ON participants;
DROP POLICY IF EXISTS "deelnemer_score_bijwerken"        ON participants;
DROP POLICY IF EXISTS "docent_deelnemers_volledig"       ON participants;

CREATE POLICY "deelnemer_aanmaken"
  ON participants FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "deelnemer_eigen_rij_lezen"
  ON participants FOR SELECT TO anon USING (true);

CREATE POLICY "deelnemer_score_bijwerken"
  ON participants FOR UPDATE TO anon USING (true);

CREATE POLICY "docent_deelnemers_volledig"
  ON participants FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ── ANSWERS ───────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_read_answers"                ON answers;
DROP POLICY IF EXISTS "anon_insert_answers"              ON answers;
DROP POLICY IF EXISTS "answers open"                     ON answers;
DROP POLICY IF EXISTS "leerling_antwoord_insturen"       ON answers;
DROP POLICY IF EXISTS "docent_antwoorden_inzien"         ON answers;
DROP POLICY IF EXISTS "docent_antwoorden_beheren"        ON answers;
DROP POLICY IF EXISTS "antwoord_insturen"                ON answers;
DROP POLICY IF EXISTS "antwoord_lezen"                   ON answers;
DROP POLICY IF EXISTS "docent_antwoorden_verwijderen"    ON answers;

CREATE POLICY "antwoord_insturen"
  ON answers FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "docent_antwoorden_inzien"
  ON answers FOR SELECT TO authenticated USING (true);

CREATE POLICY "docent_antwoorden_verwijderen"
  ON answers FOR DELETE TO authenticated USING (true);


-- ══════════════════════════════════════════════════════════════════════════════
-- KLAAR.
-- ══════════════════════════════════════════════════════════════════════════════
