'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface UnmatchedRow {
    csvPropertyName: string
    transactions: any[]
    possibleMatches: Array<{ id: string; property_name: string; confidence: number }>
}

export default function ReviewPage() {
    const [unmatchedRows, setUnmatchedRows] = useState<UnmatchedRow[]>([])
    const [mappings, setMappings] = useState<Record<number, string>>({})
    const [invertSigns, setInvertSigns] = useState<Record<number, boolean>>({}) // NEW
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Load unmatched data from sessionStorage (set during upload)
        const unmatchedData = sessionStorage.getItem('unmatchedProperties')
        if (unmatchedData) {
            try {
                setUnmatchedRows(JSON.parse(unmatchedData))
            } catch (e) {
                console.error('Failed to parse unmatched properties', e)
            }
        }
        setLoading(false)
    }, [])

    async function handleSaveWithMappings() {
        setSaving(true)

        try {
            // Get current user to get customer ID
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                alert('Session expired. Please log in again.')
                return
            }

            const { data: customer } = await (supabase.from('customers') as any)
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (!customer) {
                alert('Customer record not found.')
                return
            }

            // Prepare payload
            const payload = unmatchedRows.map((row, index) => {
                const selected = mappings[index]
                return {
                    transactions: row.transactions,
                    propertyId: selected,
                    newPropertyName: selected === 'CREATE_NEW' ? row.csvPropertyName : undefined,
                    invertSign: invertSigns[index] // Pass the inversion flag
                }
            })

            // Call Server Action
            const { saveMappedTransactions } = await import('./actions')
            const result = await saveMappedTransactions(customer.id, payload)

            if (!result.success) {
                alert(`Error: ${result.message}`)
                console.error(result.errors)
                return
            }

            // Success
            sessionStorage.removeItem('unmatchedProperties')
            router.push('/dashboard?upload=success')

        } catch (error: any) {
            console.error('Unexpected error:', error)
            alert('An unexpected error occurred.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-brand-DEFAULT" />
            </div>
        )
    }

    if (unmatchedRows.length === 0) {
        return (
            <div className="container mx-auto py-8 text-center">
                <p className="text-white mb-4">No unmatched properties to review.</p>
                <Button onClick={() => router.push('/dashboard')} className="bg-brand-DEFAULT">
                    Back to Dashboard
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-4 font-outfit bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Review Property Matches</h1>
            <p className="text-muted-foreground mb-8">
                We found {unmatchedRows.length} property groups in your CSV that don't exactly match existing properties.
                Please confirm or correct the matches below.
            </p>

            <div className="space-y-4">
                {unmatchedRows.map((row, index) => (
                    <Card key={index} className="bg-card/30 border-white/10 glass">
                        <CardHeader>
                            <CardTitle className="text-lg text-white flex justify-between items-center">
                                <span>CSV Property: {row.csvPropertyName}</span>
                                <span className="text-xs px-2 py-1 rounded bg-brand-DEFAULT/20 text-brand-DEFAULT border border-brand-DEFAULT/30">
                                    {row.transactions.length} Transactions
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {row.possibleMatches.length > 0 && (
                                    <div>
                                        <p className="text-sm text-zinc-400 mb-2">Possible matches:</p>
                                        <ul className="text-sm list-disc list-inside mb-4 text-zinc-300">
                                            {row.possibleMatches.map((match, i) => (
                                                <li key={i}>
                                                    {match.property_name}
                                                    <span className="text-zinc-500"> (confidence: {(match.confidence * 100).toFixed(0)}%)</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-300">
                                        Select matching property:
                                    </label>
                                    <Select
                                        value={mappings[index] || ''}
                                        onValueChange={(value) => setMappings({ ...mappings, [index]: value })}
                                    >
                                        <SelectTrigger className="bg-zinc-900/50 border-input">
                                            <SelectValue placeholder="-- Select a property --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {row.possibleMatches.map((match) => (
                                                <SelectItem key={match.id} value={match.id}>
                                                    {match.property_name}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="CREATE_NEW">
                                                ✨ Create new property: "{row.csvPropertyName}"
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id={`invert-${index}`}
                                        checked={invertSigns[index] || false}
                                        onChange={(e) => setInvertSigns({ ...invertSigns, [index]: e.target.checked })}
                                        className="h-4 w-4 rounded border-gray-600 bg-zinc-900/50 text-brand-DEFAULT focus:ring-brand-DEFAULT/50"
                                    />
                                    <label htmlFor={`invert-${index}`} className="text-sm text-zinc-400 cursor-pointer select-none">
                                        Inverse Sign (Treat as {
                                            (invertSigns[index]
                                                ? (row.transactions[0]?.transaction_type === 'income' ? 'Income' : 'Expense')
                                                : (row.transactions[0]?.transaction_type === 'income' ? 'Expense' : 'Income')
                                            )
                                        })
                                    </label>
                                </div>
                                <p className="text-xs text-zinc-500 pl-6">
                                    Check this if expenses appear as positive numbers (Income) or vice versa.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8 flex gap-4">
                <Button
                    onClick={handleSaveWithMappings}
                    disabled={saving || Object.keys(mappings).length !== unmatchedRows.length}
                    className="flex-1 bg-brand-DEFAULT hover:bg-brand-glow"
                >
                    {saving ? 'Saving...' : 'Confirm and Save'}
                </Button>
                <Button variant="outline" onClick={() => router.push('/dashboard')} disabled={saving}>
                    Cancel
                </Button>
            </div>

            {Object.keys(mappings).length < unmatchedRows.length && (
                <p className="text-sm text-orange-400 mt-4">
                    Please select a match for all {unmatchedRows.length} properties before saving.
                </p>
            )}
        </div>
    )
}
