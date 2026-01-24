'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateCompanyProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { message: 'Unauthorized' }

    const companyName = formData.get('companyName') as string
    const contactName = formData.get('contactName') as string
    const contactEmail = formData.get('contactEmail') as string

    if (!companyName) return { message: 'Company name is required' }

    const { error } = await (supabase
        .from('customers') as any)
        .update({
            company_name: companyName,
            contact_name: contactName,
            contact_email: contactEmail,
        })
        .eq('user_id', user.id)

    if (error) {
        console.error('Failed to update profile:', error)
        return { message: 'Failed to update profile' }
    }

    revalidatePath('/dashboard/settings')
    return { message: 'success' }
}

export async function updateBillingSettings(formData: FormData) {
    // This will link to Paddle later
    // For now, it might just be updating unit count manually or verifying it

    return { message: 'Billing updates managed via Paddle' }
}
