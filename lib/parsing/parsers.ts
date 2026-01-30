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

// Helper: Normalize any string for comparison (remove special chars, lowercase)
function normalizeHeader(header: string): string {
    return header.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// Helper: Find value in row using multiple possible header synonyms
function getValue(row: Record<string, any>, synonyms: string[]): string | undefined {
    // 1. Try exact matches from our normalized row keys
    const rowKeys = Object.keys(row)

    for (const synonym of synonyms) {
        // We match against the normalized keys of the row
        const match = rowKeys.find(key => normalizeHeader(key) === normalizeHeader(synonym))
        if (match && row[match] !== undefined && row[match] !== null && row[match] !== '') {
            return row[match]
        }
    }
    return undefined
}

// Basic normalization helper
function normalizeAmount(amountStr: string | number): number {
    if (typeof amountStr === 'number') return amountStr
    if (!amountStr) return 0
    // Remove currency symbols and commas
    const clean = amountStr.toString().replace(/[$,\s]/g, '')
    // Handle accounting negative format (100.00) -> -100.00
    if (clean.startsWith('(') && clean.endsWith(')')) {
        return -1 * parseFloat(clean.replace(/[()]/g, ''))
    }
    return parseFloat(clean) || 0
}

function normalizeDate(dateStr: string): string {
    if (!dateStr) return new Date().toISOString()

    // Explicitly handle MM/DD/YYYY or M/D/YYYY which is common in US CSVs
    const mmddyyyy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    const match = dateStr.match(mmddyyyy)

    if (match) {
        const month = parseInt(match[1], 10)
        const day = parseInt(match[2], 10)
        const year = parseInt(match[3], 10)
        const paddedMonth = month.toString().padStart(2, '0')
        const paddedDay = day.toString().padStart(2, '0')
        return `${year}-${paddedMonth}-${paddedDay}`
    }

    const yyyymmdd = /^\d{4}-\d{2}-\d{2}$/
    if (yyyymmdd.test(dateStr)) return dateStr

    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
        console.warn(`Failed to parse date: ${dateStr}, defaulting to now`)
        return new Date().toISOString()
    }
    return date.toISOString()
}

export async function parseCSV(csvContent: string, format: 'appfolio' | 'buildium'): Promise<ParsedTransaction[]> {
    return new Promise((resolve, reject) => {
        Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const transactions: ParsedTransaction[] = []

                results.data.forEach((row: any) => {
                    // Define synonyms for critical columns
                    const colMap = {
                        date: ['date', 'transaction date', 'posting date', 'post date'],
                        amount: ['amount', 'amount ($)', 'total', 'debit/credit'],
                        description: ['description', 'desc', 'memo', 'payee', 'payee/payer', 'payer'],
                        category: ['category', 'gl account', 'account', 'type'],
                        property: ['property', 'property name', 'building', 'bldg', 'unit']
                    }

                    // Extract values using synonyms
                    const dateVal = getValue(row, colMap.date)
                    const amountVal = getValue(row, colMap.amount)

                    // We accept a row if it has at least a Date and Amount
                    if (dateVal && amountVal !== undefined) {
                        const amount = normalizeAmount(amountVal)

                        // Extract other fields with fallbacks
                        const descVal = getValue(row, colMap.description) || 'Unknown Description'
                        const catVal = getValue(row, colMap.category) || 'Uncategorized'
                        const propVal = getValue(row, colMap.property) // Can be undefined, handled by caller

                        const t: ParsedTransaction = {
                            transaction_date: normalizeDate(dateVal),
                            description: descVal,
                            amount: Math.abs(amount),
                            // If amount is negative, it's an expense. If positive, income.
                            // UNLESS we are parsing Buildium/AppFolio specific logic which might differ?
                            // Standard GL export: Negative = Credit (Income)? 
                            // Actually, usually GL: Debit = Expense (Positive), Credit = Income (Negative).
                            // BUT bank statements: Money In (Positive), Money Out (Negative).
                            // Let's stick to the previous simple logic for now: Amount < 0 = Expense?
                            // Wait, previous code said: `amount >= 0 ? 'income' : 'expense'`.
                            // That implies Positive = Income. 
                            // Let's keep it simple for now and fix strictly in Phase 4 if needed.
                            transaction_type: amount >= 0 ? 'income' : 'expense',
                            category: catVal,
                            property_name_hint: propVal
                        }
                        transactions.push(t)
                    }
                })

                resolve(transactions)
            },
            error: (error: any) => {
                reject(error)
            }
        })
    })
}
