-- Tips en Tops — opvolgende, voorspelbare codes i.p.v. willekeurige letters/cijfers.
-- Begint bij 0178 en telt op. Als de teller 9999 voorbij zou gaan (dus bij 10000),
-- springt hij naar 10178 en telt vanaf daar verder op.
-- Plak dit in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql

CREATE SEQUENCE IF NOT EXISTS tips_en_tops_code_seq START WITH 178;

CREATE OR REPLACE FUNCTION volgende_tips_en_tops_code()
RETURNS TEXT AS $$
DECLARE
  n BIGINT;
BEGIN
  n := nextval('tips_en_tops_code_seq');
  IF n = 10000 THEN
    PERFORM setval('tips_en_tops_code_seq', 10178);
    n := 10178;
  END IF;
  RETURN lpad(n::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

ALTER TABLE tips_en_tops_links
  ALTER COLUMN code SET DEFAULT volgende_tips_en_tops_code();
