'use server'

import { createClient } from '@/lib/supabase/server'
import { generatePropertyReport } from '@/lib/reports/generator'
import { sendReportEmail } from '@/lib/email/sender'
import { revalidatePath } from 'next/cache'

export type ReportResult = {
    propertyId: string
    propertyName: string
    status: 'success' | 'failed' | 'skipped'
    message?: string
}

export type GenerationResponse = {
    success: boolean
    message: string
    results?: ReportResult[]
}

export async function triggerReportGeneration(prevState: any, formData: FormData): Promise<GenerationResponse> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: 'Unauthorized' }

    const month = parseInt(formData.get('month') as string)
    const year = parseInt(formData.get('year') as string)

    // 1. Get customer
    const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .single() as any

    if (!customer) return { success: false, message: 'Customer not found' }

    // 2. Fetch properties
    const { data: properties } = await supabase
        .from('properties')
        .select('*')
        .eq('customer_id', customer.id) as any

    if (!properties || properties.length === 0) {
        return { success: false, message: 'No properties found to generate reports for.' }
    }

    const results: ReportResult[] = []

    // 3. Loop properties with Explicit Result Tracking
    for (const property of properties) {
        try {
            // 3a. Generate
            const { url, buffer } = await generatePropertyReport({
                customerId: customer.id,
                propertyId: property.id,
                month: month,
                year: year,
                customerDetails: {
                    company_name: customer.company_name,
                    logo_url: customer.logo_url
                }
            })

            // 3b. Email
            const emailResult = await sendReportEmail(
                customer.contact_email || user.email,
                `Owner Statement: ${property.property_name} - ${month}/${year}`,
                `<p>Attached is the monthly owner statement for ${property.property_name}.</p>`,
                buffer,
                `Report_${property.property_name}_${month}_${year}.pdf`
            )

            if (!emailResult.success) {
                throw new Error(`Email failed: ${(emailResult.error as any)?.message || 'Unknown email error'}`)
            }

            results.push({
                propertyId: property.id,
                propertyName: property.property_name,
                status: 'success',
                message: 'Generated & Emailed'
            })

        } catch (error: any) {
            console.error(`Error processing ${property.property_name}:`, error)

            let status: 'failed' | 'skipped' = 'failed'
            if (error.message && error.message.includes('No transaction data')) {
                status = 'skipped'
            }

            results.push({
                propertyId: property.id,
                propertyName: property.property_name,
                status: status,
                message: error.message || 'Unknown error'
            })
        }
    }

    revalidatePath('/dashboard/reports')

    const successCount = results.filter(r => r.status === 'success').length
    const failCount = results.filter(r => r.status === 'failed').length
    const skipCount = results.filter(r => r.status === 'skipped').length

    if (successCount === 0 && failCount === 0 && skipCount > 0) {
        return {
            success: false,
            message: `No reports generated. ${skipCount} properties had no data for this period.`,
            results
        }
    }

    if (failCount > 0) {
        return {
            success: false,
            message: `Completed with errors. Success: ${successCount}, Failed: ${failCount}.`,
            results
        }
    }

    return {
        success: true,
        message: `Successfully generated ${successCount} reports.`,
        results
    }
}
