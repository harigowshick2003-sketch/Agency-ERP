-- ═══════════════════════════════════════════════════════════════════
--  Agency ERP — User Profiles & Role-Based Access Control
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. USER PROFILES TABLE ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id         uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text,
  full_name  text,
  role       text        NOT NULL DEFAULT 'employee',  -- 'admin' | 'manager' | 'employee'
  created_at timestamptz DEFAULT now(),
  CONSTRAINT role_check CHECK (role IN ('admin', 'manager', 'employee'))
);

-- ── 2. ROW LEVEL SECURITY ────────────────────────────────────────────
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own"  ON user_profiles;
DROP POLICY IF EXISTS "admin_read_all"  ON user_profiles;
DROP POLICY IF EXISTS "admin_write_all" ON user_profiles;
DROP POLICY IF EXISTS "user_update_own_name" ON user_profiles;

-- Everyone can read their own profile
CREATE POLICY "users_read_own"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can read ALL profiles
CREATE POLICY "admin_read_all"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update any profile (for role changes)
CREATE POLICY "admin_write_all"
  ON user_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can update their own full_name
CREATE POLICY "user_update_own_name"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── 3. AUTO-CREATE PROFILE ON SIGNUP (trigger) ───────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (
    new.id,
    new.email,
    'employee'  -- default role for all new sign-ups
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- ── 4. INSERT YOUR FIRST ADMIN (run after signing in once) ───────────
-- Replace 'your-email@example.com' with your actual email, then run:
-- UPDATE user_profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- ── 5. VERIFY ────────────────────────────────────────────────────────
SELECT * FROM user_profiles;
