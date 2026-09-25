-- Eén antwoord per leerling per quizvraag (gevonden tijdens de belastingtest, 24-09-2026)
-- Plak dit hele bestand in de SQL Editor en voer het in één keer uit:
-- https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql
--
-- Probleem: de live tabel 'answers' accepteert meerdere antwoorden van dezelfde
-- leerling op dezelfde vraag (bijv. na het verversen van de pagina) → dubbele
-- punten en een te hoge teller. De poll had deze regel al wel.
-- De leerlingpagina behandelt "staat er al" (code 23505) als: al beantwoord.

-- 1. Bestaande dubbele antwoorden opruimen: het EERSTE antwoord blijft staan.
DELETE FROM answers a
USING answers b
WHERE a.question_id = b.question_id
  AND a.participant_id = b.participant_id
  AND (a.created_at > b.created_at OR (a.created_at = b.created_at AND a.id > b.id));

-- 2. Regel toevoegen (slaat over als hij er al is).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'answers_een_per_vraag') THEN
    ALTER TABLE answers ADD CONSTRAINT answers_een_per_vraag UNIQUE (question_id, participant_id);
  END IF;
END $$;
