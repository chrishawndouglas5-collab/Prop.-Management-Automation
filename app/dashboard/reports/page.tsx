'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Eye, FileText, Calendar } from 'lucide-react'

interface Property {
    id: string
    property_name: string
    unit_count: number
}

interface Report {
    id: string
    property_id: string
    property_name: string
    report_month: number
    report_year: number
    pdf_url: string
    generated_at: string
    status: string
}

export default function ReportsPage() {
    const [properties, setProperties] = useState<Property[]>([])
    const [reports, setReports] = useState<Report[]>([])
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
    const [generating, setGenerating] = useState(false)
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        setLoading(true)

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            setLoading(false)
            return
        }

        // Get customer
        const { data: customer } = await supabase
            .from('customers')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (!customer) {
            setLoading(false)
            return
        }

        // Load properties
        const { data: propertiesData } = await supabase
            .from('properties')
            .select('id, property_name, unit_count')
            .eq('customer_id', customer.id)
            .order('property_name')

        setProperties(propertiesData || [])

        console.log('Load Data: Customer ID:', customer.id)

        // Load existing reports
        const { data: reportsData, error: reportsError } = await supabase
            .from('reports')
            .select('id, property_id, report_month, report_year, pdf_url, generated_at, status')
            .eq('customer_id', customer.id)
            .order('generated_at', { ascending: false }) as any

        if (reportsError) {
            console.error('Error loading reports:', reportsError)
        } else {
            console.log('Loaded Reports:', reportsData)
        }

        // Join with property names
        const reportsWithNames = reportsData?.map((report) => {
            const property = propertiesData?.find((p) => p.id === report.property_id)
            return {
                ...report,
                property_name: property?.property_name || 'Unknown Property',
            }
        })

        console.log('State Reports:', reportsWithNames)
        setReports(reportsWithNames || [])

        // Auto-detect month with data
        await detectDataMonth(customer.id)

        setLoading(false)
    }

    async function detectDataMonth(customerId: string) {
        const { data: recentTransaction } = await supabase
            .from('property_data')
            .select('transaction_date')
            .eq('customer_id', customerId)
            .order('transaction_date', { ascending: false })
            .limit(1)
            .single() as any

        if (recentTransaction) {
            const date = new Date(recentTransaction.transaction_date)
            setSelectedMonth(date.getMonth() + 1)
            setSelectedYear(date.getFullYear())
        }
    }

    async function generateReports() {
        setGenerating(true)
        setResults([])

        const resultsArray: any[] = []

        for (const property of properties) {
            try {
                // Updated to use Server Action in actions.ts logic if API route doesn't exist
                // But instructions imply using an API route or refactoring existing action.
                // Wait, current implementation uses 'actions.ts'. 
                // Instructions provided 'fetch(/api/reports/generate)' which suggests checking if that route exists
                // OR fixing this code to use the existing server action.
                // Let's stick to the INSTRUCTIONS exactly first.

                const response = await fetch('/api/reports/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        propertyId: property.id,
                        month: selectedMonth,
                        year: selectedYear,
                    }),
                })

                const data = await response.json()

                if (response.ok) {
                    resultsArray.push({
                        property: property.property_name,
                        status: 'success',
                        url: data.url,
                    })
                } else {
                    resultsArray.push({
                        property: property.property_name,
                        status: 'error',
                        error: data.error,
                    })
                }
            } catch (error) {
                resultsArray.push({
                    property: property.property_name,
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Unknown error',
                })
            }
        }

        setResults(resultsArray)
        setGenerating(false)

        console.log('Generation Complete. Reloading data...')
        // Reload reports list to show newly generated reports
        await loadData()
    }

    function getMonthName(month: number): string {
        return new Date(2024, month - 1).toLocaleString('default', { month: 'long' })
    }

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">Loading...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8">Owner Reports</h1>

            {/* Generate Reports Section */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Generate New Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium mb-2">Month</label>
                            <Select
                                value={String(selectedMonth)}
                                onValueChange={(v) => setSelectedMonth(Number(v))}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                        <SelectItem key={month} value={String(month)}>
                                            {getMonthName(month)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Year</label>
                            <Select
                                value={String(selectedYear)}
                                onValueChange={(v) => setSelectedYear(Number(v))}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i).map(
                                        (year) => (
                                            <SelectItem key={year} value={String(year)}>
                                                {year}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={generateReports}
                            disabled={generating || properties.length === 0}
                            className="ml-auto"
                        >
                            {generating
                                ? 'Generating...'
                                : `Generate Reports (${properties.length} properties)`}
                        </Button>
                    </div>

                    {/* Generation Results */}
                    {results.length > 0 && (
                        <div className="mt-6 space-y-2">
                            <div className="text-sm font-medium">
                                Generation Results:{' '}
                                <span className="text-green-600">
                                    {results.filter((r) => r.status === 'success').length} succeeded
                                </span>
                                ,{' '}
                                <span className="text-red-600">
                                    {results.filter((r) => r.status === 'error').length} failed
                                </span>
                            </div>
                            {results.map((result, i) => (
                                <div
                                    key={i}
                                    className={`p-3 rounded border text-sm ${result.status === 'success'
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                        }`}
                                >
                                    <div className="font-medium">{result.property}</div>
                                    {result.status === 'success' ? (
                                        <a
                                            href={result.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline inline-flex items-center gap-1"
                                        >
                                            <Download size={14} />
                                            Download Report
                                        </a>
                                    ) : (
                                        <div className="text-red-600">{result.error}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Reports History Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText size={20} />
                        Report History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {reports.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FileText size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No reports generated yet.</p>
                            <p className="text-sm">
                                Generate your first report using the form above.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Property</TableHead>
                                        <TableHead>Period</TableHead>
                                        <TableHead>Generated</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell className="font-medium">
                                                {report.property_name}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {getMonthName(report.report_month)} {report.report_year}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                {formatDate(report.generated_at)}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${report.status === 'generated'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {report.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => window.open(report.pdf_url, '_blank')}
                                                    >
                                                        <Eye size={14} className="mr-1" />
                                                        View
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() => {
                                                            const link = document.createElement('a')
                                                            link.href = report.pdf_url
                                                            link.download = `${report.property_name}-${report.report_month}-${report.report_year}.pdf`
                                                            link.click()
                                                        }}
                                                    >
                                                        <Download size={14} className="mr-1" />
                                                        Download
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
