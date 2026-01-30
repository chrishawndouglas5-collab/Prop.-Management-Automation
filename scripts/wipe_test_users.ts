
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Error: Missing Supabase URL or Service Role Key in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function wipeUsers() {
    console.log('Starting wipe process...')

    // 1. Cascade delete all dependent tables first
    console.log('Deleting dependent records...')

    const steps = [
        { table: 'reports', name: 'Reports' },
        { table: 'property_data', name: 'Property Data' },
        { table: 'churn_records', name: 'Churn Records' },
        { table: 'support_tickets', name: 'Support Tickets' },
        { table: 'automation_logs', name: 'Automation Logs' },
        { table: 'properties', name: 'Properties' }, // Properties depends on customers
        { table: 'customers', name: 'Customers' }      // Customers depends on users
    ]

    for (const step of steps) {
        console.log(`Deleting ${step.name}...`)
        const { error } = await supabase.from(step.table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
        // select() usage was causing TS error

        if (error) {
            console.error(`FAILED to delete ${step.name}: ${error.message} (Code: ${error.code})`)
            // If checking cascading, proceed but warn
        } else {
            console.log(`Successfully deleted ${step.name}.`)
        }
    }

    // 2. Delete all users
    console.log('Fetching users to delete...')
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
        console.error('Error listing users:', error.message)
        return
    }

    if (!users || users.length === 0) {
        console.log('No users found to delete.')
        return
    }

    console.log(`Found ${users.length} users. Deleting...`)

    for (const user of users) {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
        if (deleteError) {
            console.error(`Failed to delete user ${user.email}:`, deleteError.message)
        } else {
            console.log(`Deleted user: ${user.email} (${user.id})`)
        }
    }
    console.log('Wipe complete.')
}

wipeUsers()
