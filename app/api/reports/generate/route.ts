import { createClient } from '@/lib/supabase/server'
import { generatePropertyReport } from '@/lib/reports/generator'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { propertyId, month, year } = body

        if (!propertyId || !month || !year) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Verify property ownership
        // The generator function does some verification but primarily relies on fetching.
        // Good to verify here or rely on generator which checks fetching by ID.
        // Generator fetches "customer details" using passed ID. 
        // We need to resolve customer ID from user ID here.

        const { data: customer } = await supabase
            .from('customers')
            .select('id, company_name, logo_url')
            .eq('user_id', user.id)
            .single()

        if (!customer) {
            return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 })
        }

        // Verify property belongs to customer
        const { data: property } = await supabase
            .from('properties')
            .select('id')
            .eq('id', propertyId)
            .eq('customer_id', customer.id)
            .single()

        if (!property) {
            return NextResponse.json({ error: 'Property not found or access denied' }, { status: 404 })
        }

        const result = await generatePropertyReport({
            customerId: customer.id,
            propertyId: propertyId,
            month,
            year,
            customerDetails: {
                company_name: customer.company_name,
                logo_url: customer.logo_url
            }
        })

        return NextResponse.json({ success: true, url: result.url })

    } catch (error: any) {
        console.error('Report Generation Error:', error)
        return NextResponse.json({ error: error.message || 'Failed to generate report' }, { status: 500 })
    }
}
