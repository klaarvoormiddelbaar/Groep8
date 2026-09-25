-- PRIVACY STAP 2A — Missie Middelbaar: functies voor leerlingen (verandert nog niets aan wat werkt)
-- Plak in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql  en klik Run.
--
-- Leerlingen krijgen straks GEEN toegang meer tot de tabel missie_groepjes zelf (stap 2B), maar alleen tot
-- drie functies die precies één ding doen:
--   missie_groep_aanmaken(link, namen)     -> maakt een groepje aan, geeft het id terug
--   missie_groep_lezen(id)                 -> namen + voortgang van EIGEN groepje (geen antwoorden)
--   missie_afronden(id, missie, antwoorden)-> slaat de antwoorden van één missie op
-- Wie het (willekeurige, niet-raadbare) id niet kent, kan dus niets lezen of wijzigen. Namen worden
-- ingekort, aantallen en groottes worden begrensd.
-- Deze stap is veilig: de bestaande pagina's blijven gewoon werken.

CREATE OR REPLACE FUNCTION public.missie_groep_aanmaken(p_link_id uuid, p_namen text[])
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  schoon text[];
  nieuw uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM missie_links WHERE id = p_link_id) THEN
    RAISE EXCEPTION 'onbekende link' USING ERRCODE = 'P0002';
  END IF;

  SELECT coalesce(array_agg(n), '{}') INTO schoon
  FROM (SELECT left(btrim(x), 40) AS n FROM unnest(p_namen) AS x WHERE btrim(x) <> '' LIMIT 6) s;

  IF coalesce(array_length(schoon, 1), 0) < 1 THEN
    RAISE EXCEPTION 'geen namen' USING ERRCODE = '22023';
  END IF;

  INSERT INTO missie_groepjes (namen, missie_huidig, link_id)
  VALUES (schoon, 1, p_link_id)
  RETURNING id INTO nieuw;
  RETURN nieuw;
END $$;

CREATE OR REPLACE FUNCTION public.missie_groep_lezen(p_id uuid)
RETURNS jsonb
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT to_jsonb(g) FROM (
    SELECT namen, missie_huidig, missie_1_klaar, missie_2_klaar, missie_3_klaar
    FROM missie_groepjes WHERE id = p_id
  ) g;
$$;

CREATE OR REPLACE FUNCTION public.missie_afronden(p_id uuid, p_missie integer, p_antwoorden jsonb)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  gevonden integer;
BEGIN
  IF p_missie NOT IN (1, 2, 3) THEN
    RAISE EXCEPTION 'onbekende missie' USING ERRCODE = '22023';
  END IF;
  IF p_antwoorden IS NULL OR jsonb_typeof(p_antwoorden) <> 'object' OR length(p_antwoorden::text) > 30000 THEN
    RAISE EXCEPTION 'ongeldige antwoorden' USING ERRCODE = '22023';
  END IF;

  UPDATE missie_groepjes SET
    antwoorden     = coalesce(antwoorden, '{}'::jsonb) || jsonb_build_object('missie' || p_missie, p_antwoorden),
    missie_1_klaar = CASE WHEN p_missie = 1 THEN true ELSE missie_1_klaar END,
    missie_2_klaar = CASE WHEN p_missie = 2 THEN true ELSE missie_2_klaar END,
    missie_3_klaar = CASE WHEN p_missie = 3 THEN true ELSE missie_3_klaar END,
    missie_huidig  = greatest(coalesce(missie_huidig, 1), p_missie + 1),
    bijgewerkt_op  = now()
  WHERE id = p_id;
  GET DIAGNOSTICS gevonden = ROW_COUNT;
  RETURN gevonden > 0;
END $$;

REVOKE ALL ON FUNCTION public.missie_groep_aanmaken(uuid, text[])        FROM PUBLIC;
REVOKE ALL ON FUNCTION public.missie_groep_lezen(uuid)                   FROM PUBLIC;
REVOKE ALL ON FUNCTION public.missie_afronden(uuid, integer, jsonb)      FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.missie_groep_aanmaken(uuid, text[])     TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.missie_groep_lezen(uuid)                TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.missie_afronden(uuid, integer, jsonb)   TO anon, authenticated;

-- Controle: moet 3 rijen geven
SELECT proname FROM pg_proc WHERE pronamespace = 'public'::regnamespace AND proname LIKE 'missie_%' ORDER BY 1;
