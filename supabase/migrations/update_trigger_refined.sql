-- 1. Drop existing trigger and function to ensure clean state
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Create the robust function
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
    -- Extract company_name from metadata, fallback to 'My Company' if missing
    COALESCE(new.raw_user_meta_data->>'company_name', 'My Company')
  )
  -- Prevent error if somehow a record already got created (idempotency)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
END;
$$;

-- 3. Re-attach the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
