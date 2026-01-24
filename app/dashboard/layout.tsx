import React from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // Verify auth again (middleware does this, but good to have user data)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Fetch customer details for header
    const { data: customer } = await supabase
        .from('customers')
        .select('company_name, contact_email')
        .eq('user_id', user.id)
        .returns<{ company_name: string; contact_email: string }>()
        .single() as any

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 transition-all">
                <Header
                    userEmail={user.email}
                    companyName={customer?.company_name}
                />
                <main className="flex-1 overflow-y-auto p-8 relative">
                    {/* Ambient background glow for main content */}
                    <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-DEFAULT/5 to-transparent pointer-events-none -z-10" />

                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
