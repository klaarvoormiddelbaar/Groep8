-- Tips en Tops — opvolgende, voorspelbare codes i.p.v. willekeurige letters/cijfers.
-- Begint bij 1491 en telt op. Als de teller 9999 voorbij zou gaan (dus bij 10000),
-- springt hij naar 11491 en telt vanaf daar verder op.
-- Plak dit in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql
-- (Dit script mag je opnieuw draaien; de teller wordt dan expliciet herstart op 1491.)

CREATE SEQUENCE IF NOT EXISTS tips_en_tops_code_seq START WITH 1491;
ALTER SEQUENCE tips_en_tops_code_seq RESTART WITH 1491;

CREATE OR REPLACE FUNCTION volgende_tips_en_tops_code()
RETURNS TEXT AS $$
DECLARE
  n BIGINT;
BEGIN
  n := nextval('tips_en_tops_code_seq');
  IF n = 10000 THEN
    PERFORM setval('tips_en_tops_code_seq', 11491);
    n := 11491;
  END IF;
  RETURN lpad(n::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

ALTER TABLE tips_en_tops_links
  ALTER COLUMN code SET DEFAULT volgende_tips_en_tops_code();
