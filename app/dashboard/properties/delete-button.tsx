'use client'

import React, { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteProperty } from './actions'

export function DeletePropertyButton({ propertyId }: { propertyId: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete(e: React.FormEvent) {
        e.preventDefault()

        if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            return
        }

        setIsDeleting(true)
        try {
            await deleteProperty(propertyId)
        } catch (error) {
            console.error('Failed to delete property:', error)
            alert('Failed to delete property. Please try again.')
            setIsDeleting(false)
        }
    }

    return (
        <form onSubmit={handleDelete}>
            <Button
                variant="ghost"
                size="icon"
                type="submit"
                disabled={isDeleting}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
                {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Trash2 className="h-4 w-4" />
                )}
                <span className="sr-only">Delete</span>
            </Button>
        </form>
    )
}
