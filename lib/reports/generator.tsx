import { renderToStream } from '@react-pdf/renderer'
import { ReportPDF } from './ReportPDF'
import React from 'react' // Import React for JSX (createElement)

export async function generateReportPDF(data: any): Promise<NodeJS.ReadableStream> {
    // Use React.createElement directly or ensure TSX is handled
    return await renderToStream(<ReportPDF data={ data } />)
}

export function calculateMetrics(transactions: any[]) {
    let totalIncome = 0
    let totalExpenses = 0

    transactions.forEach(t => {
        if (t.transaction_type === 'income') {
            totalIncome += Number(t.amount)
        } else {
            totalExpenses += Number(t.amount)
        }
    })

    return {
        totalIncome,
        totalExpenses,
        netOperatingIncome: totalIncome - totalExpenses
    }
}
