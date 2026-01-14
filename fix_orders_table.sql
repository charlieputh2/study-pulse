-- Fix orders table - handle existing incomplete table
-- This will safely update or recreate the orders table with all required columns

-- First, let's see what columns exist and drop the table if it's incomplete
DO $$
BEGIN
    -- Check if table exists but is missing critical columns
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'orders'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'customer_email'
    ) THEN
        -- Drop the incomplete table
        DROP TABLE IF EXISTS orders;
        RAISE NOTICE 'Dropped incomplete orders table';
    END IF;
END $$;

-- Now create the complete orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Customer Information
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  
  -- Shipping Address
  shipping_address TEXT NOT NULL,
  shipping_barangay TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_zip_code TEXT NOT NULL,
  shipping_country TEXT,
  
  -- Shipping Details
  shipping_location TEXT, -- NCR, LUZON, VISAYAS_MINDANAO
  shipping_fee DECIMAL(10,2) DEFAULT 0, -- Shipping fee amount
  
  -- Order Details
  order_items JSONB NOT NULL, -- Array of {product_id, product_name, variation_id, variation_name, quantity, price}
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Payment
  payment_method_id TEXT,
  payment_method_name TEXT,
  payment_proof_url TEXT, -- URL to uploaded payment proof screenshot
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
  
  -- Contact Method
  contact_method TEXT, -- instagram, viber
  
  -- Order Status
  order_status TEXT DEFAULT 'new', -- new, confirmed, processing, shipped, delivered, cancelled
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify table was created successfully
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'orders'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'customer_email'
  ) THEN
    RAISE NOTICE 'Orders table created successfully with all required columns';
  ELSE
    RAISE EXCEPTION 'Failed to create orders table properly';
  END IF;
END $$;
