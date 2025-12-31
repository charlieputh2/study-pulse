-- Migration: Add product options table
-- This allows products to have different purchase options like "Set", "vial + bac water only", "vial only"

-- Create product_options table
CREATE TABLE product_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Complete Set", "Vial + Bac Water Only", "Vial Only"
  description TEXT,
  price_adjustment DECIMAL(10,2) NOT NULL DEFAULT 0, -- Price adjustment from base price (can be positive or negative)
  final_price DECIMAL(10,2), -- Optional: If set, this overrides base_price + price_adjustment
  stock_quantity INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_product_options_product_id ON product_options(product_id);
CREATE INDEX idx_product_options_available ON product_options(available);

-- Add RLS policies
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read product options
CREATE POLICY "Product options are publicly viewable" ON product_options
  FOR SELECT USING (true);

-- Policy: Only authenticated users can insert product options
CREATE POLICY "Authenticated users can insert product options" ON product_options
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update product options
CREATE POLICY "Authenticated users can update product options" ON product_options
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete product options
CREATE POLICY "Authenticated users can delete product options" ON product_options
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default options for existing products
-- This will add the three standard options to all existing products
INSERT INTO product_options (product_id, name, description, price_adjustment, final_price, stock_quantity, sort_order)
SELECT 
  id,
  'Complete Set',
  'Everything you need: vial, bac water, syringes, alcohol pads, and instructions',
  0,
  base_price + 50, -- Add ₱50 to base price for complete set
  50,
  1
FROM products;

INSERT INTO product_options (product_id, name, description, price_adjustment, final_price, stock_quantity, sort_order)
SELECT 
  id,
  'Vial + Bac Water Only',
  'Just the essentials: peptide vial and bacteriostatic water',
  0,
  base_price + 15, -- Add ₱15 for bac water
  75,
  2
FROM products;

INSERT INTO product_options (product_id, name, description, price_adjustment, final_price, stock_quantity, sort_order)
SELECT 
  id,
  'Vial Only',
  'Peptide vial only - perfect if you already have supplies',
  0,
  base_price, -- Same as base price
  100,
  3
FROM products;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_options_updated_at 
  BEFORE UPDATE ON product_options 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
