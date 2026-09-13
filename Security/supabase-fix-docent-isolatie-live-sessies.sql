-- Fix: docent-isolatie voor de gedeelde live-sessietabellen (Live poll + KvM Quiz).
--
-- PROBLEEM: sessions, participants, questions, answers, poll_statements en
-- poll_responses gaven via "FOR ALL TO authenticated USING (true)" elke
-- ingelogde leerkracht volledige lees/schrijf/verwijder-toegang tot de sessie
-- van ELKE ANDERE leerkracht. Twee groep 8-leerkrachten die tegelijk een live
-- poll of de KvM Quiz draaiden, konden zo elkaars sessie zien of bijwerken.
-- Dit bestand lost dat op: elke leerkracht kan alleen nog sessies beheren die
-- hij/zij zelf heeft aangemaakt — hetzelfde patroon als Formele Mail Oefenen,
-- Wordcloud, Voorspel de Klas, Missie Middelbaar en Tips en Tops.
--
-- WAT DIT NIET VERANDERT: leerlingen (anon, niet ingelogd) kunnen nog steeds
-- zonder account de sessie/deelnemers/vragen/stellingen van hún klas lezen en
-- eraan meedoen. Dat blijft zo omdat leerlingen geen account hebben — net als
-- in de rest van de app is het sessie-ID/code de sleutel, niet een login.
--
-- LET OP BIJ UITVOEREN: sessies die vóór het draaien van dit script al actief
-- waren, hebben nog geen docent_id. Voor die (oude, aflopende) sessies blijft
-- tijdelijk elke ingelogde leerkracht toegang houden (via de "OR docent_id IS
-- NULL"-clausule hieronder), zodat een les die op dit moment loopt niet stukgaat.
-- Nieuwe sessies krijgen automatisch wel een docent_id en zijn dus meteen
-- volledig geïsoleerd. Voer dit dus liever buiten lestijd uit.
--
-- Dit bestand is vanaf nu de enige waarheid voor de RLS-policies op sessions,
-- participants, questions, answers, poll_statements en poll_responses. De
-- oudere, onderling tegenstrijdige bestanden in deze map (supabase-setup.sql,
-- supabase-setup-poll.sql, supabase-setup-security.sql, supabase-rls-policies.sql)
-- horen niet meer als laatste gedraaid te worden.
--
-- Veilig om opnieuw te draaien.
-- Plak dit in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql

-- ── Eigenaarschap vastleggen op sessions ────────────────────────────────────
-- KvM Quiz-sessies hebben geen link_id (dat is alleen voor Live poll), dus
-- sessions krijgt er een eigen docent_id bij. Die vult zichzelf automatisch
-- in met de ingelogde leerkracht op het moment van aanmaken — er hoeft niets
-- in docent-sessie.html of de Live poll-pagina's aangepast te worden.
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS docent_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

-- ── sessions: alleen eigen sessies beheren ──────────────────────────────────
DROP POLICY IF EXISTS "anon_read_sessions" ON sessions;
DROP POLICY IF EXISTS "anon_insert_sessions" ON sessions;
DROP POLICY IF EXISTS "anon_update_sessions" ON sessions;
DROP POLICY IF EXISTS "sessions open" ON sessions;
DROP POLICY IF EXISTS "leerling_sessie_zoeken" ON sessions;
DROP POLICY IF EXISTS "docent_sessie_beheren" ON sessions;
DROP POLICY IF EXISTS "sessie_lezen" ON sessions;
DROP POLICY IF EXISTS "sessie_aanmaken" ON sessions;
DROP POLICY IF EXISTS "sessie_bijwerken" ON sessions;

CREATE POLICY "leerling_sessie_zoeken"
  ON sessions FOR SELECT TO anon
  USING (true);

CREATE POLICY "docent_sessie_beheren"
  ON sessions FOR ALL TO authenticated
  USING (docent_id = auth.uid() OR docent_id IS NULL)
  WITH CHECK (docent_id = auth.uid() OR docent_id IS NULL);

-- ── participants: alleen deelnemers van eigen sessies beheren ──────────────
DROP POLICY IF EXISTS "anon_read_participants" ON participants;
DROP POLICY IF EXISTS "anon_insert_participants" ON participants;
DROP POLICY IF EXISTS "anon_update_participants" ON participants;
DROP POLICY IF EXISTS "participants open" ON participants;
DROP POLICY IF EXISTS "leerling_aanmelden" ON participants;
DROP POLICY IF EXISTS "leerling_score_bijwerken" ON participants;
DROP POLICY IF EXISTS "leerling_klassement_zien" ON participants;
DROP POLICY IF EXISTS "docent_deelnemers_beheren" ON participants;
DROP POLICY IF EXISTS "deelnemer_lezen" ON participants;
DROP POLICY IF EXISTS "deelnemer_aanmaken" ON participants;
DROP POLICY IF EXISTS "deelnemer_bijwerken" ON participants;
DROP POLICY IF EXISTS "deelnemer_eigen_rij_lezen" ON participants;
DROP POLICY IF EXISTS "deelnemer_score_bijwerken" ON participants;
DROP POLICY IF EXISTS "docent_deelnemers_volledig" ON participants;

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
  USING (session_id IN (SELECT id FROM sessions WHERE docent_id = auth.uid() OR docent_id IS NULL))
  WITH CHECK (session_id IN (SELECT id FROM sessions WHERE docent_id = auth.uid() OR docent_id IS NULL));

-- ── questions (KvM Quiz): leerling leest mee, docent beheert alleen eigen ──
DROP POLICY IF EXISTS "anon_read_questions" ON questions;
DROP POLICY IF EXISTS "anon_insert_questions" ON questions;
DROP POLICY IF EXISTS "questions open" ON questions;
DROP POLICY IF EXISTS "leerling_vragen_lezen" ON questions;
DROP POLICY IF EXISTS "docent_vragen_beheren" ON questions;
DROP POLICY IF EXISTS "vragen_lezen" ON questions;
DROP POLICY IF EXISTS "vragen_aanmaken" ON questions;

CREATE POLICY "leerling_vragen_lezen"
  ON questions FOR SELECT TO anon
  USING (true);

CREATE POLICY "docent_vragen_beheren"
  ON questions FOR ALL TO authenticated
  USING (session_id IN (SELECT id FROM sessions WHERE docent_id = auth.uid() OR docent_id IS NULL))
  WITH CHECK (session_id IN (SELECT id FROM sessions WHERE docent_id = auth.uid() OR docent_id IS NULL));

-- ── answers (KvM Quiz): leerling stuurt in, docent leest/beheert alleen eigen ──
DROP POLICY IF EXISTS "anon_read_answers" ON answers;
DROP POLICY IF EXISTS "anon_insert_answers" ON answers;
DROP POLICY IF EXISTS "answers open" ON answers;
DROP POLICY IF EXISTS "leerling_antwoord_insturen" ON answers;
DROP POLICY IF EXISTS "docent_antwoorden_inzien" ON answers;
DROP POLICY IF EXISTS "docent_antwoorden_beheren" ON answers;
DROP POLICY IF EXISTS "docent_antwoorden_verwijderen" ON answers;
DROP POLICY IF EXISTS "antwoord_insturen" ON answers;
DROP POLICY IF EXISTS "antwoord_lezen" ON answers;

CREATE POLICY "leerling_antwoord_insturen"
  ON answers FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "docent_antwoorden_beheren"
  ON answers FOR ALL TO authenticated
  USING (session_id IN (SELECT id FROM sessions WHERE docent_id = auth.uid() OR docent_id IS NULL))
  WITH CHECK (session_id IN (SELECT id FROM sessions WHERE docent_id = auth.uid() OR docent_id IS NULL));

-- ── poll_statements: leerling leest mee, docent beheert alleen eigen ───────
DROP POLICY IF EXISTS "anon_read_statements" ON poll_statements;
DROP POLICY IF EXISTS "anon_insert_statements" ON poll_statements;
DROP POLICY IF EXISTS "anon_update_statements" ON poll_statements;
DROP POLICY IF EXISTS "poll_statements open" ON poll_statements;
DROP POLICY IF EXISTS "leerling_stellingen_lezen" ON poll_statements;
DROP POLICY IF EXISTS "docent_stellingen_beheren" ON poll_statements;
DROP POLICY IF EXISTS "stelling_lezen" ON poll_statements;
DROP POLICY IF EXISTS "stelling_aanmaken" ON poll_statements;
DROP POLICY IF EXISTS "stelling_bijwerken" ON poll_statements;
DROP POLICY IF EXISTS "docent_stelling_alles" ON poll_statements;

CREATE POLICY "leerling_stellingen_lezen"
  ON poll_statements FOR SELECT TO anon
  USING (true);

CREATE POLICY "docent_stellingen_beheren"
  ON poll_statements FOR ALL TO authenticated
  USING (session_id IN (SELECT id FROM sessions WHERE docent_id = auth.uid() OR docent_id IS NULL))
  WITH CHECK (session_id IN (SELECT id FROM sessions WHERE docent_id = auth.uid() OR docent_id IS NULL));

-- ── poll_responses: leerling stemt, docent leest/beheert alleen eigen ──────
DROP POLICY IF EXISTS "anon_read_responses" ON poll_responses;
DROP POLICY IF EXISTS "anon_insert_responses" ON poll_responses;
DROP POLICY IF EXISTS "poll_responses open" ON poll_responses;
DROP POLICY IF EXISTS "leerling_stem_insturen" ON poll_responses;
DROP POLICY IF EXISTS "leerling_stemverdeling_zien" ON poll_responses;
DROP POLICY IF EXISTS "docent_poll_resultaten_beheren" ON poll_responses;
DROP POLICY IF EXISTS "stem_insturen" ON poll_responses;
DROP POLICY IF EXISTS "stem_lezen" ON poll_responses;
DROP POLICY IF EXISTS "docent_stem_alles" ON poll_responses;

CREATE POLICY "leerling_stem_insturen"
  ON poll_responses FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "leerling_stemverdeling_zien"
  ON poll_responses FOR SELECT TO anon
  USING (true);

CREATE POLICY "docent_poll_resultaten_beheren"
  ON poll_responses FOR ALL TO authenticated
  USING (session_id IN (SELECT id FROM sessions WHERE docent_id = auth.uid() OR docent_id IS NULL))
  WITH CHECK (session_id IN (SELECT id FROM sessions WHERE docent_id = auth.uid() OR docent_id IS NULL));
