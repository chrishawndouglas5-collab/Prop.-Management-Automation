'use client'

import React, { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { addProperty } from '@/app/dashboard/properties/actions'


export function AddPropertyDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    // We'll use a simple form submission for now, toast implementation later

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)

        // Call server action
        const result = await addProperty(null, formData)

        setLoading(false)
        if (result?.message === 'success') {
            setOpen(false)
            // Toast success
        } else {
            // Toast error
            alert(result?.message || 'Failed to add property')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-brand-DEFAULT hover:bg-brand-DEFAULT/90 text-white shadow-lg shadow-brand-DEFAULT/20">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Property
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-white/10">
                <DialogHeader>
                    <DialogTitle>Add New Property</DialogTitle>
                    <DialogDescription>
                        Enter the details of the property you manage.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="propertyName">Property Name</Label>
                        <Input
                            id="propertyName"
                            name="propertyName"
                            placeholder="e.g. Sunset Apartments"
                            required
                            className="bg-secondary/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address (Optional)</Label>
                        <Input
                            id="address"
                            name="address"
                            placeholder="123 Main St, City, State"
                            className="bg-secondary/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="unitCount">Number of Units</Label>
                        <Input
                            id="unitCount"
                            name="unitCount"
                            type="number"
                            min="1"
                            placeholder="e.g. 10"
                            required
                            className="bg-secondary/50"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="bg-brand-DEFAULT text-white">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                'Add Property'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
