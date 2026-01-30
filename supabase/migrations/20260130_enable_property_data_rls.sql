-- FIX: RLS Policies for property_data
-- The current table has RLS enabled but no policies, which defaults to DENY ALL.
-- This script adds policies to allow authenticated users to INSERT and SLECT their own data.

-- 1. Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Customers can insert own property data" ON property_data;
DROP POLICY IF EXISTS "Customers can view own property data" ON property_data;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON property_data;
DROP POLICY IF EXISTS "Enable insert for service role" ON property_data;
DROP POLICY IF EXISTS "Customers can insert own data" ON property_data;

-- 2. Create INSERT Policy
-- Allows users to insert into property_data IF the customer_id belongs to them.
CREATE POLICY "Customers can insert own property data"
ON property_data
FOR INSERT
TO authenticated
WITH CHECK (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

-- 3. Create SELECT Policy
-- Allows users to see their own property_data.
CREATE POLICY "Customers can view own property data"
ON property_data
FOR SELECT
TO authenticated
USING (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

-- 4. Verify (Optional Select to show they exist)
SELECT schemaname, tablename, policyname, permissive, roles, cmd FROM pg_policies WHERE tablename = 'property_data';
