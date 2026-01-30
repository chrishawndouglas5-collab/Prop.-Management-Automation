-- FIX: Constraints & Cleanup (Run this in Supabase SQL Editor)

-- 1. Cleanup specific broken user to allow fresh retry
-- We delete from customers first (if exists) then auth.users
DELETE FROM public.customers WHERE contact_email = 'chrishawndouglas5@gmail.com';
DELETE FROM auth.users WHERE email = 'chrishawndouglas5@gmail.com';

-- 2. Ensure Unique Constraint exists on user_id
-- This is CRITICAL for the "ON CONFLICT" clause in the trigger to work properly.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'customers_user_id_key'
    ) THEN
        ALTER TABLE public.customers ADD CONSTRAINT customers_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- 3. Re-apply the Trigger Function (with the fix)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.customers (user_id, contact_email, status, company_name)
  VALUES (
    new.id,
    new.email, -- uses the email from auth.users
    'trialing',
    COALESCE(new.raw_user_meta_data->>'company_name', 'My Company')
  )
  -- This requires the UNIQUE constraint we added above in step 2
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
END;
$$;

-- 4. Re-attach the Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Grant Permissions (Ensure service_role has access)
GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.customers TO postgres;
