const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceInsert() {
    console.log('🚀 Force Inserting Report (Manual Check)...');

    // 1. Get a customer and property
    const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('id, property_name, customer_id')
        .limit(1);

    if (propError || !properties || properties.length === 0) {
        console.error('❌ No properties found to attach report to.');
        return;
    }

    const prop = properties[0];
    console.log(`📌 Using Property: ${prop.property_name} (ID: ${prop.id})`);

    // 2. Report Data
    const reportMonth = new Date().getMonth() + 1;
    const reportYear = new Date().getFullYear();

    // 3. Check Existence
    const { data: existing } = await supabase
        .from('reports')
        .select('id')
        .eq('customer_id', prop.customer_id)
        .eq('property_id', prop.id)
        .eq('report_month', reportMonth)
        .eq('report_year', reportYear)
        .maybeSingle();

    let data, error;

    if (existing) {
        console.log('   (Updating existing report...)');
        const res = await supabase.from('reports').update({
            pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            storage_path: 'dummy/update.pdf',
            generated_at: new Date().toISOString(),
            status: 'generated'
        }).eq('id', existing.id).select().single();
        data = res.data;
        error = res.error;
    } else {
        console.log('   (Inserting new report...)');
        const res = await supabase.from('reports').insert({
            customer_id: prop.customer_id,
            property_id: prop.id,
            report_month: reportMonth,
            report_year: reportYear,
            pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            storage_path: 'dummy/path.pdf',
            status: 'generated',
            generated_at: new Date().toISOString()
        }).select().single();
        data = res.data;
        error = res.error;
    }

    if (error) {
        console.error('❌ Operation Failed:', error.message);
    } else {
        console.log('✅ Success!');
        console.log('   Report ID:', data.id);
        console.log('   👉 GO CHECK THE DASHBOARD NOW. You should see this report.');
    }
}

forceInsert().catch(console.error);
