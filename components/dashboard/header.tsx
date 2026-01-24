'use client'

import React from 'react'
import { Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Props would typically include user info passed from server component
interface HeaderProps {
    userEmail?: string | null
    companyName?: string | null
}

export function Header({ userEmail, companyName }: HeaderProps) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-sidebar-border bg-background/50 backdrop-blur-md px-6 z-10 sticky top-0">
            <div className="flex items-center gap-4 w-1/3">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search properties, reports..."
                        className="w-full bg-secondary/50 border-transparent focus:bg-background focus:border-brand-DEFAULT pl-9 h-9 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent-teal shadow-[0_0_8px_#2DD4BF]" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden border border-white/10 hover:border-brand-DEFAULT/50 transition-colors">
                            <div className="h-full w-full bg-gradient-to-tr from-brand-DEFAULT to-accent-purple" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-foreground">{companyName || 'My Company'}</p>
                                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
