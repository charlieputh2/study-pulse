-- Ensure FAQs table exists with RLS and grants for admin UI
-- Run via Supabase migrations or in SQL editor on your project

-- Required for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the faqs table if it does not exist
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL DEFAULT 'PRODUCT & USAGE',
  order_index integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Policies (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'faqs' AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access" ON public.faqs
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'faqs' AND policyname = 'Allow authenticated insert'
  ) THEN
    CREATE POLICY "Allow authenticated insert" ON public.faqs
      FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'faqs' AND policyname = 'Allow authenticated update'
  ) THEN
    CREATE POLICY "Allow authenticated update" ON public.faqs
      FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'faqs' AND policyname = 'Allow authenticated delete'
  ) THEN
    CREATE POLICY "Allow authenticated delete" ON public.faqs
      FOR DELETE USING (true);
  END IF;
END
$$;

-- Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.faqs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.faqs TO authenticated;

-- Indexes for ordering/filtering
CREATE INDEX IF NOT EXISTS faqs_order_idx ON public.faqs (order_index ASC);
CREATE INDEX IF NOT EXISTS faqs_category_idx ON public.faqs (category);
CREATE INDEX IF NOT EXISTS faqs_active_idx ON public.faqs (is_active);

-- Seed defaults if table is empty
INSERT INTO public.faqs (question, answer, category, order_index, is_active) VALUES
('Can I use Tirzepatide?', 'Before purchasing, please check if Tirzepatide is suitable for you. ✔️ View the checklist here — Contact us for more details.', 'PRODUCT & USAGE', 1, true),
('Do you reconstitute (recon) Tirzepatide?', 'Yes — for Metro Manila orders only. I provide free reconstitution when you purchase the complete set. I use pharma-grade bacteriostatic water, and I ship it with an ice pack + insulated pouch to maintain stability.', 'PRODUCT & USAGE', 2, true),
('What size needles and cartridges do you offer?', '• Needles: Compatible with all insulin-style pens (standard pen needle sizes).\n• Cartridges: Standard 3mL capacity.', 'PRODUCT & USAGE', 3, true),
('Can the pen pusher be retracted?', '• Reusable pens: Yes, the pusher can be retracted.\n• Disposable pens: The pusher cannot be retracted and will stay forward once pushed.', 'PRODUCT & USAGE', 4, true),
('How should peptides be stored?', 'Peptides must be stored in the refrigerator, especially once reconstituted.', 'PRODUCT & USAGE', 5, true),
('What''s included in my order?', 'Depending on your chosen items:\n• 3mL cartridge\n• Pen needles\n• Optional: alcohol swabs\n• Free Tirzepatide reconstitution for Metro Manila set orders', 'ORDERING & PACKAGING', 6, true),
('Do you offer bundles or discounts?', 'Yes — I offer curated bundles and custom sets. Message me for personalized bundle options.', 'ORDERING & PACKAGING', 7, true),
('Can I return items?', '• Pens: Returnable within 1 week if defective.\n• Needles and syringes: Not returnable for hygiene and safety.', 'ORDERING & PACKAGING', 8, true),
('What payment options do you accept?', '• GCash\n• Security Bank\n• BDO\n\n❌ COD is not accepted, except for Lalamove → You can pay the rider directly or have the rider pay upfront on your behalf.', 'PAYMENT METHODS', 9, true),
('Where are you located?', '📍 Merville, Parañaque City', 'SHIPPING & DELIVERY', 10, true),
('How long is shipping?', '📦 J&T Express: Usually 2–3 days (transit time may vary by location and sorting)', 'SHIPPING & DELIVERY', 11, true),
('When do orders ship out?', 'Orders placed before 11:00 AM ship out on the next J&T schedule (Tuesday & Thursday) → Subject to order volume.', 'SHIPPING & DELIVERY', 12, true),
('Do you ship nationwide?', 'Yes — • J&T Express (nationwide) • Lalamove (Metro Manila & nearby areas)', 'SHIPPING & DELIVERY', 13, true)
ON CONFLICT DO NOTHING;

-- Keep PostgREST schema cache fresh
NOTIFY pgrst, 'reload schema';
