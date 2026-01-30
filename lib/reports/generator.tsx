import { renderToStream } from '@react-pdf/renderer'
import { ReportDocument } from './ReportDocument'
import { groupTransactionsByCategory } from './calculator'
import { createClient } from '@/lib/supabase/server'
import React from 'react'

// Helper to convert stream to buffer
async function renderToBuffer(element: React.ReactElement): Promise<Buffer> {
    const stream = await renderToStream(element as any)
    return new Promise((resolve, reject) => {
        const chunks: any[] = []
        stream.on('data', (chunk) => chunks.push(chunk))
        stream.on('end', () => resolve(Buffer.concat(chunks)))
        stream.on('error', (err) => reject(err))
    })
}

// Legacy helper (kept for backward compatibility if other parts use it)
export function calculateMetrics(transactions: any[]) {
    let totalIncome = 0
    let totalExpenses = 0
    transactions.forEach(t => {
        if (t.transaction_type === 'income') totalIncome += Number(t.amount)
        else totalExpenses += Number(t.amount)
    })
    return {
        totalIncome,
        totalExpenses,
        netOperatingIncome: totalIncome - totalExpenses
    }
}

// New Centralized Generation Function
export async function generatePropertyReport({
    customerId,
    propertyId,
    month,
    year,
    customerDetails // Optional override to avoid redundant DB calls
}: {
    customerId: string
    propertyId: string
    month: number
    year: number
    customerDetails?: {
        company_name: string
        logo_url?: string | null
    }
}) {
    const supabase = await createClient()

    // 1. Fetch property
    const { data: property, error: propError } = await supabase
        .from('properties')
        .select('property_name')
        .eq('id', propertyId)
        .single() as any

    if (propError || !property) throw new Error('Property not found')

    // 2. Resolve Customer (Use passed details OR fetch)
    let customer = customerDetails

    if (!customer) {
        const { data: fetchedCustomer, error: custError } = await supabase
            .from('customers')
            .select('company_name, logo_url')
            .eq('id', customerId)
            .single() as any

        if (custError || !fetchedCustomer) throw new Error('Customer not found')
        customer = fetchedCustomer
    }

    // 2. Fetch transactions for this property and month
    // Determine start and end dates
    const startDate = new Date(year, month - 1, 1)
    // To get the last day of the month, we go to day 0 of the next month
    const endDate = new Date(year, month, 0)
    // Add time component to end of day? 
    // ISO string of date only is usually YYYY-MM-DDT00:00:00.000Z.
    // If our DB stores 'date' type, strictly matching YYYY-MM-DD is fine.
    // If timestamptz, we need full range. 
    // Assuming 'date' column based on previous parsing logic `transaction_date: string`.

    const { data: transactions } = await supabase
        .from('property_data')
        .select('*')
        .eq('property_id', propertyId)
        .gte('transaction_date', startDate.toISOString())
        .gte('transaction_date', startDate.toISOString())
        .lte('transaction_date', endDate.toISOString()) as any

    if (!transactions || transactions.length === 0) {
        // Return null or throw? The prompt says "throw new Error".
        throw new Error('No transaction data found for this period')
    }

    // 3. Process transactions into bucket structure
    const reportData = groupTransactionsByCategory(transactions as any[])

    // 4. Generate PDF with new structure
    const pdfBuffer = await renderToBuffer(
        <ReportDocument
            propertyName={property.property_name}
            month={month}
            year={year}
            data={reportData}
            logoUrl={customer?.logo_url || undefined}
            companyName={customer?.company_name}
        />
    )

    // 5. Upload to storage
    const filename = `${customerId}/${propertyId}/${year}-${month}.pdf`
    const { error: uploadError } = await supabase.storage
        .from('reports')
        .upload(filename, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true,
        })

    if (uploadError) throw uploadError

    const { data: UrlData } = supabase.storage
        .from('reports')
        .getPublicUrl(filename)

    const publicUrl = UrlData.publicUrl

    // 6. Save report record
    // Upsert ensures that if a user regenerates a report for the same period, we update the existing record
    // 6. Save report record
    // We manually check for existence to avoid "ON CONFLICT" errors if the unique constraint is missing
    const { data: existingReport } = await supabase
        .from('reports')
        .select('id')
        .eq('customer_id', customerId)
        .eq('property_id', propertyId)
        .eq('report_month', month)
        .eq('report_year', year)
        .maybeSingle() as any

    let saveError;

    if (existingReport) {
        const { error } = await supabase
            .from('reports')
            .update({
                pdf_url: publicUrl,
                storage_path: filename,
                generated_at: new Date().toISOString(),
                status: 'generated'
            })
            .eq('id', existingReport.id)
        saveError = error
    } else {
        const { error } = await supabase
            .from('reports')
            .insert({
                customer_id: customerId,
                property_id: propertyId,
                report_month: month,
                report_year: year,
                pdf_url: publicUrl,
                storage_path: filename,
                generated_at: new Date().toISOString(),
                status: 'generated',
            })
        saveError = error
    }

    if (saveError) {
        console.error('Failed to save report record:', saveError)
        // We don't throw here because the PDF was successfully generated and uploaded
        // The user can still access it if they have the link, but it won't show in the list
    }

    return { url: publicUrl, buffer: pdfBuffer }
}

// Keep the stream export for compatibility with Cron if it imports it directly
// But ideally Cron should update to use `generatePropertyReport`.
export async function generateReportPDF(data: any): Promise<NodeJS.ReadableStream> {
    // If this is called by legacy code, we should map it to new doc?
    // Or keep old doc?
    // User Instructions: "Enhance PDF Report Design".
    // "Existing functionality tests: ... Report generation cron job still works"
    // The cron job (which I edited in previous step) calls `generateReportPDF(reportData)`.
    // It passes a flat structure. `ReportDocument` expects Buckets.
    // I should convert the flat structure to Buckets HERE if generic data is passed.

    // Check if data has 'income' bucket. If not, calculate it.
    // The cron job passes `transactions: [...]`.
    let reportData = data;
    if (!data.income || !data.noi) {
        reportData = groupTransactionsByCategory(data.transactions || [])
    }

    return await renderToStream(
        <ReportDocument
            propertyName={data.propertyName}
            month={parseInt(data.reportPeriod.split('/')[0])}
            year={parseInt(data.reportPeriod.split('/')[1])}
            data={reportData}
            logoUrl={data.logoUrl}
            companyName={data.ownerName}
        />
    )
}
