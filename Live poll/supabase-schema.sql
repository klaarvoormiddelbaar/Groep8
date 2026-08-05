-- Schema voor Live poll — vaste link per docent per les (zelfde patroon als
-- Voorspel de Klas / Missie Middelbaar / Formele Mail Oefenen).
-- Dit hele bestand kan in één keer geplakt worden.
-- Plak dit in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql
--
-- Dit bestand is vanaf nu de enige waarheid voor de RLS-policies op
-- sessions/participants/poll_statements/poll_responses. De oudere,
-- onderling tegenstrijdige policy-bestanden in Security/ (supabase-setup.sql,
-- supabase-rls-policies.sql, supabase-setup-poll.sql) blijven ongewijzigd
-- liggen maar horen niet meer als laatste gedraaid te worden — dit bestand
-- draait ze expliciet om (elke oude policy-naam wordt eerst verwijderd).

-- ── Vaste link per docent, per les ──────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS poll_links_volgnummer_seq START 1491;

CREATE TABLE IF NOT EXISTS poll_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  docent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  les_id text NOT NULL,
  volgnummer integer NOT NULL UNIQUE DEFAULT nextval('poll_links_volgnummer_seq'),
  aangemaakt_op timestamptz NOT NULL DEFAULT now(),
  UNIQUE (docent_id, les_id)
);

ALTER TABLE poll_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Docent kan eigen link aanmaken" ON poll_links;
CREATE POLICY "Docent kan eigen link aanmaken" ON poll_links
  FOR INSERT TO authenticated
  WITH CHECK (docent_id = auth.uid());

DROP POLICY IF EXISTS "Docent kan eigen link lezen" ON poll_links;
CREATE POLICY "Docent kan eigen link lezen" ON poll_links
  FOR SELECT TO authenticated
  USING (docent_id = auth.uid());

CREATE OR REPLACE FUNCTION resolve_poll_link(p_volgnummer integer)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM poll_links WHERE volgnummer = p_volgnummer;
$$;

GRANT EXECUTE ON FUNCTION resolve_poll_link(integer) TO anon;

-- ── sessions-tabel: link_id erbij, code optioneel maken ────────────────────
-- 'sessions' wordt gedeeld met KvM Quiz. link_id blijft NULL voor Quiz-rijen
-- (geen enkele impact daar); code blijft verplicht voor Quiz, mag NULL zijn
-- voor Poll-sessies (die krijgen geen willekeurige code meer).
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS link_id uuid REFERENCES poll_links(id) ON DELETE CASCADE;
ALTER TABLE sessions ALTER COLUMN code DROP NOT NULL;

-- Voorkomt dat er per ongeluk twee tegelijk-actieve sessies voor dezelfde
-- link ontstaan (zou leerlingen en docent uit elkaar laten lopen).
CREATE UNIQUE INDEX IF NOT EXISTS sessions_link_id_actief_idx
  ON sessions (link_id) WHERE link_id IS NOT NULL AND status <> 'ended';

-- ── Geconsolideerde RLS: sessions ───────────────────────────────────────────
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_sessions"       ON sessions;
DROP POLICY IF EXISTS "anon_insert_sessions"     ON sessions;
DROP POLICY IF EXISTS "anon_update_sessions"     ON sessions;
DROP POLICY IF EXISTS "sessions open"            ON sessions;
DROP POLICY IF EXISTS "leerling_sessie_zoeken"   ON sessions;
DROP POLICY IF EXISTS "docent_sessie_beheren"    ON sessions;
DROP POLICY IF EXISTS "sessie_lezen"             ON sessions;
DROP POLICY IF EXISTS "sessie_aanmaken"          ON sessions;
DROP POLICY IF EXISTS "sessie_bijwerken"         ON sessions;

CREATE POLICY "leerling_sessie_zoeken"
  ON sessions FOR SELECT TO anon
  USING (true);

