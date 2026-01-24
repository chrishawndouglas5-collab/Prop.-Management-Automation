import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateReportPDF, calculateMetrics } from '@/lib/reports/generator'
import { sendReportEmail } from '@/lib/email/sender'
import { logToNotion } from '@/lib/notion/client'

interface Customer {
    id: string
    company_name: string
    contact_email: string
}

interface Property {
    id: string
    property_name: string
    customer_id: string
}

interface Transaction {
    transaction_date: string
    description: string
    category: string
    amount: number
    transaction_type: 'income' | 'expense'
}

export async function GET(request: NextRequest) {
    // 1. Security Check
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const supabase = await createClient()

    // 2. Determine Period (Previous Month)
    const today = new Date()
    // If today is Jan 2026, prev month is Dec 2025
    const targetDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const month = targetDate.getMonth() + 1 // 1-indexed
    const year = targetDate.getFullYear()

    // 3. Fetch Active Customers
    // For MVP, we might treat all customers as active, or check status='active'
    const { data: customers, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .returns<Customer[]>()
    // .eq('status', 'active') // Uncomment when billing is live

    if (customerError || !customers) {
        await logToNotion('ERROR', 'Cron failed to fetch customers', { error: customerError })
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
    }

    const results = {
        total: customers.length,
        generated: 0,
        failed: 0,
        logs: [] as string[]
    }

    // 4. Iterate Customers
    for (const customer of customers) {
        try {
            // Fetch properties
            const { data: properties } = await supabase
                .from('properties')
                .select('*')
                .eq('customer_id', customer.id)
                .returns<Property[]>()

            if (!properties || properties.length === 0) continue

            for (const property of properties) {
                // Fetch transactions
                const startDate = new Date(year, month - 1, 1).toISOString()
                const endDate = new Date(year, month, 0).toISOString()

                const { data: transactions } = await supabase
                    .from('property_data')
                    .select('*')
                    .eq('property_id', property.id)
                    .gte('transaction_date', startDate)
                    .lte('transaction_date', endDate)
                    .returns<Transaction[]>()

                if (!transactions || transactions.length === 0) continue

                // Check if report already exists?
                // Maybe we want to regenerate, or skip. Let's skip if exists to save resources.
                const { data: existing } = await supabase
                    .from('reports')
                    .select('id')
                    .eq('customer_id', customer.id)
                    .eq('property_id', property.id)
                    .eq('report_month', month)
                    .eq('report_year', year)
                    .single()

                if (existing) {
                    results.logs.push(`Skipped ${property.property_name} (Already exists)`)
                    continue
                }

                // Generate PDF
                const metrics = calculateMetrics(transactions)
                const reportData = {
                    propertyName: property.property_name,
                    ownerName: customer.company_name,
                    reportPeriod: `${month}/${year}`,
                    ...metrics,
                    transactions: transactions.map(t => ({
                        date: t.transaction_date,
                        description: t.description,
                        category: t.category,
                        amount: Number(t.amount),
                        type: t.transaction_type
                    }))
                }

                const pdfStream = await generateReportPDF(reportData)
                const chunks: any[] = []
                for await (const chunk of pdfStream) {
                    chunks.push(chunk)
                }
                const pdfBuffer = Buffer.concat(chunks)

                // Upload
                const fileName = `reports/${customer.id}/${property.id}_${year}_${month}_AUTO.pdf`
                await supabase.storage.from('reports').upload(fileName, pdfBuffer, {
                    contentType: 'application/pdf',
                    upsert: true
                })
                const { data: { publicUrl } } = supabase.storage.from('reports').getPublicUrl(fileName)

                // Insert DB
                await supabase.from('reports').insert({
                    customer_id: customer.id,
                    property_id: property.id,
                    report_month: month,
                    report_year: year,
                    pdf_url: publicUrl,
                    storage_path: fileName,
                    status: 'generated',
                    generated_at: new Date().toISOString()
                } as any)

                // Email
                if (customer.contact_email) {
                    await sendReportEmail(
                        customer.contact_email,
                        `Monthly Statement: ${property.property_name}`,
                        `<p>Here is your automated monthly statement for ${month}/${year}.</p>`,
                        pdfBuffer,
                        `Statement_${year}_${month}.pdf`
                    )
                }

                results.generated++
                results.logs.push(`Generated for ${property.property_name}`)
            }
        } catch (err: any) {
            console.error(`Error processing customer ${customer.id}:`, err)
            results.failed++
            results.logs.push(`Failed customer ${customer.id}: ${err.message}`)
            await logToNotion('ERROR', `Cron error for customer ${customer.id}`, { error: err.message })
        }
    }

    // Log summary to Database
    await supabase.from('automation_logs').insert({
        automation_type: 'monthly_reports',
        status: results.failed > 0 ? 'partial' : 'success',
        records_processed: results.generated,
        records_failed: results.failed,
        error_message: results.failed > 0 ? JSON.stringify(results.logs.filter(l => l.startsWith('Failed'))) : null,
        log_date: new Date().toISOString()
    } as any)

    // Log summary to Notion
    await logToNotion('REPORT_GENERATED', `Monthly Cron Completed: ${results.generated} generated`, results)

    return NextResponse.json(results)
}
