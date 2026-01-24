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
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"


interface AutomationLog {
    id: string
    log_date: string
    automation_type: string
    status: 'success' | 'partial' | 'failed'
    records_processed: number
    records_failed: number
    error_message: string | null
}

export default async function AdminLogsPage() {
    const supabase = await createClient()

    const { data: logs, error } = await supabase
        .from('automation_logs')
        .select('*')
        .order('log_date', { ascending: false })
        .limit(50)
        .returns<AutomationLog[]>()

    if (error) {
        return <div className="p-8 text-destructive">Error loading logs: {error.message}</div>
    }

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
                <p className="text-muted-foreground mt-1">
                    Monitor automated tasks and cron job execution.
                </p>
            </div>

            <Card className="glass border-white/10 bg-card/30">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="hover:bg-transparent border-white/10">
                                <TableHead>Time</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Processed</TableHead>
                                <TableHead>Failed</TableHead>
                                <TableHead>Error</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs && logs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-white/5 border-white/10">
                                    <TableCell className="font-mono text-xs">
                                        {new Date(log.log_date).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="font-medium">{log.automation_type}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            log.status === 'success' ? 'default' :
                                                log.status === 'partial' ? 'secondary' : 'destructive'
                                        } className={
                                            log.status === 'success' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' :
                                                log.status === 'partial' ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' : ''
                                        }>
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{log.records_processed}</TableCell>
                                    <TableCell className={log.records_failed > 0 ? "text-destructive font-bold" : "text-muted-foreground"}>
                                        {log.records_failed}
                                    </TableCell>
                                    <TableCell className="max-w-[300px] truncate text-xs text-muted-foreground">
                                        {log.error_message || '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!logs || logs.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No logs found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