CREATE POLICY "docent_sessie_beheren"
  ON sessions FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ── Geconsolideerde RLS: participants ────────────────────────────────────────
-- (anon mag ook UPDATE — nodig voor KvM Quiz, dat leerlingen hun eigen score
-- laat bijwerken; Live poll gebruikt dat veld zelf niet, maar de tabel is
-- gedeeld dus dit blijft behouden.)
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_participants"     ON participants;
DROP POLICY IF EXISTS "anon_insert_participants"   ON participants;
DROP POLICY IF EXISTS "anon_update_participants"   ON participants;
DROP POLICY IF EXISTS "participants open"          ON participants;
DROP POLICY IF EXISTS "leerling_aanmelden"         ON participants;
DROP POLICY IF EXISTS "leerling_score_bijwerken"   ON participants;
DROP POLICY IF EXISTS "leerling_klassement_zien"   ON participants;
DROP POLICY IF EXISTS "docent_deelnemers_beheren"  ON participants;
DROP POLICY IF EXISTS "deelnemer_lezen"            ON participants;
DROP POLICY IF EXISTS "deelnemer_aanmaken"         ON participants;
DROP POLICY IF EXISTS "deelnemer_bijwerken"        ON participants;

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

-- ── Geconsolideerde RLS: poll_statements ─────────────────────────────────────
-- Alleen de docent beheert stellingen (aanmaken/activeren/sluiten); leerlingen
-- lezen enkel mee. Eerdere scripts gaven anon ook UPDATE-rechten — dat is niet
-- meer nodig sinds de docent (authenticated) alle statusovergangen doet.
ALTER TABLE poll_statements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_statements"      ON poll_statements;
DROP POLICY IF EXISTS "anon_insert_statements"    ON poll_statements;
DROP POLICY IF EXISTS "anon_update_statements"    ON poll_statements;
DROP POLICY IF EXISTS "poll_statements open"      ON poll_statements;
DROP POLICY IF EXISTS "leerling_stellingen_lezen" ON poll_statements;
DROP POLICY IF EXISTS "docent_stellingen_beheren" ON poll_statements;
DROP POLICY IF EXISTS "stelling_lezen"            ON poll_statements;
DROP POLICY IF EXISTS "stelling_aanmaken"         ON poll_statements;
DROP POLICY IF EXISTS "stelling_bijwerken"        ON poll_statements;
DROP POLICY IF EXISTS "docent_stelling_alles"     ON poll_statements;

CREATE POLICY "leerling_stellingen_lezen"
  ON poll_statements FOR SELECT TO anon
  USING (true);

CREATE POLICY "docent_stellingen_beheren"
  ON poll_statements FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ── Geconsolideerde RLS: poll_responses ──────────────────────────────────────
ALTER TABLE poll_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_responses"          ON poll_responses;
DROP POLICY IF EXISTS "anon_insert_responses"        ON poll_responses;
DROP POLICY IF EXISTS "poll_responses open"          ON poll_responses;
DROP POLICY IF EXISTS "leerling_stem_insturen"       ON poll_responses;
DROP POLICY IF EXISTS "leerling_stemverdeling_zien"  ON poll_responses;
DROP POLICY IF EXISTS "docent_poll_resultaten_beheren" ON poll_responses;
DROP POLICY IF EXISTS "stem_insturen"                ON poll_responses;
DROP POLICY IF EXISTS "stem_lezen"                   ON poll_responses;
DROP POLICY IF EXISTS "docent_stem_alles"            ON poll_responses;

CREATE POLICY "leerling_stem_insturen"
  ON poll_responses FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "leerling_stemverdeling_zien"
  ON poll_responses FOR SELECT TO anon
  USING (true);

CREATE POLICY "docent_poll_resultaten_beheren"
  ON poll_responses FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Realtime aanzetten voor poll_links doe je zelf nog handmatig via
-- Database > Replication (sessions, participants, poll_statements en
-- poll_responses staan daar vermoedelijk al aan sinds de quiz/poll live ging).
