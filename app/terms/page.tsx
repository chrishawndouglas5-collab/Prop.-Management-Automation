import React from 'react'

export default function TermsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 font-sans">
            <div className="max-w-4xl mx-auto py-16 px-6">
                <h1 className="text-4xl font-bold mb-2 text-white">Terms and Conditions</h1>
                <p className="text-zinc-400 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-invert max-w-none text-zinc-300 space-y-8">
                    <section>
                        <p>
                            These Terms and Conditions ("Terms") govern your use of PropAuto ("Service"),
                            operated by <strong>Abas Solutions</strong> ("we", "us", "our").
                        </p>
                        <ul className="list-none pl-0 space-y-1 mt-4">
                            <li><strong>Company Name:</strong> Abas Solutions</li>
                            <li><strong>Contact Email:</strong> legal@abassolutions.net</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Service Description</h2>
                        <p>PropAuto provides automated property owner report generation services. The Service includes PDF report creation, email delivery, and data storage. The Service is provided "as-is" and is intended to assist property managers in their daily operations.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Account Registration</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You must provide accurate, complete, and current information at all times.</li>
                            <li>You are responsible for safeguarding the password that you use to access the Service.</li>
                            <li>You represent that you are authorized to create an account for your business entity.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Billing and Payment</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Pricing:</strong> Pricing is based on the number of units managed, as detailed on our <a href="/pricing" className="text-brand-400 hover:underline">Pricing page</a>.</li>
                            <li><strong>Payment Method:</strong> Billing occurs monthly via our secure payment processor, Paddle.</li>
                            <li><strong>Changes:</strong> Prices may change with at least 30 days prior notice to existing customers.</li>
                            <li><strong>Suspension:</strong> We reserve the right to suspend or terminate your access to the Service if your payment method fails.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Free Trial</h2>
                        <p>We offer a 14-day free trial for new customers. No credit card is required to start the trial. You may cancel anytime during the trial period with no charges.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Subscription and Cancellation</h2>
                        <p>Subscriptions renew automatically on a monthly basis. You can cancel your subscription at any time via your customer portal or by contacting support. There are no refunds for partial months of service. Please refer to our <a href="/refund-policy" className="text-brand-400 hover:underline">Refund Policy</a> for more details.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. User Responsibilities</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You are responsible for the accuracy of the data you upload.</li>
                            <li>You agree to comply with all applicable data privacy laws regarding your property owners' data.</li>
                            <li>You agree not to use the Service for any illegal or unauthorized purpose.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Intellectual Property</h2>
                        <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Abas Solutions. You retain full ownership of the data you upload to the Service.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
                        <p>In no event shall Abas Solutions, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Us</h2>
                        <p>If you have any questions about these Terms, please contact us at:</p>
                        <p className="mt-2 text-white">support@abassolutions.net</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
