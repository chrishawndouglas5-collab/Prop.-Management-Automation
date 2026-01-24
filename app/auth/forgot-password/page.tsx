'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email') as string

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
            })

            if (error) {
                throw error
            }

            setSuccess(true)
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
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-glow/10 blur-[100px]" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-accent-purple/10 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                    <div className="mb-6">
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-DEFAULT to-accent-purple bg-clip-text text-transparent mb-2">
                            Reset Password
                        </h1>
                        <p className="text-muted-foreground">
                            Enter your email to receive a password reset link
                        </p>
                    </div>

                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="bg-green-500/10 text-green-500 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                                <Mail className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">Check your email</h3>
                            <p className="text-muted-foreground text-sm">
                                We've sent a password reset link to your email address. Please check your inbox and spam folder.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full mt-4"
                                onClick={() => setSuccess(false)}
                            >
                                Send another link
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    required
                                    className="bg-background/50 border-input focus:ring-brand-DEFAULT"
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-brand-DEFAULT to-brand-glow hover:opacity-90 transition-opacity"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Link...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
