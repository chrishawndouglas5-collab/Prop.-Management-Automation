import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generatePropertyReport } from '@/lib/reports/generator'
import { sendReportEmail } from '@/lib/email/sender'

const BATCH_SIZE = 10 // Process 10 customers per run to avoid timeout

export async function GET(request: NextRequest) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 })
    }

    const supabase = await createClient()

    // Get current month/year
    const now = new Date()
    const currentMonth = now.getMonth() + 1 // 1-12
    const currentYear = now.getFullYear()

    // Find customers who haven't been processed this month yet
    const { data: customers, error } = await supabase
        .from('customers')
        .select('*, properties(*)')
        .eq('status', 'active')
        .or(`last_report_generated_month.is.null,last_report_generated_month.neq.${currentMonth}`)
        .limit(BATCH_SIZE)
        .returns<any>()

    if (error) {
        console.error('Error fetching customers:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!customers || customers.length === 0) {
        return NextResponse.json({
            message: 'All customers processed for this month',
            processed: 0
        })
    }

    const results = []

    for (const customer of customers) {
        try {
            // Check if customer has properties
            if (!customer.properties || customer.properties.length === 0) {
                results.push({
                    customer: customer.company_name,
                    status: 'skipped',
                    reason: 'no_properties'
                })
                continue
            }

            // Process each property
            for (const property of customer.properties) {
                try {
                    // Check if there's data for last month
                    const lastMonth = new Date(currentYear, currentMonth - 2, 1) // Previous month
                    // Note: generatePropertyReport performs the data check internally and throws if no data.
                    // But to avoid "failed" status logs for just empty data, we can do a quick check here 
                    // or just let it fail/catch. 
                    // Best practice: Let the specialized function handle it.
                    // However, we want to skip efficiently. The `hasData` check is cheap.
                    const { data: hasData } = await supabase
                        .from('property_data')
                        .select('id')
                        .eq('property_id', property.id)
                        .gte('transaction_date', lastMonth.toISOString().split('T')[0])
                        .limit(1)

                    if (!hasData || hasData.length === 0) {
                        results.push({
                            customer: customer.company_name,
                            property: property.property_name,
                            status: 'skipped',
                            reason: 'no_data'
                        })
                        continue
                    }

                    // Report Period logic should match what we pass to generatePropertyReport
                    const reportMonth = currentMonth - 1
                    const reportYear = currentMonth === 1 ? currentYear - 1 : currentYear

                    // USE CENTRALIZED GENERATOR
                    // This handles fetching txns, bucketing, rendering PDF, uploading, and DB insert.
                    // USE CENTRALIZED GENERATOR
                    // Returns { url, buffer }
                    // Returns { url, buffer }
                    const { url, buffer } = await generatePropertyReport({
                        customerId: customer.id,
                        propertyId: property.id,
                        month: reportMonth,
                        year: reportYear,
                        customerDetails: {
                            company_name: customer.company_name,
                            logo_url: customer.logo_url
                        }
                    })

                    // Send email
                    await sendReportEmail(
                        customer.contact_email || '',
                        `Monthly Statement: ${property.property_name}`,
                        `<p>Here is your automated monthly statement for ${reportMonth}/${reportYear}.</p>`,
                        buffer, // Node buffer
                        `Statement_${reportYear}_${reportMonth}.pdf`
                    )

                    results.push({
                        customer: customer.company_name,
                        property: property.property_name,
                        status: 'success'
                    })
                } catch (propertyError: any) {
                    // Don't log as error if it's just "No transaction data"
                    if (propertyError.message === 'No transaction data found for this period') {
                        results.push({
                            customer: customer.company_name,
                            property: property.property_name,
                            status: 'skipped',
                            reason: 'no_data_in_period'
                        })
                        continue;
                    }

                    console.error(`Error processing property ${property.id}:`, propertyError)
                    results.push({
                        customer: customer.company_name,
                        property: property.property_name,
                        status: 'failed',
                        error: propertyError instanceof Error ? propertyError.message : 'Unknown error'
                    })
                }
            }

            // Mark customer as processed for this month
            await (supabase.from('customers') as any)
                .update({
                    last_report_generated_month: currentMonth,
                    last_report_generated_year: currentYear,
                })
                .eq('id', customer.id)

            results.push({
                customer: customer.company_name,
                status: 'completed'
            })
        } catch (customerError) {
            console.error(`Error processing customer ${customer.id}:`, customerError)
            results.push({
                customer: customer.company_name,
                status: 'failed',
                error: customerError instanceof Error ? customerError.message : 'Unknown error'
            })
        }
    }

    return NextResponse.json({
        processed: customers.length,
        hasMore: customers.length === BATCH_SIZE,
        results,
        nextRun: customers.length === BATCH_SIZE
            ? 'Run again in 10 minutes to process next batch'
            : 'All customers processed for this month'
    })
}
