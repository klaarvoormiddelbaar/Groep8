-- PRIVACY STAP 3A — Woordwolk: namen van leerlingen afschermen (verandert nog niets aan wat werkt)
-- Plak in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql  en klik Run.
--
-- Nu: elke leerling kan bij elk woord ook de NAAM lezen van wie het instuurde (en van alle klassen).
-- Straks: leerlingen krijgen alleen de woorden (zonder naam) van hun eigen sessie:
--   * live nieuwe woorden via een aparte melding (broadcast) die alleen id, fase en woord bevat;
--   * bij het openen van een fase de bestaande woorden via de functie woordwolk_woorden_lezen.
-- De docent ziet nog steeds namen. Deze stap is veilig: de bestaande pagina's blijven werken.

-- 1. Functie: woorden van één sessie en fase, ZONDER naam
CREATE OR REPLACE FUNCTION public.woordwolk_woorden_lezen(p_sessie uuid, p_fase integer)
RETURNS TABLE (id uuid, woord text, aangemaakt_op timestamptz)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT w.id, w.woord, w.aangemaakt_op
  FROM woordwolk_woorden w
  WHERE w.sessie_id = p_sessie AND w.fase_index = p_fase
  ORDER BY w.aangemaakt_op
  LIMIT 3000;
$$;
REVOKE ALL ON FUNCTION public.woordwolk_woorden_lezen(uuid, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.woordwolk_woorden_lezen(uuid, integer) TO anon, authenticated;

-- 2. Live-melding bij een nieuw of verwijderd woord (zonder naam). Een fout hier mag NOOIT voorkomen
--    dat een woord wordt opgeslagen, vandaar de EXCEPTION-afhandeling.
CREATE OR REPLACE FUNCTION public.woordwolk_woord_melden()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  BEGIN
    IF TG_OP = 'INSERT' THEN
      PERFORM realtime.send(
        jsonb_build_object('id', NEW.id, 'fase_index', NEW.fase_index, 'woord', NEW.woord),
        'woord', 'woordwolk:' || NEW.sessie_id::text, false);
    ELSE
      PERFORM realtime.send(
        jsonb_build_object('id', OLD.id, 'fase_index', OLD.fase_index),
        'verwijderd', 'woordwolk:' || OLD.sessie_id::text, false);
    END IF;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  RETURN COALESCE(NEW, OLD);
END $$;

DROP TRIGGER IF EXISTS woordwolk_woord_melden_trg ON public.woordwolk_woorden;
CREATE TRIGGER woordwolk_woord_melden_trg
  AFTER INSERT OR DELETE ON public.woordwolk_woorden
  FOR EACH ROW EXECUTE FUNCTION public.woordwolk_woord_melden();

-- 3. Lengtegrenzen (NOT VALID: bestaande rijen worden niet gecontroleerd, nieuwe wel)
ALTER TABLE public.woordwolk_woorden
  DROP CONSTRAINT IF EXISTS woordwolk_woord_lengte,
  DROP CONSTRAINT IF EXISTS woordwolk_naam_lengte;
ALTER TABLE public.woordwolk_woorden
  ADD CONSTRAINT woordwolk_woord_lengte CHECK (char_length(woord) BETWEEN 1 AND 60) NOT VALID,
  ADD CONSTRAINT woordwolk_naam_lengte  CHECK (char_length(leerling_naam) BETWEEN 1 AND 40) NOT VALID;
ALTER TABLE public.woordwolk_deelnemers
  DROP CONSTRAINT IF EXISTS woordwolk_deelnemer_naam_lengte;
ALTER TABLE public.woordwolk_deelnemers
  ADD CONSTRAINT woordwolk_deelnemer_naam_lengte CHECK (char_length(naam) BETWEEN 1 AND 40) NOT VALID;

-- Controle: 1 functie + 1 trigger
SELECT 'functie' AS soort, proname AS naam FROM pg_proc WHERE pronamespace = 'public'::regnamespace AND proname LIKE 'woordwolk_%'
UNION ALL
SELECT 'trigger', tgname FROM pg_trigger WHERE tgname = 'woordwolk_woord_melden_trg';
