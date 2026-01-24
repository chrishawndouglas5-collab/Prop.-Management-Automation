# Paddle Compliance Pages Plan

Please paste the plan created by Claude below this line.
------------------------------------------------------------------------------------------------
PROMPT START:
Add Paddle merchant approval compliance pages to the existing PropAuto Next.js application without breaking any existing functionality.
Context:
This is an existing Next.js 14 app with App Router, Supabase, Paddle billing integration, and Tailwind CSS styling. We need to add required pages for Paddle merchant approval.
Requirements:
1. Create Pricing Page (app/pricing/page.tsx)
Create a public pricing page at /pricing with:
Header Section:

H1: "Simple, Transparent Pricing"
Subheading: "Automated property owner reports that scale with your business"

Pricing Tiers (Volume-based per-unit pricing):
Display as a clean comparison table:
Units ManagedPrice Per UnitExample Monthly Cost1-100 units$3.00/unit50 units = $150/mo101-300 units$2.50/unit200 units = $500/mo301-500 units$2.00/unit400 units = $800/mo501+ units$1.50/unit600 units = $900/mo
Interactive Pricing Calculator:

Input field: "How many units do you manage?"
Real-time calculation showing: "Your monthly cost: $XXX"
Calculation logic:

1-100: quantity × $3.00
101-300: (100 × $3.00) + ((quantity - 100) × $2.50)
301-500: (100 × $3.00) + (200 × $2.50) + ((quantity - 300) × $2.00)
501+: (100 × $3.00) + (200 × $2.50) + (200 × $2.00) + ((quantity - 500) × $1.50)



Key Features Section:
List what's included:

✓ Unlimited monthly reports
✓ 3 professional PDF templates (Basic, Detailed, Executive)
✓ Automated email delivery to property owners
✓ CSV data upload (AppFolio & Buildium compatible)
✓ Secure cloud storage for historical reports
✓ Customer support via email
✓ No setup fees or long-term contracts

CTA Button:

"Start Free Trial" button linking to /auth/signup
Note: "14-day free trial. No credit card required to start."

FAQ Section:
Include 5-7 common questions:

How does billing work?
Can I change my plan?
What if I add more properties?
Is there a contract?
What payment methods do you accept?
Can I cancel anytime?

Styling:

Use Tailwind CSS
Clean, professional design
Mobile responsive
Use shadcn/ui components for table and calculator input


2. Create Terms & Conditions Page (app/terms/page.tsx)
Create page at /terms with:
Title: "Terms and Conditions"
Last Updated: [Current Date]
Company Information Section:
These Terms and Conditions ("Terms") govern your use of PropAuto ("Service"), 
operated by [YOUR LEGAL NAME / COMPANY NAME] ("we", "us", "our").

Company Name: [YOUR LEGAL NAME OR BUSINESS NAME]
Contact Email: legal@[yourdomain].com
Include these sections:

Acceptance of Terms

By accessing/using the Service, you agree to these Terms
If you disagree, you may not use the Service


Service Description

PropAuto provides automated property owner report generation
Service includes PDF report creation, email delivery, and data storage
Service is provided "as-is"


Account Registration

You must provide accurate information
You are responsible for account security
One account per business entity


Billing and Payment

Pricing based on units managed (refer to /pricing)
Billing occurs monthly via Paddle
Prices may change with 30 days notice to existing customers
Failed payments may result in service suspension


Free Trial

14-day free trial available for new customers
No credit card required during trial
Cancel anytime during trial with no charges


Subscription and Cancellation

Subscriptions renew automatically monthly
Cancel anytime via customer portal or email
No refunds for partial months
See Refund Policy for details


User Responsibilities

Upload accurate data
Maintain data security
Comply with property owner data privacy requirements
Not use Service for illegal purposes


Intellectual Property

Service and content are owned by [Company Name]
Users retain ownership of uploaded data
Generated reports may be used by customer for business purposes


Limitation of Liability

Service provided "as-is" without warranties
We are not liable for business losses, data loss, or indirect damages
Liability limited to amount paid in past 12 months


Data and Privacy

See Privacy Policy for data handling details
We use industry-standard security measures
Data stored securely on Supabase infrastructure


Modifications to Terms

We may update Terms with notice
Continued use constitutes acceptance


Governing Law

[Your State/Country] law governs these Terms


Contact

Questions: support@[yourdomain].com



Styling:

Simple, readable format
Use proper heading hierarchy (h2, h3)
Max width container for readability
Prose styling with Tailwind Typography plugin


3. Create Refund Policy Page (app/refund-policy/page.tsx)
Create page at /refund-policy with:
Title: "Refund Policy"
Last Updated: [Current Date]
Content:
14-Day Free Trial

