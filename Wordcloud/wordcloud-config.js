// ── Supabase-configuratie voor de Woordenwolk-activiteit ─────────────────────
// Zelfde Supabase-project als de live klasquiz.
//
// ═══════════════════════════════════════════════════════════════════════════════
// EENMALIGE SETUP — voer dit uit in de Supabase SQL Editor:
// https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql
// ═══════════════════════════════════════════════════════════════════════════════
//
// CREATE TABLE IF NOT EXISTS wordcloud_sessions (
//   id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
//   code         TEXT        NOT NULL,
//   les_id       TEXT,
//   les_titel    TEXT,
//   docent_naam  TEXT        NOT NULL DEFAULT '',
//   status       TEXT        NOT NULL DEFAULT 'lobby',
//   aangemaaktop TIMESTAMPTZ NOT NULL DEFAULT now()
// );
//
// CREATE TABLE IF NOT EXISTS wordcloud_submissions (
//   id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
//   session_id    UUID        NOT NULL REFERENCES wordcloud_sessions(id) ON DELETE CASCADE,
//   leerling_naam TEXT        NOT NULL,
//   woord         TEXT        NOT NULL,
//   ingediend_op  TIMESTAMPTZ NOT NULL DEFAULT now()
// );
//
// ALTER PUBLICATION supabase_realtime ADD TABLE wordcloud_sessions;
// ALTER PUBLICATION supabase_realtime ADD TABLE wordcloud_submissions;
//
// ALTER TABLE wordcloud_sessions  ENABLE ROW LEVEL SECURITY;
// ALTER TABLE wordcloud_submissions ENABLE ROW LEVEL SECURITY;
//
// CREATE POLICY "Woordenwolk sessies open"
//   ON wordcloud_sessions FOR ALL TO anon USING (true) WITH CHECK (true);
//
// CREATE POLICY "Woordenwolk inzendingen open"
//   ON wordcloud_submissions FOR ALL TO anon USING (true) WITH CHECK (true);
// ═══════════════════════════════════════════════════════════════════════════════

const SUPABASE_URL     = 'https://cqcncausbclwvoomqdpy.supabase.co/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxY25jYXVzYmNsd3Zvb21xZHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjE3MDYsImV4cCI6MjA5NjI5NzcwNn0.Yh-5xrjxPW36OOufxbgu8CGiemDofFQ4R59Mmeomlwo';

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function genereerUniekeWoordenwolkCode() {
  for (let poging = 0; poging < 8; poging++) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const { data, error } = await db
      .from('wordcloud_sessions')
      .select('id')
      .eq('code', code)
      .neq('status', 'ended')
      .maybeSingle();
    if (!error && !data) return code;
  }
  throw new Error('Kon geen unieke sessiecode genereren. Probeer het nog eens.');
}
