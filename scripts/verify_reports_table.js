const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars. Ensure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyReports() {
    console.log('🔍 Verifying Reports Table...');

    // 1. Check if we can select from the reports table
    const { data, error } = await supabase.from('reports').select('*').limit(5);

    if (error) {
        console.error('❌ Error accessing reports table:', error.message);
        if (error.code === '42P01') {
            console.error('   -> Table "reports" does NOT exist. You must run the SQL migration!');
        }
        return;
    }

    console.log('✅ Reports table exists.');
    console.log(`📊 Found ${data.length} reports.`);

    if (data.length > 0) {
        console.log('   Sample Report:', {
            id: data[0].id,
            month: data[0].report_month,
            year: data[0].report_year,
            status: data[0].status,
            pdf_url: data[0].pdf_url ? 'EXISTS' : 'MISSING'
        });
    } else {
        console.log('   (Table is empty. Try generating a report in the dashboard)');
    }

    // 2. Check RLS Policies (Indirectly via metadata or just ensuring Service Role works)
    // Service role works (we just used it). 
    // We can't easily check RLS definitions via JS client without specific privileges or SQL function.
    // But if the table exists and is empty, it might be that the Application (Authenticated User) failed to insert.
}

verifyReports().catch(console.error);
