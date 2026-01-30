import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, Clock, TrendingUp, FileText, Mail, Zap } from 'lucide-react'
import { MarketingNavbar } from '@/components/marketing/MarketingNavbar'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">
              Automate Your Monthly Owner Reports in 5 Minutes
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Property managers save 20+ hours per month with PropAuto&apos;s automated
              financial reporting. Upload your data, generate professional PDFs,
              and deliver via email—all in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Watch 2-Min Demo
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Are You Spending Hours Every Month on Owner Reports?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 text-red-900">
                    The Old Way (Manual)
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Exporting messy CSVs from AppFolio/Buildium',
                      'Manually formatting data in Excel for hours',
                      'Creating PDFs one property at a time',
                      'Emailing reports to 50+ property owners',
                      'Fixing errors when owners complain',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-600 mt-1">❌</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-red-900 font-semibold">
                    Time: 10-20 hours per month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 text-green-900">
                    The PropAuto Way (Automated)
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Upload CSV once (2 minutes)',
                      'Auto-match properties with AI',
                      'Generate all reports with one click',
                      'Download or email all at once',
                      'Professional, error-free PDFs every time',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="text-green-600 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-green-900 font-semibold">
                    Time: 5 minutes per month
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              How PropAuto Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileText className="w-12 h-12 text-blue-600" />,
                  step: '1',
                  title: 'Upload Your Data',
                  description:
                    'Export your monthly transactions from AppFolio or Buildium and upload the CSV. Takes 2 minutes.',
                },
                {
                  icon: <Zap className="w-12 h-12 text-blue-600" />,
                  step: '2',
                  title: 'Generate Reports',
                  description:
                    'PropAuto automatically calculates NOI, expenses, and creates professional branded PDFs for each property.',
                },
                {
                  icon: <Mail className="w-12 h-12 text-blue-600" />,
                  step: '3',
                  title: 'Deliver',
                  description:
                    'Download all reports or have PropAuto email them directly to property owners. Done in 5 minutes total.',
                },
              ].map((item) => (
                <Card key={item.step} className="border-none shadow-md">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-4">{item.icon}</div>
                    <div className="text-sm font-semibold text-blue-600 mb-2">
                      STEP {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 mb-8">
              Pay only for what you use. The more you grow, the less you pay per unit.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { units: '50 units', price: '$150', value: '$200', hours: '5' },
                { units: '150 units', price: '$375', value: '$600', hours: '15' },
                { units: '300 units', price: '$600', value: '$1,200', hours: '30' },
              ].map((tier, i) => (
                <Card key={i} className="border-2 border-slate-100 shadow-sm hover:border-blue-100 transition-colors">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold mb-2">{tier.units}</div>
                    <div className="text-3xl font-bold text-blue-600 mb-4">
                      {tier.price}
                      <span className="text-sm text-gray-500 font-normal">/mo</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Saves you {tier.hours} hours
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      Value: {tier.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                View Full Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">See PropAuto in Action</h2>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-8 shadow-inner">
              <div className="text-center">
                <p className="text-gray-600 mb-4 font-medium">Demo video coming soon</p>
                <p className="text-sm text-gray-500">
                  Record your demo video via Loom and embed it here!
                </p>
              </div>
            </div>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Start Your Free Trial</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              Trusted by Property Managers
            </h2>
            <p className="text-gray-600 mb-12">
              Join property managers who are saving 20+ hours per month
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Clock className="w-8 h-8" />, stat: '20+ hours', label: 'Saved per month' },
                { icon: <TrendingUp className="w-8 h-8" />, stat: '5 minutes', label: 'Total time needed' },
                { icon: <Check className="w-8 h-8" />, stat: '100%', label: 'Error-free reports' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="flex justify-center mb-4 text-blue-600">
                    {item.icon}
                  </div>
                  <div className="text-3xl font-bold mb-2">{item.stat}</div>
                  <div className="text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Start Your Free 14-Day Trial
            </h2>
            <p className="text-xl mb-8 opacity-90">
              No credit card required • Full access • Cancel anytime
            </p>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 border-none">
                Get Started Free
              </Button>
            </Link>
            <p className="mt-6 text-sm opacity-75">
              Questions? Email us at support@abassolutions.net
            </p>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
