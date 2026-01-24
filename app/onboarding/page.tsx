'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Upload, Building2, ArrowRight } from 'lucide-react'

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient background effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-brand-glow/10 blur-[120px]" />
            </div>

            <nav className="absolute top-6 left-6 z-10">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-DEFAULT to-accent-purple" />
                    <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        PropAuto
                    </span>
                </div>
            </nav>

            <div className="w-full max-w-3xl z-10">
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            Welcome to the future of property management.
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            We're glad you're here. Let's get your workspace set up so you can start automating your reports immediately.
                        </p>
                        <Button
                            size="lg"
                            className="bg-brand-DEFAULT text-white px-8 h-12 text-lg shadow-[0_0_30px_rgba(79,70,229,0.3)]"
                            onClick={() => setStep(2)}
                        >
                            Get Started <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold">How do you want to start?</h2>
                            <p className="text-muted-foreground mt-2">Choose the best path for your data.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card
                                className="glass border-white/10 hover:border-brand-DEFAULT/50 transition-all cursor-pointer group bg-card/40"
                                onClick={() => router.push('/dashboard/upload')}
                            >
                                <CardContent className="p-8 flex flex-col items-center text-center h-full justify-center space-y-6">
                                    <div className="h-16 w-16 rounded-full bg-accent-teal/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Upload className="h-8 w-8 text-accent-teal" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Upload Reports</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Import CSV files from AppFolio or Buildium. We'll automatically create properties and transactions for you.
                                        </p>
                                    </div>
                                    <Button variant="outline" className="w-full">Select Upload</Button>
                                </CardContent>
                            </Card>

                            <Card
                                className="glass border-white/10 hover:border-brand-DEFAULT/50 transition-all cursor-pointer group bg-card/40"
                                onClick={() => router.push('/dashboard/properties')}
                            >
                                <CardContent className="p-8 flex flex-col items-center text-center h-full justify-center space-y-6">
                                    <div className="h-16 w-16 rounded-full bg-brand-glow/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Building2 className="h-8 w-8 text-brand-glow" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Add Manually</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Add your properties one by one. Best if you are just testing with a single unit.
                                        </p>
                                    </div>
                                    <Button variant="outline" className="w-full">Add Property</Button>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="text-center">
                            <Button
                                variant="ghost"
                                className="text-muted-foreground hover:text-white"
                                onClick={() => router.push('/dashboard')}
                            >
                                Skip for now, go to dashboard
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
