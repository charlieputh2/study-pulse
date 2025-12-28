-- Create missing tables referenced by migrations
-- Run via Supabase SQL Editor

-- Required for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create menu_items table (referenced by many migrations)
CREATE TABLE IF NOT EXISTS public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  base_price decimal(10,2) NOT NULL,
  category text NOT NULL,
  popular boolean DEFAULT false,
  image_url text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Create variations table (referenced by migrations)
CREATE TABLE IF NOT EXISTS public.variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  name text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Create add_ons table (referenced by migrations)
CREATE TABLE IF NOT EXISTS public.add_ons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  name text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_ons ENABLE ROW LEVEL SECURITY;

-- Policies for menu_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'menu_items' AND policyname = 'Anyone can read menu items'
  ) THEN
    CREATE POLICY "Anyone can read menu items"
      ON menu_items FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'menu_items' AND policyname = 'Authenticated users can manage menu items'
  ) THEN
    CREATE POLICY "Authenticated users can manage menu items"
      ON menu_items FOR ALL USING (true) WITH CHECK (true);
  END IF;
END
$$;

-- Policies for variations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'variations' AND policyname = 'Anyone can read variations'
  ) THEN
    CREATE POLICY "Anyone can read variations"
      ON variations FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'variations' AND policyname = 'Authenticated users can manage variations'
  ) THEN
    CREATE POLICY "Authenticated users can manage variations"
      ON variations FOR ALL USING (true) WITH CHECK (true);
  END IF;
END
$$;

-- Policies for add_ons
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'add_ons' AND policyname = 'Anyone can read add-ons'
  ) THEN
    CREATE POLICY "Anyone can read add-ons"
      ON add_ons FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'add_ons' AND policyname = 'Authenticated users can manage add-ons'
  ) THEN
    CREATE POLICY "Authenticated users can manage add-ons"
      ON add_ons FOR ALL USING (true) WITH CHECK (true);
  END IF;
END
$$;

-- Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON menu_items, variations, add_ons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON menu_items, variations, add_ons TO authenticated;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';