'use server'

import { createClient } from '@/lib/supabase/server'
import { parseCSV } from '@/lib/parsing/parsers'
import { revalidatePath } from 'next/cache'

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

        // Process transactions
        // For MVP, we need to map property names to property IDs
        // We'll fetch all properties for this customer first
        const { data: properties } = await supabase
            .from('properties')
            .select('id, property_name')
            .eq('customer_id', customer.id) as any

        const propertyMap = new Map(properties?.map((p: any) => [p.property_name.toLowerCase(), p.id]) || [])

        const dbRecords = transactions.map(t => {
            // Simple matching strategy: exact match (case insensitive)
            // If no match found, it might be assigned to a "General" property or skipped, 
            // or we just don't set property_id (allowed nullable in schema)
            const propId = t.property_name_hint ? propertyMap.get(t.property_name_hint.toLowerCase()) : null

            return {
                customer_id: customer.id,
                property_id: propId,
                transaction_date: t.transaction_date,
                category: t.category,
                description: t.description,
                amount: t.amount,
                transaction_type: t.transaction_type,
                // upload_batch_id: generate UUID? (Optional for MVP)
            }
        })

        const { error } = await supabase
            .from('property_data')
            .insert(dbRecords as any)

        if (error) {
            console.error('Insert error:', error)
            return { message: 'Failed to save data to database', success: false }
        }

        revalidatePath('/dashboard')
        return { message: `Successfully imported ${dbRecords.length} transactions`, success: true }

    } catch (error: any) {
        console.error('Processing error:', error)
        return { message: `Error processing file: ${error.message}`, success: false }
    }
}
