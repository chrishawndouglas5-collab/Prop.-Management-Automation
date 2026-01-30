
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const EMAIL = 'chrishawndouglas5@gmail.com'

async function diagnose() {
    console.log(`Diagnosing user: ${EMAIL}`)

    // 1. Check Auth User via Admin API
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
        console.error('Auth List Error:', authError)
        return
    }

    const user = users.find(u => u.email === EMAIL)

    if (!user) {
        console.log('❌ Auth User: NOT FOUND')
        console.log('Action: User needs to Sign Up.')
    } else {
        console.log('✅ Auth User: FOUND')
        console.log(`   ID: ${user.id}`)
        console.log(`   Confirmed At: ${user.email_confirmed_at}`)
        console.log(`   Metadata:`, user.user_metadata)

        // 2. Check Customer Record
        const { data: customer, error: dbError } = await supabase
            .from('customers')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (dbError) {
            console.error('❌ Customer Record: ERROR')
            console.error(dbError)
        } else if (!customer) {
            console.log('❌ Customer Record: MISSING')
            console.log('   (This is the "Zombie User" state)')
        } else {
            console.log('✅ Customer Record: FOUND')
            console.log(customer)
        }
    }
}

diagnose()
