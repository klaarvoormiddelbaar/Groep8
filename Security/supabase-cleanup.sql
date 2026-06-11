-- ══════════════════════════════════════════════════════════════════════════════
-- SUPABASE CLEANUP — Klaar voor Middelbaar
-- AVG-vereiste: persoonsgegevens van minderjarigen niet langer bewaren dan nodig.
-- Sessiedata (leerlingnamen, antwoorden, scores) wordt na 30 dagen verwijderd.
--
-- Stap 1: voer dit bestand eenmalig uit in Supabase SQL Editor.
-- Stap 2: activeer de cron-job via Supabase Dashboard → Extensions → pg_cron.
-- ══════════════════════════════════════════════════════════════════════════════


-- ── Cleanup-functie ───────────────────────────────────────────────────────────
-- Verwijdert alle sessies (+ bijbehorende deelnemers/antwoorden via CASCADE)
-- die ouder zijn dan 30 dagen én de status 'ended' hebben.

CREATE OR REPLACE FUNCTION verwijder_oude_sessies()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  -- Quiz-sessies
  DELETE FROM sessions
  WHERE status = 'ended'
    AND aangemaaktop < now() - INTERVAL '30 days';

  -- Woordenwolk-sessies
  DELETE FROM wordcloud_sessions
  WHERE status = 'ended'
    AND aangemaaktop < now() - INTERVAL '30 days';
END;
$$;


-- ── Cron-job: draait elke nacht om 03:00 ─────────────────────────────────────
-- Vereist de pg_cron extensie (gratis beschikbaar in Supabase).
-- Activeer eerst via: Dashboard → Database → Extensions → pg_cron → Enable

SELECT cron.schedule(
  'nachtelijke-cleanup',
  '0 3 * * *',
  $$ SELECT verwijder_oude_sessies(); $$
);


-- ══════════════════════════════════════════════════════════════════════════════
-- Om de cleanup handmatig te testen:
--   SELECT verwijder_oude_sessies();
--
-- Om de geplande jobs te bekijken:
--   SELECT * FROM cron.job;
-- ══════════════════════════════════════════════════════════════════════════════
