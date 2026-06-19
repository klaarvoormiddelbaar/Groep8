-- Tips en Tops — eenmalige Supabase-setup.
-- Plak dit volledig in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql

CREATE TABLE IF NOT EXISTS tips_en_tops_reacties (
  id                     UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  leerkracht_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  leerling_naam          TEXT,
  meeste_aan_gehad       TEXT[]      NOT NULL DEFAULT '{}',
  mist_nog               TEXT        NOT NULL,
  leukste_werkvormen     TEXT[]      NOT NULL DEFAULT '{}',
  saaiste_en_suggesties  TEXT        NOT NULL,
  cijfer                 SMALLINT    NOT NULL CHECK (cijfer BETWEEN 1 AND 10),
  ingediend_op           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tips_en_tops_reacties_leerkracht_idx
  ON tips_en_tops_reacties (leerkracht_id);

ALTER PUBLICATION supabase_realtime ADD TABLE tips_en_tops_reacties;

ALTER TABLE tips_en_tops_reacties ENABLE ROW LEVEL SECURITY;

-- Leerlingen (niet ingelogd) mogen alleen reacties INSTUREN, niet lezen.
CREATE POLICY "Leerlingen kunnen reacties insturen"
  ON tips_en_tops_reacties FOR INSERT TO anon WITH CHECK (true);

-- Een leerkracht mag uitsluitend de eigen reacties lezen (gekoppeld aan het eigen account).
CREATE POLICY "Leerkracht leest alleen eigen reacties"
  ON tips_en_tops_reacties FOR SELECT TO authenticated USING (auth.uid() = leerkracht_id);


-- Korte, makkelijk over te typen code per leerkracht (in plaats van een lange UUID-link).
CREATE TABLE IF NOT EXISTS tips_en_tops_links (
  leerkracht_id  UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  code           TEXT        UNIQUE NOT NULL,
  aangemaakt_op  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE tips_en_tops_links ENABLE ROW LEVEL SECURITY;

-- Iedereen (ook niet-ingelogde leerlingen) mag een code opzoeken om de bijbehorende
-- leerkracht te vinden. Dit geeft geen toegang tot reacties of andere profielgegevens.
CREATE POLICY "Code opzoeken is openbaar"
  ON tips_en_tops_links FOR SELECT TO anon, authenticated USING (true);

-- Een leerkracht mag alleen een code voor het eigen account aanmaken.
CREATE POLICY "Leerkracht maakt eigen code aan"
  ON tips_en_tops_links FOR INSERT TO authenticated WITH CHECK (auth.uid() = leerkracht_id);
