import React from 'react'

export default function RefundPolicyPage() {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 font-sans">
            <div className="max-w-4xl mx-auto py-16 px-6">
                <h1 className="text-4xl font-bold mb-2 text-white">Refund Policy</h1>
                <p className="text-zinc-400 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-invert max-w-none text-zinc-300 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">14-Day Free Trial</h2>
                        <p>We want you to be completely satisfied with PropAuto. That's why:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>All new customers receive a <strong>14-day free trial</strong>.</li>
                            <li>No credit card is required to start your trial.</li>
                            <li>You can cancel anytime during the trial period with <strong>zero charges</strong>.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Monthly Subscription Refunds</h2>
                        <p>For paid monthly subscriptions:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>We <strong>do not offer refunds for partial months</strong> of service.</li>
                            <li>If you cancel your subscription, your service will continue until the end of your current billing period.</li>
                            <li>You will not be charged again after cancellation.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Billing Errors</h2>
                        <p>If you believe you have been incorrectly charged, please contact us immediately.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Email <strong>support@abassolutions.net</strong> within 30 days of the charge.</li>
                            <li>Include your account email and the date of the charge.</li>
                            <li>If an error is confirmed, we will issue a full refund for the incorrect amount.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">How to Request a Refund</h2>
                        <p>To submit a refund request for a billing error or exceptional circumstance:</p>
                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg mt-4">
                            <p className="font-medium text-white">Email: support@abassolutions.net</p>
                            <p className="text-sm mt-2">Please include:</p>
                            <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                                <li>Your Account Email</li>
                                <li>Reason for the request</li>
                                <li>Date of the charge in question</li>
                            </ul>
                            <p className="text-sm mt-4 text-zinc-400">We aim to respond to all refund requests within 5 business days.</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
