import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    FileText,
    Zap,
    Shield,
    Clock,
    TrendingUp,
    Mail,
    Database,
    CheckCircle,
} from 'lucide-react'
import { MarketingNavbar } from '@/components/marketing/MarketingNavbar'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
            <MarketingNavbar />

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold mb-4 text-slate-900">
                            Everything You Need to Automate Owner Reports
                        </h1>
                        <p className="text-xl text-gray-600">
                            Purpose-built for property managers using AppFolio and Buildium
                        </p>
                    </div>

                    {/* Core Features */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {[
                            {
                                icon: <FileText className="w-10 h-10 text-blue-600" />,
                                title: 'CSV Data Upload',
                                description:
                                    'Export monthly transactions from AppFolio or Buildium and upload with drag-and-drop. PropAuto automatically processes and categorizes all transactions.',
                            },
                            {
                                icon: <Zap className="w-10 h-10 text-blue-600" />,
                                title: 'Smart Property Matching',
                                description:
                                    'AI-powered fuzzy matching automatically links CSV data to your properties. Handles variations like "Sunset Apts" vs "Sunset Apartments" seamlessly.',
                            },
                            {
                                icon: <TrendingUp className="w-10 h-10 text-blue-600" />,
                                title: 'Financial Calculations',
                                description:
                                    'Automatically calculates Net Operating Income (NOI), total income, expense breakdowns by category, and month-over-month comparisons.',
                            },
                            {
                                icon: <FileText className="w-10 h-10 text-blue-600" />,
                                title: 'Professional PDF Reports',
                                description:
                                    'Choose from 3 professional templates (Basic, Detailed, Executive). Add your company logo for branded reports that impress property owners.',
                            },
                            {
                                icon: <Mail className="w-10 h-10 text-blue-600" />,
                                title: 'Automated Delivery',
                                description:
                                    'Download all reports at once or email them directly to property owners. Set up once and let PropAuto handle delivery every month.',
                            },
                            {
                                icon: <Shield className="w-10 h-10 text-blue-600" />,
                                title: 'Secure Cloud Storage',
                                description:
                                    'All reports are securely stored in the cloud. Access historical reports anytime from your dashboard. Bank-level encryption protects your data.',
                            },
                            {
                                icon: <Clock className="w-10 h-10 text-blue-600" />,
                                title: 'Time Tracking',
                                description:
                                    'See exactly how much time PropAuto saves you each month. Most property managers save 15-20 hours per month on reporting tasks.',
                            },
                            {
                                icon: <Database className="w-10 h-10 text-blue-600" />,
                                title: 'Multi-Property Support',
                                description:
                                    'Manage unlimited properties. Generate reports for 5 properties or 500 properties with the same ease. PropAuto scales with your portfolio.',
                            },
                        ].map((feature, i) => (
                            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">{feature.icon}</div>
                                        <div>
                                            <CardTitle className="text-xl text-slate-800">{feature.title}</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Supported Platforms */}
                    <Card className="mb-16 bg-blue-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-900">Works With Your Existing Software</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 text-slate-800">AppFolio</h3>
                                    <p className="text-gray-600 mb-4">
                                        Export transactions from AppFolio&apos;s General Ledger report.
                                        PropAuto automatically processes AppFolio&apos;s CSV format.
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        {['Income tracking', 'Expense categorization', 'Property-level breakdowns'].map(
                                            (item, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <CheckCircle className="text-green-600" size={16} />
                                                    <span>{item}</span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 text-slate-800">Buildium</h3>
                                    <p className="text-gray-600 mb-4">
                                        Export transactions from Buildium&apos;s transaction reports.
                                        PropAuto handles Buildium&apos;s CSV structure seamlessly.
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        {['Full transaction history', 'Category mapping', 'Multi-property support'].map(
                                            (item, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <CheckCircle className="text-green-600" size={16} />
                                                    <span>{item}</span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CTA */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Save 20+ Hours Per Month?</h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Start your free 14-day trial. No credit card required.
                        </p>
                        <Link href="/auth/signup">
                            <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                                Start Free Trial
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <MarketingFooter />
        </div>
    )
}
