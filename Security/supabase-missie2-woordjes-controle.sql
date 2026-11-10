-- Missie Middelbaar, Missie 2 (woordjes leren): controle op wat leerlingen opsturen.
-- Plak dit hele bestand in één keer in de SQL Editor van Supabase en voer het uit.
--
-- Waarom: missie_afronden() mag door iedereen met een groepje-id worden aangeroepen en slaat tot 30.000
-- tekens JSON op. Zonder controle kan iemand via de browserconsole rare waarden opsturen (bijvoorbeeld
-- HTML in plaats van een cijfer). Dit bestand voegt voor Missie 2 een controle toe: alleen de verwachte
-- velden met de verwachte soorten waarden worden opgeslagen. Missie 1 en 3 blijven precies zoals ze waren.
--
-- Veilig uit te voeren:
--   1. Het script test eerst of een correct voorbeeld wordt geaccepteerd én of onzin wordt geweigerd.
--      Klopt dat niet, dan stopt het hele script en verandert er niets.
--   2. Pas daarna wordt missie_afronden() vervangen. Rechten blijven hetzelfde als in
--      supabase-privacy-missie-a.sql.
-- Terugdraaien: voer supabase-privacy-missie-a.sql opnieuw uit (zet de oude functie terug).

CREATE OR REPLACE FUNCTION public.missie_2_antwoorden_geldig(a jsonb)
RETURNS boolean
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  k text;
BEGIN
  IF a IS NULL OR jsonb_typeof(a) <> 'object' THEN RETURN false; END IF;
  IF a->>'type' IS DISTINCT FROM 'woordjes' THEN RETURN false; END IF;

  -- getallen
  FOREACH k IN ARRAY ARRAY['cijfer','punten','aantal_toetsen','aantal_woorden','min_cijfer','leertijd_sec','tijd_sec'] LOOP
    IF jsonb_typeof(a->k) IS DISTINCT FROM 'number' THEN RETURN false; END IF;
  END LOOP;
  IF (a->>'cijfer')::numeric         NOT BETWEEN 0 AND 10    THEN RETURN false; END IF;
  IF (a->>'punten')::numeric         NOT BETWEEN 0 AND 100   THEN RETURN false; END IF;
  IF (a->>'min_cijfer')::numeric     NOT BETWEEN 0 AND 10    THEN RETURN false; END IF;
  IF (a->>'aantal_toetsen')::numeric NOT BETWEEN 1 AND 100   THEN RETURN false; END IF;
  IF (a->>'aantal_woorden')::numeric NOT BETWEEN 1 AND 100   THEN RETURN false; END IF;
  IF (a->>'leertijd_sec')::numeric   NOT BETWEEN 0 AND 86400 THEN RETURN false; END IF;
  IF (a->>'tijd_sec')::numeric       NOT BETWEEN 0 AND 86400 THEN RETURN false; END IF;

  -- cijfers per toets: lijst met getallen van 0 t/m 10
  IF jsonb_typeof(a->'cijfers') IS DISTINCT FROM 'array' OR jsonb_array_length(a->'cijfers') > 100 THEN RETURN false; END IF;
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements(a->'cijfers') e
    WHERE CASE WHEN jsonb_typeof(e) <> 'number' THEN true ELSE (e #>> '{}')::numeric NOT BETWEEN 0 AND 10 END
  ) THEN RETURN false; END IF;

  -- moeilijkste woorden: lijst met { nl, en, fouten, bijna }
  IF jsonb_typeof(a->'moeilijkste_woorden') IS DISTINCT FROM 'array' OR jsonb_array_length(a->'moeilijkste_woorden') > 30 THEN RETURN false; END IF;
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements(a->'moeilijkste_woorden') e
    WHERE jsonb_typeof(e) <> 'object'
       OR coalesce(jsonb_typeof(e->'nl') <> 'string' OR length(e->>'nl') > 60, true)
       OR coalesce(jsonb_typeof(e->'en') <> 'string' OR length(e->>'en') > 60, true)
       OR coalesce(jsonb_typeof(e->'fouten') <> 'number', true)
       OR coalesce(jsonb_typeof(e->'bijna')  <> 'number', true)
  ) THEN RETURN false; END IF;

  -- antwoorden op de vragen
  IF jsonb_typeof(a->'v3_thuis_leren') IS DISTINCT FROM 'string' OR length(a->>'v3_thuis_leren') NOT BETWEEN 1 AND 2000 THEN RETURN false; END IF;
  FOREACH k IN ARRAY ARRAY['v2_stelling','v4_fout_terug','v5_middelbaar_online'] LOOP
    IF jsonb_typeof(a->k) IS DISTINCT FROM 'string' OR (a->>k) NOT IN ('1','2','3','4','5') THEN RETURN false; END IF;
  END LOOP;
  IF jsonb_typeof(a->'v6_leervorm') IS DISTINCT FROM 'string' OR (a->>'v6_leervorm') NOT IN ('papier','online','hardop','mix') THEN RETURN false; END IF;

  RETURN true;
END $$;

REVOKE ALL ON FUNCTION public.missie_2_antwoorden_geldig(jsonb) FROM PUBLIC;

-- Test vóór het vervangen: een correct voorbeeld MOET geldig zijn, onzin MOET geweigerd worden.
DO $$
BEGIN
  IF NOT public.missie_2_antwoorden_geldig('{"type":"woordjes","aantal_woorden":10,"min_cijfer":7,"cijfer":8,"cijfers":[6,8],"aantal_toetsen":2,"punten":8,"leertijd_sec":150,"tijd_sec":210,"moeilijkste_woorden":[{"nl":"kluisje","en":"locker","fouten":1,"bijna":0}],"v3_thuis_leren":"Ik schrijf ze op","v2_stelling":"5","v4_fout_terug":"4","v5_middelbaar_online":"3","v6_leervorm":"mix"}'::jsonb) THEN
    RAISE EXCEPTION 'Test mislukt: een correct voorbeeld werd geweigerd. Er is niets gewijzigd.';
  END IF;
  IF public.missie_2_antwoorden_geldig('{"type":"woordjes","cijfer":"<img src=x onerror=alert(1)>"}'::jsonb) THEN
    RAISE EXCEPTION 'Test mislukt: onzin werd geaccepteerd. Er is niets gewijzigd.';
  END IF;
  IF public.missie_2_antwoorden_geldig('{"bekeken_sites":["CambiumNed"],"v2_fijnst":"x"}'::jsonb) THEN
    RAISE EXCEPTION 'Test mislukt: het oude formaat werd geaccepteerd. Er is niets gewijzigd.';
  END IF;
END $$;

-- Dezelfde functie als in supabase-privacy-missie-a.sql, met één extra controle voor Missie 2.
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
  IF p_missie = 2 AND NOT public.missie_2_antwoorden_geldig(p_antwoorden) THEN
    RAISE EXCEPTION 'ongeldige antwoorden voor missie 2' USING ERRCODE = '22023';
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

REVOKE ALL ON FUNCTION public.missie_afronden(uuid, integer, jsonb)      FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.missie_afronden(uuid, integer, jsonb)   TO anon, authenticated;

-- Controle: beide functies moeten er staan
SELECT proname FROM pg_proc WHERE pronamespace = 'public'::regnamespace AND proname IN ('missie_afronden', 'missie_2_antwoorden_geldig') ORDER BY 1;
