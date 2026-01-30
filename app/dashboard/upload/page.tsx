'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Upload, FileType, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { uploadData } from './actions'
import { cn } from '@/lib/utils'

export default function UploadPage() {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [format, setFormat] = useState<'appfolio' | 'buildium'>('appfolio')
    const [uploading, setUploading] = useState(false)
    const [result, setResult] = useState<{ message: string, success: boolean } | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0])
            setResult(null)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.csv']
        },
        maxFiles: 1
    })

    async function handleUpload() {
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('format', format)

        const res = await uploadData(formData)

        if (res.unmatched && res.unmatchedRows) {
            sessionStorage.setItem('unmatchedProperties', JSON.stringify(res.unmatchedRows))
            router.push('/dashboard/upload/review')
            return // Stop further processing to allow redirect
        }

        setResult(res)
        setUploading(false)
        if (res.success && !res.unmatched) {
            setFile(null)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Upload Data
                </h1>
                <p className="text-muted-foreground mt-1">
                    Import your property management reports (CSV) to generate insights.
                </p>
            </div>

            <Card className="glass border-white/10 bg-card/30">
                <CardHeader>
                    <CardTitle>Select Data Source</CardTitle>
                    <CardDescription>
                        Choose the software you are exporting from.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={format} onValueChange={(v) => setFormat(v as any)}>
                        <SelectTrigger className="w-[280px] bg-secondary/50">
                            <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="appfolio">AppFolio (Owner Statement / Ledger)</SelectItem>
                            <SelectItem value="buildium">Buildium (General Ledger)</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card className="glass border-white/10 bg-card/30">
                <CardHeader>
                    <CardTitle>Upload File</CardTitle>
                    <CardDescription>
                        Drag and drop your CSV file here.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div
                        {...getRootProps()}
                        className={cn(
                            "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200",
                            isDragActive
                                ? "border-brand-DEFAULT bg-brand-DEFAULT/5"
                                : "border-white/10 hover:border-white/20 hover:bg-white/5",
                            file && "border-accent-teal/50 bg-accent-teal/5"
                        )}
                    >
                        <input {...getInputProps()} />

                        {file ? (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in spin-in-1">
                                <FileType className="h-10 w-10 text-accent-teal mb-3" />
                                <p className="font-medium text-foreground">{file.name}</p>
                                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2 text-muted-foreground hover:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setFile(null)
                                    }}
                                >
                                    Remove
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                                <p className="font-medium text-foreground">
                                    {isDragActive ? "Drop the file here" : "Drag & drop CSV file"}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1 mb-2">
                                    or click to select file
                                </p>
                                <a
                                    href={`/samples/${format === 'appfolio' ? 'appfolio_sample.csv' : 'buildium_sample.csv'}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-xs text-brand-glow hover:underline flex items-center mt-2 z-10"
                                    download
                                >
                                    <Download className="mr-1 h-3 w-3" />
                                    Download {format === 'appfolio' ? 'AppFolio' : 'Buildium'} Template
                                </a>
                            </div>
                        )}
                    </div>

                    {result && (
                        <div className="space-y-4">
                            <div className={cn(
                                "p-4 rounded-lg flex items-center gap-3 transition-all",
                                result.success ? "bg-accent-teal/10 text-accent-teal border border-accent-teal/20" : "bg-destructive/10 text-destructive border border-destructive/20"
                            )}>
                                {result.success ? <CheckCircle className="h-5 w-5" /> : <Loader2 className="h-5 w-5" />}
                                <div>
                                    <p className="font-medium">{result.message}</p>
                                </div>
                            </div>

                            {/* Summary Card */}
                            {(result as any).summary && (
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Upload Summary</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Date Range</p>
                                            <p className="text-white font-medium">{(result as any).summary.dateRange}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Transactions</p>
                                            <p className="text-white font-medium">{(result as any).summary.totalFiles}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-muted-foreground">Financials</p>
                                            <p className="text-white font-medium tracking-tight">{(result as any).summary.financials}</p>
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/10 my-2" />
                                    <p className="text-xs text-brand-glow">
                                        Head to the <a href="/dashboard/reports" className="underline hover:text-white">Reports</a> page to generate a PDF for this period.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="bg-brand-DEFAULT text-white w-full sm:w-auto"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Process Data'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
