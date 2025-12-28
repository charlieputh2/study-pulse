-- CORS Configuration for Supabase
-- Run this SQL in your Supabase SQL Editor to fix CORS issues

-- 1. First, let's check what CORS tables exist
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name LIKE '%cors%' OR table_schema = 'auth';

-- 2. Enable RLS on all tables if not already enabled
-- This ensures your tables can be accessed from the frontend
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create public access policies for reading data
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON product_variations
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON payment_methods
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON site_settings
  FOR SELECT USING (true);

-- 4. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT ON site_settings TO authenticated;
GRANT UPDATE ON site_settings TO authenticated;
GRANT DELETE ON site_settings TO authenticated;

-- 5. Create a function to check if CORS is properly configured
CREATE OR REPLACE FUNCTION check_cors_configuration()
RETURNS TABLE (
  origin text,
  is_active boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT origin, is_active 
  FROM auth.cors_origins 
  ORDER BY origin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Test the CORS configuration
SELECT * FROM check_cors_configuration();
