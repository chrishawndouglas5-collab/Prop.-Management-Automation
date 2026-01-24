import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
    Building2,
    FileText,
    TrendingUp,
    Users,
    Plus,
    ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch customer data with properties
    const { data: customer } = await supabase
        .from('customers')
        .select('*, properties(*)')
        .eq('user_id', user.id)
        .single() as any

    const properties: any[] = customer?.properties || []
    const propertyCount = properties.length
    const totalUnits = properties.reduce((sum, p) => sum + p.unit_count, 0)
    const estimatedMrr = totalUnits * (customer?.price_per_unit || 3.00)

    // Fetch recent reports (mock for now if empty)
    const { data: reports } = await supabase
        .from('reports')
        .select('*')
        .eq('customer_id', customer?.id)
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of your property automation status.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="glass border-white/10 hover:bg-white/5">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Property
                    </Button>
                    <Button className="bg-brand-DEFAULT hover:bg-brand-DEFAULT/90 text-white shadow-lg shadow-brand-DEFAULT/20">
                        Upload Data
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass border-white/5 bg-card/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Revenue (MRR)
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-accent-teal" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            ${estimatedMrr.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Estimated based on unit count
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5 bg-card/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Properties
                        </CardTitle>
                        <Building2 className="h-4 w-4 text-brand-glow" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {propertyCount}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {totalUnits} total units managed
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5 bg-card/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Reports Generated
                        </CardTitle>
                        <FileText className="h-4 w-4 text-accent-purple" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {reports?.length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5 bg-card/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Subscription Status
                        </CardTitle>
                        <Users className="h-4 w-4 text-accent-rose" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground capitalize">
                            {customer?.status || 'Trialing'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {customer?.billing_type === 'annual' ? 'Annual plan' : 'Monthly plan'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity / Content */}
            <div className="grid gap-8 md:grid-cols-2">
                <Card className="glass border-white/5 bg-card/20">
                    <CardHeader>
                        <CardTitle>Recent Properties</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {properties.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-white/10 rounded-lg bg-black/20">
                                <Building2 className="h-10 w-10 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium text-foreground">No properties yet</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Add your first property to start generating reports.
                                </p>
                                <Link href="/dashboard/properties">
                                    <Button variant="secondary" size="sm">Add Property</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {properties.slice(0, 5).map((property) => (
                                    <div key={property.id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium text-foreground">{property.property_name}</p>
                                            <p className="text-sm text-muted-foreground">{property.address || 'No address'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-foreground">{property.unit_count} Units</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="glass border-white/5 bg-card/20">
                    <CardHeader>
                        <CardTitle>Recent Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(!reports || reports.length === 0) ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-white/10 rounded-lg bg-black/20">
                                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium text-foreground">No reports generated</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Upload your data to generate your first batch of reports.
                                </p>
                                <Link href="/dashboard/upload">
                                    <Button variant="secondary" size="sm">Upload Data</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Reports list would go here */}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
