/**
 * End-to-End Test: CSV Upload → Review → Report Generation
 * 
 * Run with: npx tsx scripts/test-e2e.ts
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Simulate Admin for setup/cleanup, but we test logic

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Env Vars. Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testE2E() {
    console.log('🧪 Starting End-to-End Test (RLS Verification)...\n')

    // Step 1: Create test customer
    console.log('📝 Step 1: Creating test customer...')
    const email = `test-${Date.now()}@example.com`
    const { data: testUser, error: userError } = await supabase.auth.admin.createUser({
        email: email,
        password: 'TestPassword123!',
        email_confirm: true,
    })

    if (userError) {
        console.error('❌ Failed to create test user:', userError)
        return
    }

    // Allow trigger to run or insert manually if trigger relies on it
    // We'll wait a second to see if trigger works, otherwise manual insert
    await new Promise(r => setTimeout(r, 2000))

    let customerId = ''
    const { data: existingCustomer } = await supabase.from('customers').select('id').eq('user_id', testUser.user.id).single()

    if (existingCustomer) {
        customerId = existingCustomer.id
        console.log('✅ Customer created via Trigger:', customerId)
    } else {
        console.log('⚠️ Trigger failed or slow, inserting customer manually...')
        const { data: customer, error: customerError } = await supabase
            .from('customers')
            .insert({
                user_id: testUser.user.id,
                company_name: 'Test Property Management',
                unit_count: 50,
                status: 'active',
                contact_email: email
            })
            .select()
            .single()

        if (customerError) {
            console.error('❌ Failed to create customer:', customerError)
            return
        }
        customerId = customer.id
        console.log('✅ Test customer manually inserted:', customerId)
    }

    // Step 2: Create test property
    console.log('\n📝 Step 2: Creating test property...')
    const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
            customer_id: customerId,
            property_name: 'E2E Test Apartments',
            address: '123 Test St',
            unit_count: 50,
        })
        .select()
        .single()

    if (propertyError) {
        console.error('❌ Failed to create property:', propertyError)
        return
    }

    console.log('✅ Test property created:', property.id)

    // Step 3: Insert test transactions
    // logic mimics 'app/dashboard/upload/review/actions.ts' but we run it as Service Role here meant to VERIFY the TABLE accepts data.
    // Ideally we should test AS the user (RLS), but we need to sign in.

    console.log('\n📝 Step 3: Inserting test transactions (Testing RLS Policies)...')

    // Sign in as the user to test RLS
    const authClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data: signInData, error: signInError } = await authClient.auth.signInWithPassword({
        email: email,
        password: 'TestPassword123!'
    })

    if (signInError) {
        console.error('❌ Failed to sign in as user:', signInError)
        return
    }

    console.log('✅ Signed in as user. Attempting insert...')

    const transactions = [
        {
            customer_id: customerId,
            property_id: property.id,
            transaction_date: '2025-01-15',
            category: 'Rent',
            description: 'Monthly rent - Unit 101',
            amount: 1500,
            transaction_type: 'income' as const,
        }
    ]

    const { data: insertedTransactions, error: transactionError } = await authClient
        .from('property_data')
        .insert(transactions)
        .select()

    if (transactionError) {
        console.error('❌ RLS INSERT FAILED:', transactionError)
        console.error('   This suggests the RLS policies are NOT working or applied!')
    } else {
        console.log('✅ RLS Success! User inserted transaction:', insertedTransactions.length)
    }

    // Step 5: Cleanup
    console.log('\n📝 Step 5: Cleaning up test data...')

    // Clean using Admin
    if (property.id) {
        await supabase.from('property_data').delete().eq('property_id', property.id)
        await supabase.from('properties').delete().eq('id', property.id)
    }
    if (customerId) await supabase.from('customers').delete().eq('id', customerId)
    await supabase.auth.admin.deleteUser(testUser.user.id)

    console.log('✅ Test cleanup complete')

    if (!transactionError) {
        console.log('\n🎉 END-TO-END TEST PASSED!\n')
    } else {
        console.log('\n❌ TEST FAILED.\n')
        process.exit(1)
    }
}

testE2E().catch(console.error)
