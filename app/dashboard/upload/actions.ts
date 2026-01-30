'use server'

import { createClient } from '@/lib/supabase/server'
import { parseCSV } from '@/lib/parsing/parsers'
import { revalidatePath } from 'next/cache'
import { findBestMatch } from '@/lib/csv/normalize'

export async function uploadData(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: 'Unauthorized', success: false }

    const file = formData.get('file') as File
    const format = formData.get('format') as 'appfolio' | 'buildium'

    if (!file || !format) {
        return { message: 'File and format are required', success: false }
    }

    // Get customer ID
    // Updated to use maybeSingle() or better error handling for MVP
    const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single() as any

    if (!customer) return { message: 'Customer record not found', success: false }

    try {
        const text = await file.text()
        const transactions = await parseCSV(text, format)

        if (transactions.length === 0) {
            return { message: 'No valid transactions found in file', success: false }
        }

        // Fetch all properties for this customer
        const { data: properties } = await supabase
            .from('properties')
            .select('id, property_name')
            .eq('customer_id', customer.id) as any

        const existingProperties = properties || []

        // Match transactions
        const matchedTransactions: any[] = []
        const unmatchedRows: any[] = []

        for (const t of transactions) {
            // CRITICAL FIX: Ensure property name has a fallback so we NEVER skip a row
            // If the parser couldn't find a property column, we label it "Unknown Property"
            // This forces it into the "Unmatched" flow where the user can manually assign it.
            const propertyHint = t.property_name_hint || 'Unknown Property'

            // Try exact match first
            const exactMatch = existingProperties.find(
                (p: any) => p.property_name.toLowerCase().trim() === propertyHint.toLowerCase().trim()
            )

            if (exactMatch) {
                matchedTransactions.push({
                    customer_id: customer.id,
                    property_id: exactMatch.id,
                    transaction_date: t.transaction_date,
                    category: t.category,
                    description: t.description,
                    amount: t.amount,
                    transaction_type: t.transaction_type,
                })
                continue
            }

            // Try fuzzy match
            const fuzzy = findBestMatch(propertyHint, existingProperties)
            if (fuzzy) {
                unmatchedRows.push({
                    csvPropertyName: propertyHint,
                    transactionData: t,
                    possibleMatches: fuzzy ? [fuzzy.match].map((m: any) => ({ ...m, confidence: fuzzy.confidence })) : []
                })
            } else {
                // No match at all
                unmatchedRows.push({
                    csvPropertyName: propertyHint,
                    transactionData: t,
                    possibleMatches: []
                })
            }
        }

        // Save matched
        if (matchedTransactions.length > 0) {
            const { error } = await supabase
                .from('property_data')
                .insert(matchedTransactions as any)

            if (error) {
                console.error('Insert error:', error)
                return { message: `Failed to save data: ${error.message || JSON.stringify(error)}`, success: false }
            }
        }

        // Return results
        if (unmatchedRows.length > 0) {
            // Group unmatched rows by property name to avoid repetition
            const groupedUnmatched = new Map<string, any>()

            unmatchedRows.forEach(row => {
                if (!groupedUnmatched.has(row.csvPropertyName)) {
                    groupedUnmatched.set(row.csvPropertyName, {
                        csvPropertyName: row.csvPropertyName,
                        transactions: [row.transactionData], // Array of transactions
                        possibleMatches: row.possibleMatches
                    })
                } else {
                    // Add transaction to existing group
                    const existing = groupedUnmatched.get(row.csvPropertyName)
                    existing.transactions.push(row.transactionData)
                }
            })

            // Convert Map to Array
            const uniqueUnmatchedRows = Array.from(groupedUnmatched.values())

            return {
                success: true,
                message: `Imported ${matchedTransactions.length} items. ${uniqueUnmatchedRows.length} properties need review.`,
                unmatched: true,
                unmatchedRows: uniqueUnmatchedRows // Now contains grouped transactions
            }
        }

        // Calculate summary stats for success message
        let minDate = ''
        let maxDate = ''
        let totalIncome = 0
        let totalExpense = 0

        matchedTransactions.forEach((t: any) => {
            if (!minDate || t.transaction_date < minDate) minDate = t.transaction_date
            if (!maxDate || t.transaction_date > maxDate) maxDate = t.transaction_date

            if (t.transaction_type === 'income') totalIncome += Number(t.amount)
            else totalExpense += Number(t.amount)
        })

        revalidatePath('/dashboard')

        return {
            message: `Successfully imported ${matchedTransactions.length} transactions.`,
            success: true,
            summary: {
                totalFiles: matchedTransactions.length,
                dateRange: minDate && maxDate ? `${minDate.split('T')[0]} to ${maxDate.split('T')[0]}` : 'N/A',
                financials: `Income: $${totalIncome.toFixed(2)} | Expenses: $${totalExpense.toFixed(2)}`
            }
        }

        revalidatePath('/dashboard')
        return { message: `Successfully imported ${matchedTransactions.length} transactions`, success: true }

    } catch (error: any) {
        console.error('Processing error:', error)
        return { message: `Error processing file: ${error.message}`, success: false }
    }
}
