'use server'

import { createClient } from '@/lib/supabase/server'
import { generateReportPDF, calculateMetrics } from '@/lib/reports/generator'
import { sendReportEmail } from '@/lib/email/sender'
import { revalidatePath } from 'next/cache'

export async function triggerReportGeneration(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: 'Unauthorized' }

    const month = parseInt(formData.get('month') as string)
    const year = parseInt(formData.get('year') as string)

    // 1. Get customer
    const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .single() as any

    if (!customer) return { message: 'Customer not found' }

    // 2. Fetch properties
    const { data: properties } = await supabase
        .from('properties')
        .select('*')
        .eq('customer_id', customer.id) as any

    if (!properties || properties.length === 0) {
        return { message: 'No properties to generate reports for' }
    }

    let generatedCount = 0

    // 3. Loop properties
    for (const property of properties) {
        // 3a. Fetch transactions for month/year (simplistic date filter)
        // Note: This relies on database being able to filter by date range
        // Improve: use date-fns startOfMonth/endOfMonth to get precise ISO range
        const startDate = new Date(year, month - 1, 1).toISOString() // month is 1-indexed in form? assuming 1-12
        const endDate = new Date(year, month, 0).toISOString() // last day of month

        const { data: transactions } = await supabase
            .from('property_data')
            .select('*')
            .eq('property_id', property.id)
            .gte('transaction_date', startDate)
            .lte('transaction_date', endDate) as any

        if (!transactions || transactions.length === 0) continue

        // 3b. Generate PDF
        const metrics = calculateMetrics(transactions)
        const reportData = {
            propertyName: property.property_name,
            ownerName: customer.company_name,
            reportPeriod: `${month}/${year}`,
            ...metrics,
            transactions: transactions.map((t: any) => ({
                date: t.transaction_date,
                description: t.description,
                category: t.category,
                amount: Number(t.amount),
                type: t.transaction_type
            }))
        }

        const pdfStream = await generateReportPDF(reportData)
        // Convert stream to buffer
        const chunks: any[] = []
        for await (const chunk of pdfStream) {
            chunks.push(chunk)
        }
        const pdfBuffer = Buffer.concat(chunks)

        // 3c. Upload to Storage
        const fileName = `reports/${customer.id}/${property.id}_${year}_${month}.pdf`
        const { error: uploadError } = await supabase
            .storage
            .from('reports')
            .upload(fileName, pdfBuffer, {
                contentType: 'application/pdf',
                upsert: true
            })

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage.from('reports').getPublicUrl(fileName)

        // 3d. Record in DB
        const { error: dbError } = await supabase
            .from('reports')
            .upsert({
                customer_id: customer.id,
                property_id: property.id,
                report_month: month,
                report_year: year,
                pdf_url: publicUrl,
                storage_path: fileName,
                status: 'generated',
                generated_at: new Date().toISOString()
            } as any, { onConflict: 'customer_id, property_id, report_month, report_year' }) // requires unique constraint on these cols ideally

        // 3e. Send Email (to customer contact email for now)
        await sendReportEmail(
            customer.contact_email || user.email,
            `Owner Statement: ${property.property_name} - ${month}/${year}`,
            `<p>Attached is the monthly owner statement for ${property.property_name}.</p>`,
            pdfBuffer,
            `Report_${property.property_name}_${month}_${year}.pdf`
        )

        generatedCount++
    }

    revalidatePath('/dashboard/reports')
    return { message: `Generated and sent ${generatedCount} reports`, success: true }
}
