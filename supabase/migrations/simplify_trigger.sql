-- SIMPLIFIED TRIGGER (Remove Complexity)
-- This removes the "ON CONFLICT" check which might be causing the error if the constraint is missing.

-- 1. Drop existing
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Create Simple Function (No Error Swallowing, No Complex Checks)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.customers (user_id, contact_email, status, company_name)
  VALUES (
    new.id,
    new.email,
    'trialing',
    -- Handle missing metadata safely
    COALESCE(new.raw_user_meta_data->>'company_name', 'My Company')
  );
  
  RETURN new;
END;
$$;

-- 3. Re-attach
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
