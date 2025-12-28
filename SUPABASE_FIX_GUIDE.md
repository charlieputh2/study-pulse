# Fix Supabase CORS and 502 Errors Guide

## Quick Fix Steps

### 1. Fix CORS Issues
Go to your Supabase Dashboard → SQL Editor and run this SQL:

```sql
-- Enable CORS for localhost development
INSERT INTO auth.cors_origins (origin, is_active)
VALUES 
  ('http://localhost:5173', true),
  ('http://localhost:3000', true),
  ('https://localhost:5173', true),
  ('https://localhost:3000', true)
ON CONFLICT (origin) DO UPDATE SET is_active = true;
```

### 2. Enable RLS Policies
```sql
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create public access policies
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
```

### 3. Grant Permissions
```sql
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
```

## Alternative: Manual Configuration

### In Supabase Dashboard:

1. **Authentication → Settings**:
   - Add `http://localhost:5173` to "Site URL"
   - Add `http://localhost:5173` to "Redirect URLs"

2. **Authentication → Settings → CORS**:
   - Add `http://localhost:5173` to allowed origins

3. **Project Settings → API**:
   - Ensure "anon" and "service_role" keys are enabled
   - Check that JWT secret is set

4. **Database → Replication**:
   - Enable "Realtime" for your tables
   - Add tables to publications

## If 502 Errors Persist:

### Check Supabase Status
- Visit https://status.supabase.com
- Check if there are any ongoing issues

### Restart Supabase Project
1. Go to Project Settings → General
2. Click "Restart project"

### Check Database Logs
1. Go to Database → Logs
2. Look for any error messages

## Environment Variables Check

Make sure your `.env` file has:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Test Connection

After applying fixes, restart your development server:
```bash
npm run dev
```

The errors should be resolved and your website should be fully functional!
