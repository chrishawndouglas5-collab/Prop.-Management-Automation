
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing env vars')
    process.exit(1)
}

// Use Service Role to bypass RLS/Certain checks (Wait, signup should be public/anon)
// Actually, let's use the ANON key to simulate the real browser environment.
// But wait, I only have SERVICE_ROLE_KEY in .env.local usually from my previous reads?
// Let's check env.local content.
// Assuming I have ANON key, otherwise I use Service Role but that might behave differently.

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
)

const EMAIL = 'chrishawndouglas5@gmail.com'
const PASSWORD = 'TestPassword123!' // A valid strong password to rule out validation

async function testSignup() {
    console.log(`Attempting signup for: ${EMAIL}`)

    const { data, error } = await supabase.auth.signUp({
        email: EMAIL,
        password: PASSWORD,
        options: {
            data: {
                company_name: 'Test Company CLI',
            }
        }
    })

    if (error) {
        console.error('❌ Signup FAILED:')
        console.error(error)
        console.error(`Message: ${error.message}`)
        console.error(`Status: ${error.status}`)
    } else {
        console.log('✅ Signup SUCCESS!')
        console.log('User ID:', data.user?.id)
        console.log('Session:', data.session ? 'Created' : 'Null (Check Email?)')
    }
}

testSignup()
