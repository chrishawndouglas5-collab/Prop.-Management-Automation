
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase URL or Service Role Key in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function setupStorage() {
    console.log('Using Supabase URL:', supabaseUrl)
    console.log('Attempting to create "logos" bucket...')

    const { data, error } = await supabase
        .storage
        .createBucket('logos', {
            public: true,
            fileSizeLimit: 1048576, // 1MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        })

    if (error) {
        if (error.message.includes('already exists') || error.message.includes('Duplicate')) {
            console.log('✅ Bucket "logos" already exists.')

            // Update to public just in case
            const { error: updateError } = await supabase.storage.updateBucket('logos', { public: true })
            if (updateError) console.error('Warning: Could not update bucket to public:', updateError.message)
            else console.log('✅ Verified bucket is public.')

        } else {
            console.error('❌ Error creating bucket:', error.message)
            return
        }
    } else {
        console.log('✅ Bucket "logos" created successfully.')
    }

    // List buckets to confirm
    const { data: buckets } = await supabase.storage.listBuckets()
    console.log('Current buckets:', buckets?.map(b => b.name).join(', '))
}

setupStorage()
