
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { webcrypto } from 'node:crypto'
// Node 19+ has global crypto, but for safety in older environments or TS check:
const crypto = globalThis.crypto || webcrypto

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceRoleKey)

// --- CONFIGURATION ---
const USER_EMAIL = 'demo@propauto.com'
const HISTORY_MONTHS = 6 // Generate data for past 6 months

const PROPERTIES = [
    { name: 'Sunset Apartments', units: 40, type: 'Multi-Family', address: '100 Sunset Blvd' },
    { name: 'Downtown Lofts', units: 15, type: 'Multi-Family', address: '450 Main St' },
    { name: 'Willow Creek Home', units: 1, type: 'Single-Family', address: '12 Willow Ln' }
]

const EXPENSE_CATEGORIES = [
    'Repairs & Maintenance', 'Utilities', 'Landscaping', 'Legal & Professional', 'Management Fees'
]

async function seed() {
    console.log('🚀 Starting Realistic Data Seed...')

    // 1. Get/Create User
    const { data: { users } } = await supabase.auth.admin.listUsers()
    let userId = users.find(u => u.email === USER_EMAIL)?.id

    if (!userId) {
        const { data: newUser } = await supabase.auth.admin.createUser({
            email: USER_EMAIL,
            password: 'password123',
            email_confirm: true
        })
        userId = newUser.user!.id
        console.log('✅ Created Demo User')
    } else {
        console.log('ℹ️ Using Existing User')
    }

    // 2. Get/Create Customer
    let customerId: string
    const { data: cust } = await supabase.from('customers').select('id').eq('user_id', userId).single()
    if (cust) {
        customerId = cust.id
    } else {
        const { data: newCust } = await supabase.from('customers').insert({
            user_id: userId,
            company_name: 'Acme Real Estate Demo',
            contact_email: USER_EMAIL,
            status: 'active'
        }).select().single()
        customerId = newCust.id
        console.log('✅ Created Customer Profile')
    }

    // 3. Clear Old Data (Optional/Safety)
    // console.log('Cleaning old demo data...')
    // await supabase.from('property_data').delete().eq('customer_id', customerId)
    // await supabase.from('properties').delete().eq('customer_id', customerId)

    // 4. Generate Properties & Data
    const transactions: any[] = []

    for (const propTemplate of PROPERTIES) {
        // Upsert Property
        const { data: existingProp } = await supabase.from('properties')
            .select('id')
            .eq('customer_id', customerId)
            .eq('property_name', propTemplate.name)
            .single()

        let propertyId = existingProp?.id

        if (!propertyId) {
            const { data: newProp } = await supabase.from('properties').insert({
                customer_id: customerId,
                property_name: propTemplate.name,
                address: propTemplate.address,
                unit_count: propTemplate.units
            }).select().single()
            propertyId = newProp.id
            console.log(`✅ Created Property: ${propTemplate.name}`)
        }

        // Generate Transactions for History
        const today = new Date()

        for (let m = 0; m < HISTORY_MONTHS; m++) {
            const date = new Date(today.getFullYear(), today.getMonth() - m, 15)
            const dateStr = date.toISOString().split('T')[0]

            // A. Income (Rent Roll)
            // Assume 95% occupancy
            const occupiedUnits = Math.floor(propTemplate.units * 0.95)
            const rentPerUnit = propTemplate.type === 'Single-Family' ? 2500 : 1200

            for (let u = 1; u <= occupiedUnits; u++) {
                transactions.push({
                    customer_id: customerId,
                    property_id: propertyId,
                    transaction_date: dateStr,
                    description: `Rent Payment - Unit ${u}`,
                    amount: rentPerUnit,
                    transaction_type: 'income',
                    category: 'Rent Income'
                })

                // Random Late Fee (5% chance)
                if (Math.random() < 0.05) {
                    transactions.push({
                        customer_id: customerId,
                        property_id: propertyId,
                        transaction_date: new Date(date.getFullYear(), date.getMonth(), 20).toISOString().split('T')[0],
                        description: `Late Fee - Unit ${u}`,
                        amount: 50,
                        transaction_type: 'income',
                        category: 'Late Fees'
                    })
                }
            }

            // B. Expenses
            // 1. Management Fee (e.g. 8% of collected rent)
            const collectedRent = occupiedUnits * rentPerUnit
            const mgmtFee = collectedRent * 0.08
            transactions.push({
                customer_id: customerId,
                property_id: propertyId,
                transaction_date: dateStr,
                description: 'Monthly Management Fee (8%)',
                amount: mgmtFee, // Stored as positive number usually, logic handles it as expense
                transaction_type: 'expense',
                category: 'Management Fees'
            })

            // 2. Repairs (Random 1-3 per month for multifamily)
            const repairsCount = propTemplate.units > 1 ? Math.floor(Math.random() * 3) + 1 : (Math.random() > 0.7 ? 1 : 0)
            const repairTypes = ['Leaking Faucet', 'HVAC Service', 'Drywall Patch', 'Appliance Repair', 'Lock Change']

            for (let r = 0; r < repairsCount; r++) {
                transactions.push({
                    customer_id: customerId,
                    property_id: propertyId,
                    transaction_date: new Date(date.getFullYear(), date.getMonth(), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                    description: repairTypes[Math.floor(Math.random() * repairTypes.length)],
                    amount: Math.floor(Math.random() * 400) + 150,
                    transaction_type: 'expense',
                    category: 'Repairs & Maintenance'
                })
            }

            // 3. Utilities
            if (propTemplate.type === 'Multi-Family') {
                transactions.push({
                    customer_id: customerId,
                    property_id: propertyId,
                    transaction_date: dateStr,
                    description: 'Water & Sewer Bill',
                    amount: 500 + (propTemplate.units * 20), // structured cost
                    transaction_type: 'expense',
                    category: 'Utilities'
                })
                transactions.push({
                    customer_id: customerId,
                    property_id: propertyId,
                    transaction_date: dateStr,
                    description: 'Common Area Electric',
                    amount: 150 + (Math.random() * 50),
                    transaction_type: 'expense',
                    category: 'Utilities'
                })
            }
        }
    }

    console.log(`📝 Generated ${transactions.length} mock transactions...`)

    // Batch Insert (Chunking to avoid payload limits)
    const BATCH_SIZE = 500
    for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
        const batch = transactions.slice(i, i + BATCH_SIZE)
        const { error } = await supabase.from('property_data').insert(batch)
        if (error) {
            console.error('Insert Failed:', error.message)
        } else {
            console.log(`   Inserted batch ${i / BATCH_SIZE + 1}`)
        }
    }

    console.log('✅ SEED COMPLETE. The dashboard should now be rich with data.')
}

seed().catch(console.error)
