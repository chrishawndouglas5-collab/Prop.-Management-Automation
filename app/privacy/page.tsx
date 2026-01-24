import React from 'react'

export default function PrivacyPage() {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 font-sans">
            <div className="max-w-4xl mx-auto py-16 px-6">
                <h1 className="text-4xl font-bold mb-2 text-white">Privacy Policy</h1>
                <p className="text-zinc-400 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-invert max-w-none text-zinc-300 space-y-8">
                    <section>
                        <p>
                            <strong>Abas Solutions</strong> ("we", "us", "our") operates the PropAuto service.
                            This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                        <h3 className="text-xl font-medium text-white mt-4 mb-2">Information You Provide</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Account Information:</strong> Name, email address, and company details.</li>
                            <li><strong>Property Data:</strong> Addresses, transaction data, and property owner details you upload via CSV for report generation.</li>
                            <li><strong>Payment Information:</strong> We use Paddle for payment processing. We do not store your credit card details.</li>
                        </ul>

                        <h3 className="text-xl font-medium text-white mt-4 mb-2">Automatically Collected</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Usage Data:</strong> Information on how you access and use the Service.</li>
                            <li><strong>Device Data:</strong> IP address, browser type, and version.</li>
                            <li><strong>Cookies:</strong> Essential cookies for authentication and session management.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>To provide and maintain the Service (e.g., generating reports).</li>
                            <li>To process payments via our merchant of record, Paddle.</li>
                            <li>To communicate with you about your account and sending reports.</li>
                            <li>To monitor usage and improve the Service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Data Sharing</h2>
                        <p>We do NOT sell your data to third parties. We only share data with trusted third-party service providers necessary to operate the Service:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li><strong>Paddle:</strong> For payment processing and billing compliance.</li>
                            <li><strong>Supabase:</strong> For secure database hosting and file storage.</li>
                            <li><strong>Resend:</strong> For delivering emails to you and your property owners.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
                        <p>The security of your data is important to us. We use industry-standard security measures, including encryption at rest and in transit, to protect your personal information on our infrastructure provider, Supabase.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Your Data Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Access specific personal data we hold about you.</li>
                            <li>Request correction of inaccurate data.</li>
                            <li>Request deletion of your account and associated data (subject to legal retention requirements).</li>
                            <li>Export your property data CSVs at any time from the dashboard.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us:</p>
                        <div className="mt-2">
                            <p className="text-white">Email: privacy@abassolutions.net</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
