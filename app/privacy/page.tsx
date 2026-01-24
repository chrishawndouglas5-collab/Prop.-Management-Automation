import React from 'react'

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-6">
            <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
            <div className="prose prose-invert max-w-none text-muted-foreground">
                <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create an account, subscribe, or upload data to the Service.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
                <p>We use your information to provide, maintain, and improve the Service, process payments, and send you related information including reports and invoices.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Data Security</h2>
                <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>

                <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Third-Party Services</h2>
                <p>We use third-party providers for services such as payment processing (Paddle), email delivery (Resend), and authentication (Supabase).</p>
            </div>
        </div>
    )
}
