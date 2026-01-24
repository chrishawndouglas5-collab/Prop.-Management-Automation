import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const supabase = await createClient()

    // Check DB connection
    const { data, error } = await supabase.from('customers').select('count', { count: 'exact', head: true })

    // Check Storage connection
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets()

    if (error || storageError) {
        return NextResponse.json({
            status: 'unhealthy',
            db: error ? 'disconnected' : 'connected',
            storage: storageError ? 'disconnected' : 'connected',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }

    return NextResponse.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    })
}
