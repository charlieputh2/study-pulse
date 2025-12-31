-- ========================================
-- PRODUCT OPTIONS MIGRATION
-- Run this in the Supabase SQL Editor
-- ========================================

-- 1. Create the product_options table
CREATE TABLE IF NOT EXISTS product_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_adjustment DECIMAL(10,2) NOT NULL DEFAULT 0,
  final_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_options_product_id ON product_options(product_id);
CREATE INDEX IF NOT EXISTS idx_product_options_available ON product_options(available);

-- 3. Enable Row Level Security
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
DROP POLICY IF EXISTS "Product options are publicly viewable" ON product_options;
CREATE POLICY "Product options are publicly viewable" ON product_options
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert product options" ON product_options;
CREATE POLICY "Authenticated users can insert product options" ON product_options
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update product options" ON product_options;
CREATE POLICY "Authenticated users can update product options" ON product_options
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete product options" ON product_options;
CREATE POLICY "Authenticated users can delete product options" ON product_options
  FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_product_options_updated_at ON product_options;
CREATE TRIGGER update_product_options_updated_at 
  BEFORE UPDATE ON product_options 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Insert default options for existing products
INSERT INTO product_options (product_id, name, description, price_adjustment, final_price, stock_quantity, sort_order)
SELECT 
  id,
  'Complete Set',
  'Everything you need: vial, bac water, syringes, alcohol pads, and instructions',
  50,
  base_price + 50,
  50,
  1
FROM products;

INSERT INTO product_options (product_id, name, description, price_adjustment, final_price, stock_quantity, sort_order)
SELECT 
  id,
  'Vial + Bac Water Only',
  'Just the essentials: peptide vial and bacteriostatic water',
  15,
  base_price + 15,
  75,
  2
FROM products;

INSERT INTO product_options (product_id, name, description, price_adjustment, final_price, stock_quantity, sort_order)
SELECT 
  id,
  'Vial Only',
  'Peptide vial only - perfect if you already have supplies',
  0,
  base_price,
  100,
  3
FROM products;

-- 7. Verify the migration
SELECT 
  p.name as product_name,
  po.name as option_name,
  po.description,
  po.final_price,
  po.stock_quantity
FROM products p
JOIN product_options po ON p.id = po.product_id
ORDER BY p.name, po.sort_order;
