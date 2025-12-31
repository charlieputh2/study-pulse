-- Fix Row Level Security (RLS) for user_profiles table
-- Run this SQL in your Supabase SQL Editor

-- 1. Drop existing RLS policies (if any)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- 2. Create new RLS policies that allow anonymous inserts for registration
CREATE POLICY "Allow anonymous insert for registration" ON public.user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to view all profiles" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid()::text = email::text);

-- 3. Enable RLS on the table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Grant necessary permissions
GRANT ALL ON public.user_profiles TO anon;
GRANT ALL ON public.user_profiles TO authenticated;

-- 5. Test the setup by inserting a test record
INSERT INTO public.user_profiles (email, username, first_name, created_at)
VALUES ('test@setup.com', 'testuser', 'Test Setup', NOW())
ON CONFLICT (email) DO NOTHING;

-- 6. Verify the insert
SELECT * FROM public.user_profiles WHERE email = 'test@setup.com';

-- 7. Clean up test data (optional)
-- DELETE FROM public.user_profiles WHERE email = 'test@setup.com';
