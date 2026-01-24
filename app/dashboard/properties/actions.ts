'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addProperty(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { message: 'Unauthorized' }
    }

    // Get customer ID
    const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single() as any

    if (!customer) {
        return { message: 'Customer not found' }
    }

    const propertyName = formData.get('propertyName') as string
    const address = formData.get('address') as string
    const unitCount = parseInt(formData.get('unitCount') as string)

    if (!propertyName || !unitCount) {
        return { message: 'Property name and unit count are required' }
    }

    const { error } = await supabase.from('properties').insert({
        customer_id: customer.id,
        property_name: propertyName,
        address: address,
        unit_count: unitCount
    } as any)

    if (error) {
        console.error('Failed to add property:', error)
        return { message: 'Failed to add property' }
    }

    // Update customer unit count as well (trigger logic usually, but manual here for MVP safely)
    // Or rely on a separate sync. For now, let's just revalidate.
    // Ideally, total units should be a sum query or updated via trigger.
    // We'll leave the total unit count sync for a "recalculate" step or database trigger later.

    revalidatePath('/dashboard/properties')
    revalidatePath('/dashboard') // Update MRR on dashboard
    return { message: 'success' }
}

export async function deleteProperty(propertyId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)

    if (error) {
        console.error('Failed to delete property:', error)
        throw new Error('Failed to delete property')
    }

    revalidatePath('/dashboard/properties')
    revalidatePath('/dashboard')
}
