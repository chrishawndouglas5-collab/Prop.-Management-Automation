-- INSPECT TRIGGERS
SELECT 
    event_object_schema as table_schema,
    event_object_table as table_name,
    trigger_schema,
    trigger_name,
    string_agg(event_manipulation, ',') as event,
    action_timing as activation,
    condition_timing,
    action_statement as definition
FROM information_schema.triggers
WHERE event_object_table = 'users' OR event_object_table = 'customers'
GROUP BY 1,2,3,4,6,7,8;

-- Also check function definition explicitly
SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'handle_new_user';
