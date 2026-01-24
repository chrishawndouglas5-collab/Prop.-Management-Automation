'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Building2,
    FileText,
    CreditCard,
    Settings,
    LifeBuoy,
    LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Properties', href: '/dashboard/properties', icon: Building2 },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.push('/auth/login')
        router.refresh()
    }

    return (
        <div className="flex h-full w-[280px] flex-col border-r border-sidebar-border bg-sidebar/50 backdrop-blur-xl transition-all duration-300">
            <div className="flex h-16 items-center border-b border-sidebar-border px-6">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-DEFAULT to-accent-purple" />
                    <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        PropAuto
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4">
                <nav className="flex flex-col gap-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-brand-DEFAULT/10 text-brand-glow shadow-[0_0_20px_rgba(79,70,229,0.1)] border border-brand-DEFAULT/20"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", isActive ? "text-brand-DEFAULT" : "text-muted-foreground")} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="border-t border-sidebar-border p-4">
                <nav className="flex flex-col gap-2 mb-4">
                    <Link
                        href="/help"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all"
                    >
                        <LifeBuoy className="h-4 w-4" />
                        Support
                    </Link>
                </nav>

                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
