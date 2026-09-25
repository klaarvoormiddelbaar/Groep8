-- DIAGNOSE (alleen lezen, wijzigt NIETS) — privacy-project 25-09-2026
-- Plak dit in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql
-- Voer het uit; je krijgt één cel met tekst (JSON). Klik in de cel, kopieer alles en plak het in het gesprek.
-- Zo zie ik precies welke regels, rechten, kolommen en functies er nu echt staan, zodat mijn
-- afscherming exact past en niets kapotmaakt.

SELECT json_build_object(

  -- 1. Row Level Security: staat het aan per tabel?
  'rls', (SELECT json_agg(json_build_object('tabel', c.relname, 'rls_aan', c.relrowsecurity) ORDER BY c.relname)
          FROM pg_class c WHERE c.relnamespace = 'public'::regnamespace AND c.relkind = 'r'),

  -- 2. Alle regels (policies) in het public-schema
  'policies', (SELECT json_agg(json_build_object('tabel', tablename, 'naam', policyname, 'cmd', cmd,
                 'rollen', roles, 'using', qual, 'check', with_check) ORDER BY tablename, policyname)
               FROM pg_policies WHERE schemaname = 'public'),

  -- 3. Wat mag de openbare sleutel (anon) rechtstreeks met tabellen?
  'anon_rechten', (SELECT json_agg(json_build_object('tabel', table_name, 'recht', privilege_type) ORDER BY table_name, privilege_type)
                   FROM information_schema.role_table_grants WHERE grantee = 'anon' AND table_schema = 'public'),

  -- 4. Kolommen en types
  'kolommen', (SELECT json_agg(json_build_object('tabel', table_name, 'kolom', column_name, 'type', udt_name, 'verplicht', is_nullable = 'NO') ORDER BY table_name, ordinal_position)
               FROM information_schema.columns WHERE table_schema = 'public'
               AND table_name IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')),

  -- 5. Eigen functies (RPC) en of ze met verhoogde rechten draaien
  'functies', (SELECT json_agg(json_build_object('naam', p.proname, 'argumenten', pg_get_function_identity_arguments(p.oid), 'security_definer', p.prosecdef) ORDER BY p.proname)
               FROM pg_proc p WHERE p.pronamespace = 'public'::regnamespace),

  -- 6. Triggers op onze tabellen
  'triggers', (SELECT json_agg(json_build_object('tabel', event_object_table, 'trigger', trigger_name, 'moment', action_timing, 'event', event_manipulation) ORDER BY event_object_table, trigger_name)
               FROM information_schema.triggers WHERE trigger_schema = 'public'),

  -- 7. Welke tabellen staan in realtime?
  'realtime_tabellen', (SELECT json_agg(tablename ORDER BY tablename) FROM pg_publication_tables WHERE pubname = 'supabase_realtime'),

  -- 8. Kan de database zelf live-berichten sturen (realtime.send)?
  'realtime_functies', (SELECT json_agg(json_build_object('naam', p.proname, 'argumenten', pg_get_function_identity_arguments(p.oid)))
                        FROM pg_proc p WHERE p.pronamespace = 'realtime'::regnamespace AND p.proname IN ('send', 'broadcast_changes')),

  -- 9. Wie kan inloggen / accounts aanmaken?
  'aantal_docent_accounts', (SELECT count(*) FROM auth.users)

) AS resultaat;
