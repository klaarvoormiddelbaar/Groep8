-- Voeg de kolom toelichting toe aan de questions-tabel van de live quiz.
-- Zonder deze kolom wordt het uitlegvakje bij het onthullen van antwoorden nooit opgeslagen/getoond.
-- Plak dit in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql

ALTER TABLE questions ADD COLUMN IF NOT EXISTS toelichting TEXT;
