'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCustomerProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    // Check if customer already exists
    const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (existing) return

    // Create new customer profile
    const { error } = await supabase
        .from('customers')
        .insert({
            user_id: user.id,
            email: user.email,
            status: 'trialing',
            company_name: 'My Company', // Default name
            unit_count: 0
        } as any)

    if (error) throw error

    revalidatePath('/dashboard/billing')
}

export async function updateUnitCount(unitCount: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('customers')
        .update({ unit_count: unitCount } as any) // Keeping row cast if types are partial, but removing client cast
        .eq('user_id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/billing')
}
