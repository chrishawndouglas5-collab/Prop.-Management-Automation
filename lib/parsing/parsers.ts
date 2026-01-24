import Papa from 'papaparse'

export type TransactionType = 'income' | 'expense'

export interface ParsedTransaction {
    transaction_date: string // ISO string
    description: string
    amount: number
    category: string
    transaction_type: TransactionType
    property_name_hint?: string // If available in CSV
}

// Basic normalization helper
function normalizeAmount(amountStr: string | number): number {
    if (typeof amountStr === 'number') return amountStr
    // Remove currency symbols and commas
    const clean = amountStr.replace(/[$,]/g, '')
    return parseFloat(clean) || 0
}

function normalizeDate(dateStr: string): string {
    // Attempt to parse standard formats
    // Simple pass-through for now, expecting typical US formats MM/DD/YYYY
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
        // Fallback or throw error
        return new Date().toISOString() // Current date as fallback for MVP safety? Or throwing better.
    }
    return date.toISOString()
}

export async function parseCSV(csvContent: string, type: 'appfolio' | 'buildium'): Promise<ParsedTransaction[]> {
    return new Promise((resolve, reject) => {
        Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const transactions: ParsedTransaction[] = []

                results.data.forEach((row: any) => {
                    let t: ParsedTransaction | null = null

                    if (type === 'appfolio') {
                        // AppFolio typical columns: Date, Payee / Payer, Description, Amount, Category
                        // (Simplification for MVP - real AppFolio reports vary by type)
                        if (row['Date'] && row['Amount']) {
                            const amount = normalizeAmount(row['Amount'])
                            t = {
                                transaction_date: normalizeDate(row['Date']),
                                description: row['Description'] || row['Payee / Payer'] || 'Unknown',
                                amount: Math.abs(amount),
                                transaction_type: amount >= 0 ? 'income' : 'expense', // AppFolio often uses negative for expense
                                category: row['Gl Account'] || row['Category'] || 'Uncategorized',
                                property_name_hint: row['Property']
                            }
                        }
                    } else if (type === 'buildium') {
                        // Buildium typical columns: Date, Property, Description, Amount, Type
                        if (row['Date'] && row['Amount']) {
                            const amount = normalizeAmount(row['Amount'])
                            t = {
                                transaction_date: normalizeDate(row['Date']),
                                description: row['Description'] || 'Unknown',
                                amount: Math.abs(amount),
                                transaction_type: amount >= 0 ? 'income' : 'expense',
                                category: row['Category'] || row['Type'] || 'Uncategorized',
                                property_name_hint: row['Property']
                            }
                        }
                    }

                    if (t) transactions.push(t)
                })

                resolve(transactions)
            },
            error: (error: any) => {
                reject(error)
            }
        })
    })
}
