-- Debug orders table access
-- Run this in Supabase SQL Editor to diagnose the issue

-- 1. Check if orders table exists
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'orders' AND table_schema = 'public';

-- 2. Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'orders';

-- 4. Check existing RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'orders';

-- 5. Try a simple select to test permissions
SELECT COUNT(*) as order_count 
FROM orders;

-- 6. Show sample data structure (if any)
SELECT id, customer_name, created_at 
FROM orders 
LIMIT 1;
