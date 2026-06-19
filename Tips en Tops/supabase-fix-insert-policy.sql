-- Fix: ook ingelogde gebruikers (bijv. jij die zelf het formulier test) mogen reacties insturen.
-- Plak dit in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql

DROP POLICY IF EXISTS "Leerlingen kunnen reacties insturen" ON tips_en_tops_reacties;

CREATE POLICY "Leerlingen kunnen reacties insturen"
  ON tips_en_tops_reacties FOR INSERT TO anon, authenticated WITH CHECK (true);
