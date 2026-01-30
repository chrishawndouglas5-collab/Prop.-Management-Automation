import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { ReportData } from './calculator'

// Register font for consistent rendering
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf' }, // Regular
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf', fontWeight: 'bold' } // Bold (simulated or explicit if available)
    ]
})

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 12,
    },
    header: {
        marginBottom: 30,
        borderBottom: '2pt solid #000',
        paddingBottom: 15,
    },
    logo: {
        width: 100,
        height: 50,
        marginBottom: 10,
        objectFit: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'uppercase',
        borderBottom: '1pt solid #ccc',
        paddingBottom: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: '#f5f5f5',
        borderTop: '1pt solid #000',
        marginTop: 5,
    },
    categoryLabel: {
        fontSize: 12,
        color: '#333',
    },
    amount: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    totalAmount: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    incomeAmount: {
        color: '#059669', // green
    },
    expenseAmount: {
        color: '#dc2626', // red
    },
    noiSection: {
        marginTop: 10,
        padding: 15,
        backgroundColor: '#f9fafb',
        borderRadius: 5,
    },
    noiAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    metricsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    metric: {
        // textAlign: 'center', // handled via flex
        alignItems: 'center',
        flexDirection: 'column'
    },
    metricLabel: {
        fontSize: 10,
        color: '#666',
        marginBottom: 5,
    },
    metricValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
})

interface ReportDocumentProps {
    propertyName: string
    month: number
    year: number
    data: ReportData
    logoUrl?: string
    companyName?: string
}

export function ReportDocument({
    propertyName,
    month,
    year,
    data,
    logoUrl,
    companyName,
}: ReportDocumentProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    {/* Handle logoUrl potentially being null/undefined safely */}
                    {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
                    <Text style={styles.title}>{propertyName}</Text>
                    <Text style={styles.subtitle}>
                        Monthly Financial Report - {month}/{year}
                    </Text>
                    {companyName && (
                        <Text style={styles.subtitle}>Prepared by {companyName}</Text>
                    )}
                </View>

                {/* Income Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Income Summary</Text>
                    {Object.entries(data.income)
                        .sort(([, a], [, b]) => b - a) // Sort by amount descending
                        .map(([category, amount]) => (
                            <View key={category} style={styles.row}>
                                <Text style={styles.categoryLabel}>{category}</Text>
                                <Text style={[styles.amount, styles.incomeAmount]}>
                                    {formatCurrency(amount)}
                                </Text>
                            </View>
                        ))}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>TOTAL INCOME</Text>
                        <Text style={[styles.totalAmount, styles.incomeAmount]}>
                            {formatCurrency(data.totalIncome)}
                        </Text>
                    </View>
                </View>

                {/* Expenses Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Expense Summary</Text>
                    {Object.entries(data.expenses)
                        .sort(([, a], [, b]) => b - a) // Sort by amount descending
                        .map(([category, amount]) => (
                            <View key={category} style={styles.row}>
                                <Text style={styles.categoryLabel}>{category}</Text>
                                <Text style={[styles.amount, styles.expenseAmount]}>
                                    {formatCurrency(amount)}
                                </Text>
                            </View>
                        ))}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>TOTAL EXPENSES</Text>
                        <Text style={[styles.totalAmount, styles.expenseAmount]}>
                            {formatCurrency(data.totalExpenses)}
                        </Text>
                    </View>
                </View>

                {/* NOI Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Net Operating Income</Text>
                    <View style={styles.row}>
                        <Text style={styles.categoryLabel}>Total Income</Text>
                        <Text style={styles.amount}>{formatCurrency(data.totalIncome)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.categoryLabel}>Total Expenses</Text>
                        <Text style={styles.amount}>
                            ({formatCurrency(data.totalExpenses)})
                        </Text>
                    </View>
                    <View style={[styles.totalRow, styles.noiSection]}>
                        <Text style={styles.totalLabel}>NET OPERATING INCOME (NOI)</Text>
                        <Text style={styles.noiAmount}>{formatCurrency(data.noi)}</Text>
                    </View>
                </View>

                {/* Key Metrics */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Key Metrics</Text>
                    <View style={styles.metricsGrid}>
                        <View style={styles.metric}>
                            <Text style={styles.metricLabel}>Operating Expense Ratio</Text>
                            <Text style={styles.metricValue}>
                                {data.expenseRatio.toFixed(1)}%
                            </Text>
                        </View>
                        <View style={styles.metric}>
                            <Text style={styles.metricLabel}>Net Operating Margin</Text>
                            <Text style={styles.metricValue}>
                                {data.netMargin.toFixed(1)}%
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={{ position: 'absolute', bottom: 30, left: 40, right: 40 }}>
                    <Text style={{ fontSize: 8, color: '#999', textAlign: 'center' }}>
                        Generated by PropAuto on {new Date().toLocaleDateString()} | This
                        report is for informational purposes only
                    </Text>
                </View>
            </Page>
        </Document>
    )
}
