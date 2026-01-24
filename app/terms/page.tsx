import React from 'react'

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-6">
            <h1 className="text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>
            <div className="prose prose-invert max-w-none text-muted-foreground">
                <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
                <p>By accessing and using this Property Management Automation System ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Description of Service</h2>
                <p>The Service provides automated property management reporting and data processing tools. We reserve the right to modify or discontinue the Service at any time.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. User Accounts</h2>
                <p>You are responsible for maintaining the security of your account credentials. You are responsible for all activities that occur under your account.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Subscription and Payments</h2>
                <p>Use of the Service requires a subscription. Payments are processed securely via our payment provider (Paddle). Subscriptions automatically renew unless canceled.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Data Privacy</h2>
                <p>Your data usage is governed by our Privacy Policy. We process your uploaded property data solely for the purpose of generating reports.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Limitation of Liability</h2>
                <p>The Service is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Service.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. Contact</h2>
                <p>For any questions regarding these terms, please contact support.</p>
            </div>
        </div>
    )
}
