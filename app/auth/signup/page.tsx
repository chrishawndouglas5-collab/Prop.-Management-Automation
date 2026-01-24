'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Loader2, CheckCircle } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const companyName = formData.get('companyName') as string

        try {
            // 1. Sign up user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        company_name: companyName,
                    },
                },
            })

            if (authError) throw authError
            if (!authData.user) throw new Error('Signup failed')

            // 2. Create customer record
            // Note: In production, this is safer in a Trigger, but we'll do client-side insert for MVP speed related to RLS policies
            // We rely on RLS to ensure they can only access their own record.
            const { error: dbError } = await supabase
                .from('customers')
                .insert({
                    user_id: authData.user.id,
                    company_name: companyName,
                    contact_email: email,
                    status: 'trialing',
                    unit_count: 0
                } as any)

            if (dbError) {
                console.error('Customer creation failed:', dbError)
                // If DB insert fails, we might want to alert support or handle cleanup
                // For now, proceed as auth was successful
            }

            router.push('/dashboard')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Ambient background effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-accent-teal/10 blur-[100px]" />
                <div className="absolute -bottom-[20%] left-[10%] w-[50%] h-[50%] rounded-full bg-brand-glow/10 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-teal to-brand-DEFAULT bg-clip-text text-transparent mb-2">
                            Start Automating
                        </h1>
                        <p className="text-muted-foreground">
                            Create your account in seconds. No credit card required.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                                id="companyName"
                                name="companyName"
                                type="text"
                                placeholder="Acme Properties"
                                required
                                className="bg-background/50 border-input focus:ring-accent-teal"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Work Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                className="bg-background/50 border-input focus:ring-accent-teal"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="bg-background/50 border-input focus:ring-accent-teal"
                            />
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-accent-teal" />
                                <span>30-day free trial</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-accent-teal" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-accent-teal to-brand-DEFAULT hover:opacity-90 transition-opacity text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-brand-DEFAULT hover:underline font-medium">
                            Sign In
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
