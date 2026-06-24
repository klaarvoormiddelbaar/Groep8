// ── Supabase-configuratie voor Formele Mail Oefenen ──────────────────────────
// Zelfde Supabase-project als de rest van Klaar voor Middelbaar.
// De 'anon' sleutel is bedoeld om publiek in frontend-code te staan; de
// beveiliging zit in de Row Level Security-policies van de database
// (zie supabase-schema.sql).

const SUPABASE_URL = 'https://cqcncausbclwvoomqdpy.supabase.co/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxY25jYXVzYmNsd3Zvb21xZHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjE3MDYsImV4cCI6MjA5NjI5NzcwNn0.Yh-5xrjxPW36OOufxbgu8CGiemDofFQ4R59Mmeomlwo';

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
