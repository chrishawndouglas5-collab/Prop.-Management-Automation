'use client'

import React, { useState } from 'react'
import { FileText, Download, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { triggerReportGeneration } from './actions'

// Define local type matching server response
type ReportResult = {
    propertyId: string
    propertyName: string
    status: 'success' | 'failed' | 'skipped'
    message?: string
}

type GenerationResponse = {
    success: boolean
    message: string
    results?: ReportResult[]
}

export default function ReportsPage() {
    const [month, setMonth] = useState<string>(String(new Date().getMonth() + 1))
    const [year, setYear] = useState<string>(String(new Date().getFullYear()))
    const [generating, setGenerating] = useState(false)

    // Use GenerationResponse type directly
    const [result, setResult] = useState<GenerationResponse | null>(null)

    async function handleGenerate() {
        setGenerating(true)
        setResult(null)
        const formData = new FormData()
        formData.append('month', month)
        formData.append('year', year)

        try {
            const res = await triggerReportGeneration(null, formData)
            setResult(res)
        } catch (e: any) {
            setResult({ success: false, message: 'Client Error: ' + e.message })
        }
        setGenerating(false)
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Reports
                </h1>
                <p className="text-muted-foreground mt-1">
                    Generate, view, and email monthly owner statements.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Generator Card */}
                <Card className="glass border-white/10 bg-card/30">
                    <CardHeader>
                        <CardTitle>Generate New Reports</CardTitle>
                        <CardDescription>
                            Create PDF statements for all properties for a specific month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <div className="space-y-2 flex-1">
                                <Select value={month} onValueChange={setMonth}>
                                    <SelectTrigger className="bg-secondary/50">
                                        <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                            <SelectItem key={m} value={String(m)}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 flex-1">
                                <Select value={year} onValueChange={setYear}>
                                    <SelectTrigger className="bg-secondary/50">
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2024">2024</SelectItem>
                                        <SelectItem value="2025">2025</SelectItem>
                                        <SelectItem value="2026">2026</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {result && (
                            <div className="space-y-3">
                                <div className={`p-4 rounded-lg flex items-start gap-3 ${result.success ? 'bg-accent-teal/10 text-accent-teal' : 'bg-destructive/10 text-destructive'}`}>
                                    {result.success ? <CheckCircle className="h-5 w-5 shrink-0" /> : <Loader2 className="h-5 w-5 shrink-0" />}
                                    <div>
                                        <p className="font-medium text-sm">{result.message}</p>
                                    </div>
                                </div>

                                {/* Detailed Breakdown */}
                                {result.results && result.results.length > 0 && (
                                    <div className="bg-black/20 rounded-lg p-3 space-y-2 border border-white/5 max-h-48 overflow-y-auto">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Details</p>
                                        {result.results.map((r: any) => (
                                            <div key={r.propertyId} className="flex items-center justify-between text-sm">
                                                <span className="text-white/80 truncate max-w-[150px]">{r.propertyName}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs ${r.status === 'success' ? 'text-accent-teal' :
                                                            r.status === 'skipped' ? 'text-yellow-500' : 'text-red-400'
                                                        }`}>
                                                        {r.message}
                                                    </span>
                                                    {r.status === 'success' && <CheckCircle className="h-3 w-3 text-accent-teal" />}
                                                    {r.status === 'failed' && <AlertCircle className="h-3 w-3 text-red-400" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <Button
                            onClick={handleGenerate}
                            className="w-full bg-brand-DEFAULT text-white"
                            disabled={generating}
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating & Sending...
                                </>
                            ) : (
                                'Generate & Email Reports'
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="glass border-white/5 bg-brand-DEFAULT/5">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Send className="h-5 w-5 text-brand-glow" />
                            <CardTitle>Metric Automation</CardTitle>
                        </div>
                        <CardDescription>
                            How reporting works
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>1. System aggregates transaction data from "Data Processing".</p>
                        <p>2. Calculates Net Operating Income (Income - Expenses).</p>
                        <p>3. Generates a branded PDF for each property.</p>
                        <p>4. Automatically emails the PDF to your configured contact address.</p>
                    </CardContent>
                </Card>
            </div>

            {/* Basic List of Recent Reports (Placeholder - would fetch from DB real-time) */}
            <Card className="glass border-white/10 bg-card/30">
                <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Check the dashboard overview or notification email for your generated reports.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
