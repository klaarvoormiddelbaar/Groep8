// ── Supabase-configuratie voor de live poll ───────────────────────────────────
// Gedeelde configuratie — zelfde Supabase-project als de klasquiz.
// De 'anon' sleutel is bedoeld om publiek in frontend-code te staan;
// beveiliging zit in Row Level Security-policies van de database.

const SUPABASE_URL      = 'https://cqcncausbclwvoomqdpy.supabase.co/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxY25jYXVzYmNsd3Zvb21xZHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjE3MDYsImV4cCI6MjA5NjI5NzcwNn0.Yh-5xrjxPW36OOufxbgu8CGiemDofFQ4R59Mmeomlwo';

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Genereert een willekeurige 6-cijferige sessiecode die nog niet in gebruik is.
async function genereerUniekeSessieCode() {
  for (let poging = 0; poging < 8; poging++) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const { data, error } = await db
      .from('sessions')
      .select('id')
      .eq('code', code)
      .neq('status', 'ended')
      .maybeSingle();
    if (!error && !data) return code;
  }
  throw new Error('Kon geen unieke sessiecode genereren. Probeer het nog eens.');
}

// ── Benodigde SQL (eenmalig uitvoeren in Supabase SQL-editor) ─────────────────
//
// CREATE TABLE IF NOT EXISTS poll_statements (
//   id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   session_id  uuid REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
//   tekst       text NOT NULL,
//   volgorde    integer NOT NULL,
//   status      text DEFAULT 'waiting' CHECK (status IN ('waiting','active','closed')),
//   created_at  timestamptz DEFAULT now()
// );
//
// CREATE TABLE IF NOT EXISTS poll_responses (
//   id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   session_id     uuid REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
//   statement_id   uuid REFERENCES poll_statements(id) ON DELETE CASCADE NOT NULL,
//   participant_id uuid REFERENCES participants(id) ON DELETE CASCADE NOT NULL,
//   score          integer NOT NULL CHECK (score BETWEEN 1 AND 5),
//   created_at     timestamptz DEFAULT now(),
//   UNIQUE(statement_id, participant_id)
// );
//
// ALTER TABLE poll_statements ENABLE ROW LEVEL SECURITY;
// ALTER TABLE poll_responses  ENABLE ROW LEVEL SECURITY;
//
// CREATE POLICY "anon_read_statements"  ON poll_statements FOR SELECT TO anon USING (true);
// CREATE POLICY "anon_insert_statements" ON poll_statements FOR INSERT TO anon WITH CHECK (true);
// CREATE POLICY "anon_update_statements" ON poll_statements FOR UPDATE TO anon USING (true);
// CREATE POLICY "anon_read_responses"   ON poll_responses  FOR SELECT TO anon USING (true);
// CREATE POLICY "anon_insert_responses" ON poll_responses  FOR INSERT TO anon WITH CHECK (true);
//
// ALTER PUBLICATION supabase_realtime ADD TABLE poll_statements;
// ALTER PUBLICATION supabase_realtime ADD TABLE poll_responses;
