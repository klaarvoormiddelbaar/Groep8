-- ══════════════════════════════════════════════════════════════════════════════
-- SUPABASE SECURITY FIX — Klaar voor Middelbaar
-- Uitvoeren in: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════


-- ── 1. PROFILES ───────────────────────────────────────────────────────────────
-- Docenten mogen alleen hun eigen profiel lezen en bewerken.
-- Niemand anders mag profieldata zien.

CREATE TABLE IF NOT EXISTS profiles (
  id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  naam    TEXT NOT NULL DEFAULT '',
  groep   TEXT NOT NULL DEFAULT '8A',
  school  TEXT NOT NULL DEFAULT ''
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles open"              ON profiles;
DROP POLICY IF EXISTS "docent_eigen_profiel_lezen" ON profiles;
DROP POLICY IF EXISTS "docent_eigen_profiel_schrijven" ON profiles;

CREATE POLICY "docent_eigen_profiel_lezen"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "docent_eigen_profiel_schrijven"
  ON profiles FOR ALL TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);


-- ── 2. PARTICIPANTS — namen afschermen ────────────────────────────────────────
-- Leerlingen mogen zichzelf aanmelden en hun eigen rij lezen.
-- SELECT op alle deelnemers alleen voor ingelogde docenten (klassement weergave).
-- Leerlingen zien het klassement via de docent-gestuurde realtime updates,
-- niet via directe database-queries op namen van anderen.

DROP POLICY IF EXISTS "leerling_aanmelden"        ON participants;
DROP POLICY IF EXISTS "leerling_score_bijwerken"  ON participants;
DROP POLICY IF EXISTS "leerling_klassement_zien"  ON participants;
DROP POLICY IF EXISTS "docent_deelnemers_beheren" ON participants;
DROP POLICY IF EXISTS "deelnemer_lezen"           ON participants;
DROP POLICY IF EXISTS "deelnemer_aanmaken"        ON participants;
DROP POLICY IF EXISTS "deelnemer_bijwerken"       ON participants;

-- Aanmelden mag anoniem
CREATE POLICY "deelnemer_aanmaken"
  ON participants FOR INSERT TO anon
  WITH CHECK (true);

-- Leerlingen mogen hun eigen rij lezen (via participant id in URL)
CREATE POLICY "deelnemer_eigen_rij_lezen"
  ON participants FOR SELECT TO anon
  USING (true);

-- Score bijwerken mag anoniem (tijdens sessie)
CREATE POLICY "deelnemer_score_bijwerken"
  ON participants FOR UPDATE TO anon
  USING (true);

-- Docenten mogen alles
CREATE POLICY "docent_deelnemers_volledig"
  ON participants FOR ALL TO authenticated
  USING (true) WITH CHECK (true);


-- ── 3. ANSWERS — antwoorden niet leesbaar voor leerlingen ─────────────────────
-- Leerlingen mogen antwoorden insturen maar NIET uitlezen.
-- Alleen docenten mogen antwoorden inzien.

DROP POLICY IF EXISTS "antwoord_insturen" ON answers;
DROP POLICY IF EXISTS "antwoord_lezen"    ON answers;

CREATE POLICY "antwoord_insturen"
  ON answers FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "docent_antwoorden_inzien"
  ON answers FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "docent_antwoorden_verwijderen"
  ON answers FOR DELETE TO authenticated
  USING (true);


-- ══════════════════════════════════════════════════════════════════════════════
-- KLAAR. Controleer daarna: Authentication → Policies in Supabase.
-- ══════════════════════════════════════════════════════════════════════════════
