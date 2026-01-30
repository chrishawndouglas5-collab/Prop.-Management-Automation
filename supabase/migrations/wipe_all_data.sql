-- FINAL "NUCLEAR" CLEANUP SCRIPT
-- This will wipe ALL application data AND storage objects.

SET session_replication_role = 'replica';

BEGIN;

-- 1. Delete all Storage Objects (files like logos, PDFs) that might link to users
DELETE FROM storage.objects;

-- 2. Delete all Application Data
DELETE FROM public.automation_logs;
DELETE FROM public.support_tickets;
DELETE FROM public.churn_records;
DELETE FROM public.property_data;
DELETE FROM public.reports;
DELETE FROM public.properties;
DELETE FROM public.customers;

COMMIT;

SET session_replication_role = 'origin';

-- After running this:
-- 1. Look for "Success".
-- 2. Go to Authentication -> Users -> Delete User.
-- 3. If it STILL fails, you might need to manually delete the 'storage' bucket in the Storage tab, 
--    but usually deleting objects is enough.
