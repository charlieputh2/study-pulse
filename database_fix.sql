-- Supabase Database Configuration Fix
-- Run this SQL in your Supabase SQL Editor

-- 1. Enable RLS on all tables (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON product_variations;
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON payment_methods;
DROP POLICY IF EXISTS "Enable read access for all users" ON site_settings;

-- 3. Create public access policies for reading data
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

-- 5. Test the configuration by checking if we can read the tables
SELECT 'products' as table_name, COUNT(*) as record_count FROM products
UNION ALL
SELECT 'product_variations' as table_name, COUNT(*) as record_count FROM product_variations
UNION ALL
SELECT 'categories' as table_name, COUNT(*) as record_count FROM categories
UNION ALL
SELECT 'payment_methods' as table_name, COUNT(*) as record_count FROM payment_methods
UNION ALL
SELECT 'site_settings' as table_name, COUNT(*) as record_count FROM site_settings;
