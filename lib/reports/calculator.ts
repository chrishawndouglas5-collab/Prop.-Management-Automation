
export interface CategorySummary {
    [category: string]: number
}

export interface ReportData {
    income: CategorySummary
    expenses: CategorySummary
    totalIncome: number
    totalExpenses: number
    noi: number
    expenseRatio: number
    netMargin: number
}

// Map raw transaction interface to what this calculator expects
export interface Transaction {
    transaction_type: 'income' | 'expense'
    category: string
    amount: number
    [key: string]: any
}

export function groupTransactionsByCategory(transactions: Transaction[]): ReportData {
    const income: CategorySummary = {}
    const expenses: CategorySummary = {}

    let totalIncome = 0
    let totalExpenses = 0

    // Group transactions by category
    for (const transaction of transactions) {
        const amount = Math.abs(Number(transaction.amount)) // Ensure number and positive for summing

        if (transaction.transaction_type === 'income') {
            const category = normalizeCategory(transaction.category || 'Uncategorized', 'income')
            income[category] = (income[category] || 0) + amount
            totalIncome += amount
        } else {
            const category = normalizeCategory(transaction.category || 'Uncategorized', 'expense')
            expenses[category] = (expenses[category] || 0) + amount
            totalExpenses += amount
        }
    }

    const noi = totalIncome - totalExpenses
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0
    const netMargin = totalIncome > 0 ? (noi / totalIncome) * 100 : 0

    return {
        income,
        expenses,
        totalIncome,
        totalExpenses,
        noi,
        expenseRatio,
        netMargin,
    }
}

function normalizeCategory(category: string, type: 'income' | 'expense'): string {
    // Normalize common category names
    const normalized = category.toLowerCase().trim()

    if (type === 'income') {
        if (normalized.includes('rent')) return 'Rent Income'
        if (normalized.includes('late') || normalized.includes('fee')) return 'Late Fees'
        return 'Other Income' // Fallback for income
    } else {
        // Expense Normalization
        if (normalized.includes('maintenance') || normalized.includes('repair')) {
            return 'Maintenance & Repairs'
        }
        if (normalized.includes('utilit') || normalized.includes('water') || normalized.includes('electric') || normalized.includes('gas')) {
            return 'Utilities'
        }
        if (normalized.includes('management') || normalized.includes('fee')) {
            return 'Property Management Fees'
        }
        if (normalized.includes('insurance')) return 'Insurance'
        if (normalized.includes('landscape') || normalized.includes('lawn') || normalized.includes('garden')) {
            return 'Landscaping'
        }
        if (normalized.includes('tax')) return 'Property Taxes'
        if (normalized.includes('hoa')) return 'HOA Fees'

        // If it's a specific named category that doesn't match above, keep it capitalized rather than "Other"
        // This allows custom categories to pass through if they don't match standard buckets.
        // BUT the instructions imply strictly bucketing.
        // "If a category doesn't match any known pattern, it goes to 'Other Income' or 'Other Expenses'"
        return 'Other Expenses'
    }
}
