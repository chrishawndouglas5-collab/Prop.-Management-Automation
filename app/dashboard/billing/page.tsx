'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { openCheckout, openCustomerPortal } from '@/lib/paddle/checkout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createCustomerProfile } from './actions'

export default function BillingPage() {
    const [customer, setCustomer] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        loadCustomer()
    }, [])

    async function loadCustomer() {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data } = await supabase
                .from('customers')
                .select('*')
                .eq('user_id', user.id)
                .single()

            setCustomer(data)
        }
        setLoading(false)
    }

    function calculateMonthlyCost(units: number): number {
        if (units <= 100) return units * 3.00
        if (units <= 300) return (100 * 3.00) + ((units - 100) * 2.50)
        if (units <= 500) return (100 * 3.00) + (200 * 2.50) + ((units - 300) * 2.00)
        return (100 * 3.00) + (200 * 2.50) + (200 * 2.00) + ((units - 500) * 1.50)
    }

    const [processing, setProcessing] = useState(false)

    async function handleSubscribe() {
        if (!customer) return
        setProcessing(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            await openCheckout({
                unitCount: customer.unit_count,
                customerId: customer.id,
                email: user?.email || '',
            })
        } catch (error) {
            console.error('Failed to open checkout:', error)
            alert('Failed to load checkout system. Please disable ad-blockers and try again.')
        } finally {
            setProcessing(false)
        }
    }

    async function handleManageBilling() {
        if (customer?.paddle_customer_id) {
            await openCustomerPortal(customer.paddle_customer_id)
        }
    }

    if (loading) return <div>Loading...</div>

    if (!customer) return (
        <div className="container mx-auto py-8 max-w-4xl text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Setup Required</h1>
            <p className="text-gray-400 mb-8">Your account needs a profile to be set up before you can manage billing.</p>
            <form action={async () => {
                await createCustomerProfile()
                loadCustomer()
            }}>
                <Button type="submit" className="bg-brand-DEFAULT hover:bg-brand-glow">
                    Create Profile & Continue
                </Button>
            </form>
        </div>
    )

    const monthlyCost = calculateMonthlyCost(customer.unit_count)

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-white">Billing</h1>

            <Card className="mb-6 bg-card/50 backdrop-blur-md border-white/10">
                <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Your subscription details</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Unit Count Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-300">Managed Units</label>
                                <span className="font-bold text-2xl text-white">{customer.unit_count}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                step="10"
                                value={customer.unit_count}
                                onChange={async (e) => {
                                    // Optimistic update for UI responsiveness
                                    const newVal = parseInt(e.target.value)
                                    setCustomer((prev: any) => ({ ...prev, unit_count: newVal }))
                                }}
                                onMouseUp={async (e) => {
                                    const target = e.target as HTMLInputElement
                                    const { updateUnitCount } = await import('./actions')
                                    await updateUnitCount(parseInt(target.value))
                                }}
                                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-brand-DEFAULT"
                            />
                            <p className="text-xs text-muted-foreground">
                                Adjust slider to match your portfolio size. Pricing updates automatically.
                            </p>
                        </div>

                        <div className="h-px bg-white/10" />

                        <div className="flex justify-between">
                            <span className="text-gray-400">Monthly Cost:</span>
                            <span className="font-semibold text-white text-xl">${monthlyCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className={`font-semibold capitalize ${customer.status === 'active' ? 'text-green-500' : 'text-red-500'
                                }`}>
                                {customer.status}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        {customer.status === 'active' ? (
                            <Button onClick={handleManageBilling} className="w-full bg-brand-DEFAULT hover:bg-brand-glow">
                                Manage Billing
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubscribe}
                                disabled={processing}
                                className="w-full bg-brand-DEFAULT hover:bg-brand-glow disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Loading...' : 'Subscribe Now'}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Pricing Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm text-zinc-400">
                        <div className="flex justify-between py-2 border-b border-zinc-700">
                            <span>1-100 units</span>
                            <span>$3.00/unit</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-zinc-700">
                            <span>101-300 units</span>
                            <span>$2.50/unit</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-zinc-700">
                            <span>301-500 units</span>
                            <span>$2.00/unit</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>501+ units</span>
                            <span>$1.50/unit</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}
