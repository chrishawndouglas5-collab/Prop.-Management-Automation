'use server'

import { createClient } from '@supabase/supabase-js' // Use direct client for Admin
import { createClient as createServerClient } from '@/lib/supabase/server' // For Auth check
import { revalidatePath } from 'next/cache'


export async function saveMappedTransactions(
    customerId: string,
    items: Array<{
        transactions: any[], // Updated to array
        propertyId: string,
        newPropertyName?: string,
        invertSign?: boolean // OPTIONAL: Flip income/expense
    }>
) {
    // ... auth checks ...
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: 'Unauthorized' }

    // Use the SAME authenticated client for database operations
    // This will now respect the RLS policies we added
    const adminSupabase = supabase

    // ... verify customer ...

    // Loop Items (Groups)
    let processedCount = 0
    let errors: any[] = []

    for (const item of items) {
        try {
            let targetPropertyId = item.propertyId

            // Handle New Property (Same logic)
            if (item.propertyId === 'CREATE_NEW' && item.newPropertyName) {
                // Check existing
                const { data: existing } = await adminSupabase.from('properties').select('id')
                    .eq('customer_id', customerId).eq('property_name', item.newPropertyName).single()

                if (existing) targetPropertyId = existing.id
                else {
                    const { data: newProp, error: createError } = await adminSupabase.from('properties')
                        .insert({ customer_id: customerId, property_name: item.newPropertyName, unit_count: 1 })
                        .select('id').single()
                    if (createError) throw new Error(createError.message)
                    targetPropertyId = newProp.id
                }
            }

            // Batch Insert Transactions
            // Prepare all rows for this specific property match
            const rowsToInsert = item.transactions.map(t => {
                let amount = typeof t.amount === 'string'
                    ? parseFloat(t.amount.replace(/[^0-9.-]+/g, ""))
                    : t.amount

                let type = t.transaction_type

                // HANDLE INVERSION
                if (item.invertSign) {
                    amount = amount * -1
                    type = type === 'income' ? 'expense' : 'income'
                }

                return {
                    customer_id: customerId,
                    property_id: targetPropertyId,
                    transaction_date: t.transaction_date,
                    category: t.category,
                    description: t.description,
                    amount: amount,
                    transaction_type: type
                }
            })

            // Perform bulk insert for this group
            const { error: insertError } = await adminSupabase
                .from('property_data')
                .insert(rowsToInsert)

            if (insertError) throw new Error(insertError.message)
            processedCount += rowsToInsert.length

        } catch (err: any) {
            console.error('Save Mapping Error:', err)
            errors.push(err.message)
        }
    }


    revalidatePath('/dashboard')

    if (errors.length > 0) {
        // Return the first few errors to help user debug
        return {
            success: false,
            message: `Saved ${processedCount} items, but ${errors.length} failed. First error: ${errors[0]}`,
            errors
        }
    }

    return { success: true, message: 'All transactions saved successfully.' }
}
