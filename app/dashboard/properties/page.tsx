import React from 'react'
import { createClient } from '@/lib/supabase/server'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AddPropertyDialog } from "@/components/dashboard/add-property-dialog"
import { Trash2, Building2 } from 'lucide-react'
import { DeletePropertyButton } from './delete-button'
import { deleteProperty } from './actions'

export default async function PropertiesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch properties
    const { data: customer } = await supabase
        .from('customers')
        .select('*, properties(*)')
        .eq('user_id', user.id)
        .single() as any

    const properties: any[] = customer?.properties || []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Properties
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your property portfolio and unit counts.
                    </p>
                </div>
                <AddPropertyDialog />
            </div>

            <div className="bg-card/50 glass border border-white/10 rounded-xl overflow-hidden shadow-xl">
                {properties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-medium text-foreground mb-2">No properties yet</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                            Add your first property to start generating automated reports.
                        </p>
                        <AddPropertyDialog />
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-white/5 border-b border-white/10">
                            <TableRow className="hover:bg-transparent border-white/10">
                                <TableHead className="text-foreground font-medium">Property Name</TableHead>
                                <TableHead className="text-foreground font-medium">Address</TableHead>
                                <TableHead className="text-foreground font-medium text-right">Units</TableHead>
                                <TableHead className="text-foreground font-medium text-right w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {properties.map((property) => (
                                <TableRow key={property.id} className="hover:bg-white/5 border-white/10 transition-colors">
                                    <TableCell className="font-medium">{property.property_name}</TableCell>
                                    <TableCell className="text-muted-foreground">{property.address || '-'}</TableCell>
                                    <TableCell className="text-right font-medium">{property.unit_count}</TableCell>
                                    <TableCell className="text-right">
                                        <DeletePropertyButton propertyId={property.id} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    )
}
