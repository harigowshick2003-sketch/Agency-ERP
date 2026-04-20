-- Fix for infinite recursion in RLS policies

DROP POLICY IF EXISTS "admin_read_all" ON user_profiles;
DROP POLICY IF EXISTS "admin_write_all" ON user_profiles;

-- Instead of querying the same table, we check the role by reading the auth.jwt() claims OR by reading a localized query without triggering the policy again.
-- An easier way without custom JWT claims is to use a direct localized function.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Grant usage so authenticated users can run the function implicitly
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;

-- Admins can read ALL profiles
CREATE POLICY "admin_read_all"
  ON user_profiles FOR SELECT
  USING ( public.is_admin() );

-- Admins can update any profile (for role changes)
CREATE POLICY "admin_write_all"
  ON user_profiles FOR UPDATE
  USING ( public.is_admin() );
