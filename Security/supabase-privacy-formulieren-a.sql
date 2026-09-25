-- PRIVACY STAP 5A — Formele Mail en Tips en Tops: lengtegrenzen en code opzoeken via een functie
-- Plak in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql  en klik Run.
-- Deze stap is veilig: de bestaande pagina's blijven werken (bestaande rijen worden niet gecontroleerd).

-- 1. Lengtegrenzen (nu kan iemand met de openbare sleutel onbeperkt veel tekst insturen)
ALTER TABLE public.mail_inzendingen
  DROP CONSTRAINT IF EXISTS mail_lengtes;
ALTER TABLE public.mail_inzendingen
  ADD CONSTRAINT mail_lengtes CHECK (
    char_length(voornaam) BETWEEN 1 AND 40 AND char_length(onderwerp) <= 300 AND char_length(bericht) <= 5000
    AND length(checklist::text) <= 2000 AND aantal_goed BETWEEN 0 AND 10) NOT VALID;

ALTER TABLE public.tips_en_tops_reacties
  DROP CONSTRAINT IF EXISTS tips_lengtes;
ALTER TABLE public.tips_en_tops_reacties
  ADD CONSTRAINT tips_lengtes CHECK (
    (leerling_naam IS NULL OR char_length(leerling_naam) <= 40)
    AND char_length(mist_nog) <= 1000 AND char_length(saaiste_en_suggesties) <= 1000
    AND coalesce(array_length(meeste_aan_gehad, 1), 0) <= 12 AND coalesce(array_length(leukste_werkvormen, 1), 0) <= 12
    AND cijfer BETWEEN 1 AND 10
    AND (klaar_voor_middelbaar IS NULL OR klaar_voor_middelbaar BETWEEN 1 AND 5)) NOT VALID;

-- 2. Code opzoeken via een functie (zodat de lijst met alle codes en leerkracht-id's niet meer leesbaar hoeft te zijn)
CREATE OR REPLACE FUNCTION public.tips_code_opzoeken(p_code text)
RETURNS uuid LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT leerkracht_id FROM tips_en_tops_links WHERE code = p_code;
$$;
REVOKE ALL ON FUNCTION public.tips_code_opzoeken(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.tips_code_opzoeken(text) TO anon, authenticated;

-- Controle: 1 functie + 2 grenzen
SELECT 'functie' AS soort, proname AS naam FROM pg_proc WHERE proname = 'tips_code_opzoeken' AND pronamespace = 'public'::regnamespace
UNION ALL
SELECT 'grens', conname FROM pg_constraint WHERE conname IN ('mail_lengtes', 'tips_lengtes');
