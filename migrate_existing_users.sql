-- ── POPULATE EXISTING USERS INTO USER_PROFILES ───────────
-- If you already had users in your Supabase project before
-- creating this table and trigger, run this to copy them over.

INSERT INTO public.user_profiles (id, email, role)
SELECT id, email, 'employee'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Now, after running this, you should see your existing
-- accounts show up in the `user_profiles` table editor.
