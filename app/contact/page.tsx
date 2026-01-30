import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, MessageCircle } from 'lucide-react'
import { MarketingNavbar } from '@/components/marketing/MarketingNavbar'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
            <MarketingNavbar />

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4 text-slate-900">Get in Touch</h1>
                        <p className="text-xl text-gray-600">
                            Have questions? We&apos;re here to help.
                        </p>
                    </div>

                    {/* Contact Options */}
                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-8 h-8 text-blue-600" />
                                    <CardTitle>Email Us</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Send us an email and we&apos;ll respond within 24 hours.
                                </p>
                                <a
                                    href="mailto:support@abassolutions.net"
                                    className="text-blue-600 hover:underline font-medium text-lg"
                                >
                                    support@abassolutions.net
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <MessageCircle className="w-8 h-8 text-blue-600" />
                                    <CardTitle>Schedule a Demo</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Want to see PropAuto in action? Book a 15-minute demo.
                                </p>
                                <a
                                    href="mailto:support@abassolutions.net?subject=Demo Request"
                                    className="text-blue-600 hover:underline font-medium text-lg"
                                >
                                    Request a demo
                                </a>
                            </CardContent>
                        </Card>
                    </div>

                    {/* About Section */}
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>About PropAuto</CardTitle>
                        </CardHeader>
                        <CardContent className="prose max-w-none text-gray-700">
                            <p className="mb-4">
                                PropAuto was built by property managers, for property managers. We understand
                                the pain of spending hours every month on owner reports because we&apos;ve been there.
                            </p>
                            <p className="mb-4">
                                Our mission is simple: automate the tedious parts of property management so you
                                can focus on growing your business and serving your clients.
                            </p>
                            <p>
                                PropAuto is operated by <strong>Abas Solutions</strong>, a software company
                                dedicated to building practical tools for real estate professionals.
                            </p>
                        </CardContent>
                    </Card>

                    {/* CTA */}
                    <div className="text-center mt-12">
                        <Link href="/auth/signup">
                            <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                                Start Your Free Trial
                            </Button>
                        </Link>
                        <p className="mt-4 text-sm text-gray-600">
                            No credit card required • 14-day free trial
                        </p>
                    </div>
                </div>
            </div>

            <MarketingFooter />
        </div>
    )
}