All new customers receive a 14-day free trial
No credit card required to start trial
Cancel anytime during trial with zero charges

Monthly Subscription Refunds

No refunds for partial months of service
If you cancel, service continues until end of current billing period
No charges after cancellation

Annual Subscription Refunds (if offering annual plans)

Refunds available within first 30 days, prorated
After 30 days, no refunds but you may cancel future renewals

Billing Errors

If incorrectly charged, contact support@[yourdomain].com within 30 days
We will investigate and refund if error confirmed

Service Issues

If service is unavailable for 24+ consecutive hours due to our error, contact us
We may issue prorated credit at our discretion

How to Request Refund

Email: support@[yourdomain].com
Include: Account email, reason for refund, date of charge
Response within 5 business days
Approved refunds processed within 10 business days

Contact:

Email: support@[yourdomain].com


4. Create Privacy Policy Page (app/privacy/page.tsx)
Create page at /privacy with:
Title: "Privacy Policy"
Last Updated: [Current Date]
Company Information:
[YOUR LEGAL NAME / COMPANY NAME] ("we", "us", "our")
operates PropAuto (the "Service").
Include these sections:

Information We Collect
Information you provide:

Account information (name, email, company name)
Property data (CSV uploads: transaction data, property names, addresses)
Payment information (processed by Paddle, we don't store card details)

Automatically collected:

Usage data (pages visited, features used)
Device information (browser type, IP address)
Cookies for authentication and analytics


How We Use Your Information

Provide the Service (generate reports, send emails)
Process payments via Paddle
Send service-related emails (reports, notifications)
Improve the Service
Comply with legal obligations


Data Storage and Security

Data stored on Supabase (PostgreSQL database)
PDF reports stored on Supabase Storage with encryption
Backups stored on Cloudflare R2
Industry-standard security measures (SSL, encryption at rest)
Regular security audits


Data Sharing
We share data with:

Paddle (payment processing) - see Paddle's privacy policy
Resend (email delivery) - see Resend's privacy policy
Supabase (hosting) - see Supabase's privacy policy

We do NOT:

Sell your data to third parties
Share data with advertisers
Use data for purposes other than providing the Service


Your Data Rights
You have the right to:

Access your data (export from dashboard)
Correct inaccurate data (update in settings)
Delete your data (cancel account, data deleted within 30 days)
Export your data (download CSV of all uploaded data)
Opt out of marketing emails (unsubscribe link in emails)


Data Retention

Active account data: Retained while account is active
Deleted account data: Deleted within 30 days of account closure
Backups: May persist for 90 days in backup systems


Cookies

Essential cookies: For authentication (required)
Analytics cookies: For usage tracking (optional, can opt out)
No third-party advertising cookies


Children's Privacy

Service not intended for users under 18
We do not knowingly collect data from minors


International Data Transfers

Data stored on servers in [US/EU - specify based on Supabase region]
If you're outside this region, your data may be transferred internationally


Changes to Privacy Policy

We may update this policy
Notice provided via email or in-app notification
Continued use constitutes acceptance


Contact Us

Questions: privacy@[yourdomain].com
Data requests: privacy@[yourdomain].com



GDPR Compliance Note (if serving EU customers):

Right to be forgotten
Data portability
Consent management
Data protection officer contact (if applicable)


5. Update Footer Navigation (components/footer.tsx or app layout)
Create or update footer component to include links:
tsx<footer className="border-t bg-gray-50 py-8">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      
      <div>
        <h3 className="font-semibold mb-3">Product</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li><Link href="/pricing">Pricing</Link></li>
          <li><Link href="/features">Features</Link></li>
          <li><Link href="/help">Help Center</Link></li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Company</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Legal</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li><Link href="/terms">Terms & Conditions</Link></li>
          <li><Link href="/privacy">Privacy Policy</Link></li>
          <li><Link href="/refund-policy">Refund Policy</Link></li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Contact</h3>
        <p className="text-sm text-gray-600">
          Email: support@propauto.com<br/>
          [Your Company Name]<br/>
          [City, State]
        </p>
      </div>

    </div>

    <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
      © {new Date().getFullYear()} [Your Company Name]. All rights reserved.
    </div>
  </div>
</footer>
Include this footer on all public pages (landing page, pricing, auth pages, legal pages).

6. Update Landing Page (app/page.tsx)
Add these sections if not already present:
Product Description Section:
tsx<section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-8">
      Automated Property Owner Reports
    </h2>
    <p className="text-lg text-center max-w-3xl mx-auto mb-12">
      PropAuto saves property managers 20+ hours per month by automatically 
      generating and sending professional financial reports to property owners. 
      Upload your data, generate reports, and deliver via email—all in minutes.
    </p>
  </div>
</section>
Pricing Preview Section:
tsx<section className="py-16 bg-gray-50">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
    <p className="text-xl mb-8">Starting at $3/unit per month</p>
    <Link 
      href="/pricing" 
      className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
    >
      View Full Pricing
    </Link>
  </div>
</section>
Features Section:
Already covered in requirements above.

7. SSL Certificate Verification
The site must be HTTPS. Since we're using Vercel:
No code changes needed - Vercel automatically provisions SSL certificates for all domains.
Verify:

Custom domain added in Vercel dashboard
Domain DNS points to Vercel
SSL shows as "Active" in Vercel project settings


8. Navigation Updates
Update main navigation (in app/layout.tsx or components/header.tsx) to include:
tsx<nav>
  <Link href="/">Home</Link>
  <Link href="/pricing">Pricing</Link>
  <Link href="/features">Features</Link>
  <Link href="/auth/login">Login</Link>
  <Link href="/auth/signup">Get Started</Link>
</nav>
```

---

## Important Notes:

1. **Replace Placeholders:**
   - [YOUR LEGAL NAME / COMPANY NAME] - Use your actual business name
   - [yourdomain].com - Use your actual domain
   - [City, State] - Your business location

2. **Email Addresses:**
   Create these email forwards (via your domain registrar or email provider):
   - support@yourdomain.com
   - legal@yourdomain.com
   - privacy@yourdomain.com
   
   All can forward to the same inbox initially.

3. **Existing Routes:**
   Do NOT modify:
   - /dashboard/* (customer dashboard)
   - /admin/* (admin panel)
   - /auth/* (authentication)
   - /api/* (API routes)
   
   Only ADD new public pages.

4. **Styling Consistency:**
   - Use same Tailwind classes as existing pages
   - Reuse components from /components/ui if available
   - Match existing typography and color scheme

5. **Mobile Responsive:**
   All new pages must work on mobile (Tailwind's responsive classes)

---

## Testing Checklist:

After implementation, verify:

- [ ] /pricing page loads, calculator works
- [ ] /terms page loads, all sections present, company name included
- [ ] /privacy page loads, all sections present
- [ ] /refund-policy page loads
- [ ] Footer links work on all pages
- [ ] Landing page includes product description and pricing preview
- [ ] Navigation includes Pricing link
- [ ] All legal pages accessible via footer
- [ ] Site is HTTPS (padlock in browser)
- [ ] Mobile responsive (test on phone)
- [ ] No broken links
- [ ] Existing dashboard/auth still works (not broken)

---

## File Structure After Implementation:
```
app/
├── page.tsx (landing - updated)
├── pricing/
│   └── page.tsx (new)
├── terms/
│   └── page.tsx (new)
├── privacy/
│   └── page.tsx (new)
├── refund-policy/
│   └── page.tsx (new)
├── layout.tsx (updated with footer)
components/
├── footer.tsx (new or updated)
└── header.tsx (updated navigation)

Deployment:
After creating these pages:

Test locally: npm run dev
Verify all pages load
Deploy to Vercel: git push (auto-deploys)
Verify HTTPS is active on production
Screenshot pricing page for Paddle submission
Submit domain to Paddle for review


Do NOT:

Break existing authentication flows
Modify dashboard routes
Change database schema
Modify Paddle webhook handlers
Remove any existing components

ONLY ADD:

New public pages (pricing, terms, privacy, refund)
Footer component
Navigation updates

PROMPT END

AFTER ANTIGRAVITY BUILDS THIS
Checklist Before Submitting to Paddle:

Fill in placeholders:

 Replace [YOUR LEGAL NAME] with actual name in Terms & Conditions
 Replace [yourdomain].com with your actual domain in all pages
 Add your business address in footer
 Set up email forwards (support@, legal@, privacy@)


Take screenshots for Paddle:

 Screenshot of pricing page (full page)
 Screenshot showing footer with legal links visible
 Screenshot of one legal page (Terms or Privacy)


Deploy to production:

 Push to GitHub
 Verify Vercel deployment successful
 Check HTTPS certificate active (green padlock)
 Test all links on live site


Submit to Paddle:

Go to Paddle dashboard
Navigate to merchant approval section
Provide your domain URL
Upload screenshots
Submit for review


Approval timeline:

Paddle typically reviews within 1-3 business days
They may ask for clarifications (respond promptly)
Once approved, you can accept real payments




IMPORTANT LEGAL DISCLAIMER
I'm not a lawyer. The legal pages provided are templates based on common SaaS terms.
Before going live, consider:

Having a lawyer review Terms & Conditions (costs ~$500-1,000)
Ensuring Privacy Policy complies with GDPR (if serving EU customers)
Checking state-specific requirements for your business location

For MVP/Paddle approval, these templates are sufficient.
For production with paying customers, get legal review.