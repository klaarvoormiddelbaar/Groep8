-- Voeg een echte email-kolom toe aan profiles, automatisch gevuld vanuit auth.users.
-- Plak dit in de SQL Editor: https://supabase.com/dashboard/project/cqcncausbclwvoomqdpy/sql

-- 1. Kolom toevoegen
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Bestaande profielen eenmalig vullen vanuit auth.users
UPDATE profiles p
SET email = u.email
FROM auth.users u
WHERE u.id = p.id;

-- 3. Trigger: bij elke insert/update van een profiel wordt email automatisch
--    overgenomen vanuit auth.users (client kan dit dus niet zelf overschrijven).
CREATE OR REPLACE FUNCTION profiles_email_sync()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email := (SELECT email FROM auth.users WHERE id = NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_profiles_email_sync ON profiles;
CREATE TRIGGER trg_profiles_email_sync
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION profiles_email_sync();

