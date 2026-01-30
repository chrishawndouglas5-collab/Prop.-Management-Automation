'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export function AccountSetupLoader({ userId }: { userId: string }) {
    const router = useRouter()
    const supabase = createClient()
    const [retries, setRetries] = useState(0)

    useEffect(() => {
        const checkCustomer = async () => {
            // Poll for customer record
            const { data } = await supabase
                .from('customers')
                .select('id')
                .eq('user_id', userId)
                .single()

            if (data) {
                // Success! Record exists.
                router.refresh()
            } else {
                // Not found yet. Retry up to 10 times (20 seconds)
                if (retries < 10) {
                    setTimeout(() => setRetries(r => r + 1), 2000)
                }
            }
        }

        checkCustomer()
    }, [userId, retries, router, supabase])

    if (retries >= 10) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background text-center p-4">
                <h2 className="text-xl font-bold text-destructive mb-2">Setup Issue</h2>
                <p className="text-muted-foreground mb-4">We created your login, but your workspace is taking too long to initialize.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
                >
                    Try Refreshing
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] rounded-full bg-brand-glow/20 blur-[100px] animate-pulse" />
            </div>

            <div className="z-10 text-center space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-accent-teal/20 blur-xl rounded-full" />
                    <Loader2 className="h-12 w-12 text-accent-teal animate-spin relative z-10 mx-auto" />
                </div>

                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    Setting up your workspace...
                </h1>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    We're initializing your secure database and storage. This usually takes about 5 seconds.
                </p>

                <div className="flex items-center justify-center gap-2 text-xs text-white/20 mt-8">
                    <span>Secure Connection</span>
                    <div className="h-1 w-1 rounded-full bg-green-500" />
                    <span>Encrypted</span>
                </div>
            </div>
        </div>
    )
}
