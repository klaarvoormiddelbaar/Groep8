// ── Supabase-configuratie voor de Open Boek Quiz ────────────────────────────
// Zelfde Supabase-project als de rest van Klaar voor Middelbaar, maar met
// eigen tabellen (quiz_*) die volledig los staan van de KvM Quiz-tabellen.
// De 'anon' sleutel is bedoeld om publiek in frontend-code te staan; de
// beveiliging zit in de Row Level Security-policies en functies
// (zie supabase-schema.sql).

const SUPABASE_URL = 'https://cqcncausbclwvoomqdpy.supabase.co/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxY25jYXVzYmNsd3Zvb21xZHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjE3MDYsImV4cCI6MjA5NjI5NzcwNn0.Yh-5xrjxPW36OOufxbgu8CGiemDofFQ4R59Mmeomlwo';

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Genereert een willekeurige 6-cijferige sessiecode die nog niet in gebruik
// is door een quizsessie die nog niet beëindigd is.
async function genereerUniekeQuizCode() {
  for (let poging = 0; poging < 8; poging++) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const { data, error } = await db.rpc('resolve_quiz_sessie', { p_code: code });
    if (!error && (!data || data.length === 0)) return code;
  }
  throw new Error('Kon geen unieke sessiecode genereren. Probeer het nog eens.');
}
