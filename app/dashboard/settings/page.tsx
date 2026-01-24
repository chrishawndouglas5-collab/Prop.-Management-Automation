import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { updateCompanyProfile } from './actions'
import { User, CreditCard, Shield } from 'lucide-react'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .single() as any

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Settings
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account and company preferences.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Company Profile Card */}
                <Card className="glass border-white/10 bg-card/30">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-brand-glow" />
                            <CardTitle>Company Profile</CardTitle>
                        </div>
                        <CardDescription>
                            Update your company details and contact information.
                        </CardDescription>
                    </CardHeader>
                    <form action={async (formData) => {
                        'use server'
                        await updateCompanyProfile(formData)
                    }}>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    defaultValue={customer?.company_name}
                                    className="bg-secondary/50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="contactName">Contact Name</Label>
                                    <Input
                                        id="contactName"
                                        name="contactName"
                                        defaultValue={customer?.contact_name || ''}
                                        placeholder="e.g. John Doe"
                                        className="bg-secondary/50"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contactEmail">Contact Email</Label>
                                    <Input
                                        id="contactEmail"
                                        name="contactEmail"
                                        type="email"
                                        defaultValue={customer?.contact_email || user.email}
                                        className="bg-secondary/50"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-white/5 pt-6">
                            <Button type="submit" className="bg-brand-DEFAULT text-white">Save Changes</Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* Subscription / Unit Count Card */}
                <Card className="glass border-white/10 bg-card/30">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-accent-teal" />
                            <CardTitle>Subscription & Billing</CardTitle>
                        </div>
                        <CardDescription>
                            Manage your subscription and unit count.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5">
                            <div>
                                <p className="font-medium">Current Plan: {customer?.billing_type === 'annual' ? 'Annual' : 'Monthly'}</p>
                                <p className="text-sm text-muted-foreground">Status: <span className="capitalize text-white">{customer?.status}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-2xl">{customer?.unit_count}</p>
                                <p className="text-xs text-muted-foreground">Billed Units</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            To update your unit count or change your payment method, please visit the billing portal.
                        </p>
                    </CardContent>
                    <CardFooter className="border-t border-white/5 pt-6">
                        <Button variant="outline" className="border-brand-DEFAULT text-brand-DEFAULT hover:bg-brand-DEFAULT/10">
                            Manage Billing
                        </Button>
                    </CardFooter>
                </Card>

                {/* Security / Danger Zone */}
                <Card className="glass border-destructive/20 bg-destructive/5">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-destructive" />
                            <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        </div>
                        <CardDescription>
                            Permanent actions for your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                    </CardContent>
                    <CardFooter className="border-t border-white/5 pt-6">
                        <Button variant="destructive">Delete Account</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
