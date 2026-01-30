# Gap Remediation Gameplan

Paste your plan here...
Mission: Fix Critical Gaps in PropAuto Without Breaking Existing Functionality
You are improving an existing Next.js 14 SaaS application called PropAuto. This app automates property owner report generation for property managers.
CRITICAL RULE: Do NOT modify or break existing functionality. Only ADD new features and OPTIMIZE existing code where specified.

Current Tech Stack (DO NOT CHANGE):

Next.js 14 (App Router)
Supabase (PostgreSQL + Auth + Storage)
Paddle (Billing)
Resend (Email)
Cloudflare R2 (Backups)
TypeScript + Tailwind CSS


Current Database Schema (Reference Only - Don't Recreate):
sql-- These tables already exist:
customers (id, user_id, company_name, unit_count, price_per_unit, 
          paddle_customer_id, paddle_subscription_id, status, created_at)
properties (id, customer_id, property_name, address, unit_count)
reports (id, customer_id, property_id, report_month, report_year, 
        pdf_url, status, generated_at, sent_at)
property_data (id, customer_id, property_id, transaction_date, 
              category, description, amount, transaction_type)

PHASE 1: VERIFY AND FIX PADDLE BILLING (CRITICAL - DO FIRST)
Task 1.1: Check if Paddle Integration Exists
First, verify these files exist:

lib/paddle/checkout.ts
app/api/webhook/paddle/route.ts

If these files DO NOT exist, create them as follows:

Create lib/paddle/checkout.ts
typescript'use client'

import { initializePaddle, Paddle } from '@paddle/paddle-js'

let paddleInstance: Paddle | null = null

export async function getPaddleInstance() {
  if (paddleInstance) return paddleInstance

  paddleInstance = await initializePaddle({
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
  })

  return paddleInstance
}

export async function openCheckout({
  unitCount,
  customerId,
  email,
}: {
  unitCount: number
  customerId: string
  email: string
}) {
  const paddle = await getPaddleInstance()

  if (!paddle) {
    console.error('Paddle not initialized')
    return
  }

  paddle.Checkout.open({
    items: [
      {
        priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID!,
        quantity: unitCount,
      },
    ],
    customer: {
      email: email,
    },
    customData: {
      customerId: customerId,
    },
    settings: {
      successUrl: `${window.location.origin}/dashboard?payment=success`,
      displayMode: 'overlay',
    },
  })
}

export async function openCustomerPortal(customerId: string) {
  const paddle = await getPaddleInstance()

  if (!paddle) {
    console.error('Paddle not initialized')
    return
  }

  // Note: Customer portal URL must be configured in Paddle dashboard
  // For now, redirect to Paddle's default portal
  window.open('https://customers.paddle.com/', '_blank')
}

Create app/api/webhook/paddle/route.ts
typescriptimport { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('paddle-signature')

    if (!signature) {
      return new Response('No signature provided', { status: 401 })
    }

    // Verify webhook signature
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET!
    
    // Parse signature header
    const signatureParts = signature.split(';')
    let timestamp = ''
    let hash = ''
    
    for (const part of signatureParts) {
      const [key, value] = part.split('=')
      if (key === 'ts') timestamp = value
      if (key === 'h1') hash = value
    }

    // Verify signature
    const expectedHash = crypto
      .createHmac('sha256', webhookSecret)
      .update(timestamp + ':' + body)
      .digest('hex')

    if (hash !== expectedHash) {
      console.error('Invalid webhook signature')
      return new Response('Invalid signature', { status: 401 })
    }

    // Parse event
    const event = JSON.parse(body)
    console.log('Received Paddle webhook:', event.event_type)

    const supabase = createClient()

    // Handle different event types
    switch (event.event_type) {
      case 'subscription.created':
        await handleSubscriptionCreated(supabase, event)
        break

      case 'subscription.updated':
        await handleSubscriptionUpdated(supabase, event)
        break

      case 'subscription.payment_succeeded':
        await handlePaymentSucceeded(supabase, event)
        break

      case 'subscription.payment_failed':
        await handlePaymentFailed(supabase, event)
        break

      case 'subscription.canceled':
        await handleSubscriptionCanceled(supabase, event)
        break

      default:
        console.log('Unhandled event type:', event.event_type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook processing failed', { status: 500 })
  }
}

async function handleSubscriptionCreated(supabase: any, event: any) {
  const customerId = event.data.custom_data?.customerId

  if (!customerId) {
    console.error('No customerId in webhook data')
    return
  }

  await supabase
    .from('customers')
    .update({
      paddle_subscription_id: event.data.id,
      paddle_customer_id: event.data.customer_id,
      status: 'active',
    })
    .eq('id', customerId)

  console.log(`Subscription created for customer ${customerId}`)
}

async function handleSubscriptionUpdated(supabase: any, event: any) {
  // Update unit count if quantity changed
  const newQuantity = event.data.items?.[0]?.quantity

  if (newQuantity) {
    await supabase
      .from('customers')
      .update({
        unit_count: newQuantity,
        status: 'active',
      })
      .eq('paddle_subscription_id', event.data.id)

    console.log(`Subscription updated: new quantity ${newQuantity}`)
  }
}

async function handlePaymentSucceeded(supabase: any, event: any) {
  await supabase
    .from('customers')
    .update({ status: 'active' })
    .eq('paddle_subscription_id', event.data.subscription_id)

  console.log('Payment succeeded')
}

async function handlePaymentFailed(supabase: any, event: any) {
  await supabase
    .from('customers')
    .update({ status: 'past_due' })
    .eq('paddle_subscription_id', event.data.subscription_id)

  console.log('Payment failed - marked as past_due')

  // TODO: Send email notification to customer
}

async function handleSubscriptionCanceled(supabase: any, event: any) {
  // Get customer details before updating
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('paddle_subscription_id', event.data.id)
    .single()

  if (customer) {
    // Update customer status
    await supabase
      .from('customers')
      .update({ status: 'canceled' })
      .eq('id', customer.id)

    // Log churn
    await supabase.from('churn_records').insert({
      customer_id: customer.id,
      churn_date: new Date().toISOString(),
      mrr_lost: customer.unit_count * customer.price_per_unit,
      primary_reason: 'subscription_canceled',
    })

    console.log(`Subscription canceled for customer ${customer.id}`)
  }
}

Create or Update app/dashboard/billing/page.tsx
If this file exists, UPDATE the "Subscribe" button section. If it doesn't exist, create it:
typescript'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { openCheckout, openCustomerPortal } from '@/lib/paddle/checkout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function BillingPage() {
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadCustomer()
  }, [])

  async function loadCustomer() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      setCustomer(data)
    }
    setLoading(false)
  }

  function calculateMonthlyCost(units: number): number {
    if (units <= 100) return units * 3.00
    if (units <= 300) return (100 * 3.00) + ((units - 100) * 2.50)
    if (units <= 500) return (100 * 3.00) + (200 * 2.50) + ((units - 300) * 2.00)
    return (100 * 3.00) + (200 * 2.50) + (200 * 2.00) + ((units - 500) * 1.50)
  }

  async function handleSubscribe() {
    if (!customer) return

    const { data: { user } } = await supabase.auth.getUser()
    
    await openCheckout({
      unitCount: customer.unit_count,
      customerId: customer.id,
      email: user?.email || '',
    })
  }

  async function handleManageBilling() {
    if (customer?.paddle_customer_id) {
      await openCustomerPortal(customer.paddle_customer_id)
    }
  }

  if (loading) return <div>Loading...</div>

  if (!customer) return <div>Customer not found</div>

  const monthlyCost = calculateMonthlyCost(customer.unit_count)

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Billing</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Units Managed:</span>
              <span className="font-semibold">{customer.unit_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Cost:</span>
              <span className="font-semibold">${monthlyCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-semibold capitalize ${
                customer.status === 'active' ? 'text-green-600' : 'text-red-600'
              }`}>
                {customer.status}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {customer.status === 'active' ? (
              <Button onClick={handleManageBilling} className="w-full">
                Manage Billing
              </Button>
            ) : (
              <Button onClick={handleSubscribe} className="w-full">
                Subscribe Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span>1-100 units</span>
              <span>$3.00/unit</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>101-300 units</span>
              <span>$2.50/unit</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>301-500 units</span>
              <span>$2.00/unit</span>
            </div>
            <div className="flex justify-between py-2">
              <span>501+ units</span>
              <span>$1.50/unit</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

Add Required Environment Variables
Update .env.local with:
bash# Paddle (get these from Paddle dashboard)
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your_paddle_client_token
NEXT_PUBLIC_PADDLE_PRICE_ID=your_paddle_price_id
PADDLE_WEBHOOK_SECRET=your_paddle_webhook_secret
Note: If these variables already exist, don't duplicate them.

Task 1.2: Configure Paddle Webhook URL
Manual step (document in README.md):

Go to Paddle Dashboard → Developer Tools → Webhooks
Add webhook endpoint: https://yourdomain.com/api/webhook/paddle
Subscribe to events:

subscription.created
subscription.updated
subscription.payment_succeeded
subscription.payment_failed
subscription.canceled


Copy webhook secret to .env.local as PADDLE_WEBHOOK_SECRET


PHASE 2: OPTIMIZE REPORT GENERATION FOR SCALABILITY
Task 2.1: Add Tracking Columns to Database
Create a new Supabase migration file:
File: supabase/migrations/add_report_tracking.sql
sql-- Add columns to track which customers have been processed each month
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS last_report_generated_month INTEGER,
ADD COLUMN IF NOT EXISTS last_report_generated_year INTEGER;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_customers_report_tracking 
ON customers(last_report_generated_month, last_report_generated_year);

Task 2.2: Update Monthly Report Cron Job
Find and UPDATE the file: app/api/cron/monthly-reports/route.ts
Replace the entire file content with this optimized version:
typescriptimport { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generatePropertyReport } from '@/lib/reports/generator'
import { sendReportEmail } from '@/lib/email/sender'

const BATCH_SIZE = 10 // Process 10 customers per run to avoid timeout

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient()
  
  // Get current month/year
  const now = new Date()
  const currentMonth = now.getMonth() + 1 // 1-12
  const currentYear = now.getFullYear()

  // Find customers who haven't been processed this month yet
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*, properties(*)')
    .eq('status', 'active')
    .or(`last_report_generated_month.is.null,last_report_generated_month.neq.${currentMonth}`)
    .limit(BATCH_SIZE)

  if (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!customers || customers.length === 0) {
    return NextResponse.json({ 
      message: 'All customers processed for this month',
      processed: 0 
    })
  }

  const results = []

  for (const customer of customers) {
    try {
      // Check if customer has properties
      if (!customer.properties || customer.properties.length === 0) {
        results.push({
          customer: customer.company_name,
          status: 'skipped',
          reason: 'no_properties'
        })
        continue
      }

      // Process each property
      for (const property of customer.properties) {
        try {
          // Check if there's data for last month
          const lastMonth = new Date(currentYear, currentMonth - 2, 1) // Previous month
          const { data: hasData } = await supabase
            .from('property_data')
            .select('id')
            .eq('property_id', property.id)
            .gte('transaction_date', lastMonth.toISOString().split('T')[0])
            .limit(1)

          if (!hasData || hasData.length === 0) {
            results.push({
              customer: customer.company_name,
              property: property.property_name,
              status: 'skipped',
              reason: 'no_data'
            })
            continue
          }

          // Generate report
          const pdfUrl = await generatePropertyReport({
            customerId: customer.id,
            propertyId: property.id,
            month: currentMonth - 1, // Previous month
            year: currentMonth === 1 ? currentYear - 1 : currentYear,
          })

          // Send email
          await sendReportEmail({
            to: [customer.contact_email || ''],
            customerName: customer.company_name,
            propertyName: property.property_name,
            month: currentMonth - 1,
            year: currentMonth === 1 ? currentYear - 1 : currentYear,
            pdfUrl,
          })

          results.push({
            customer: customer.company_name,
            property: property.property_name,
            status: 'success'
          })
        } catch (propertyError) {
          console.error(`Error processing property ${property.id}:`, propertyError)
          results.push({
            customer: customer.company_name,
            property: property.property_name,
            status: 'failed',
            error: propertyError instanceof Error ? propertyError.message : 'Unknown error'
          })
        }
      }

      // Mark customer as processed for this month
      await supabase
        .from('customers')
        .update({
          last_report_generated_month: currentMonth,
          last_report_generated_year: currentYear,
        })
        .eq('id', customer.id)

      results.push({
        customer: customer.company_name,
        status: 'completed'
      })
    } catch (customerError) {
      console.error(`Error processing customer ${customer.id}:`, customerError)
      results.push({
        customer: customer.company_name,
        status: 'failed',
        error: customerError instanceof Error ? customerError.message : 'Unknown error'
      })
    }
  }

  // Log to automation_logs table if it exists
  try {
    await supabase.from('automation_logs').insert({
      log_date: new Date().toISOString(),
      automation_type: 'Monthly Report Generation',
      status: results.every(r => r.status === 'success' || r.status === 'skipped') ? 'success' : 'partial',
      records_processed: results.length,
      records_failed: results.filter(r => r.status === 'failed').length,
    })
  } catch (logError) {
    // If automation_logs doesn't exist, just log to console
    console.log('Could not log to automation_logs:', logError)
  }

  return NextResponse.json({
    processed: customers.length,
    hasMore: customers.length === BATCH_SIZE,
    results,
    nextRun: customers.length === BATCH_SIZE 
      ? 'Run again in 10 minutes to process next batch'
      : 'All customers processed for this month'
  })
}

Task 2.3: Update Cron Schedule in vercel.json
Find and UPDATE vercel.json:
json{
  "crons": [
    {
      "path": "/api/cron/monthly-reports",
      "schedule": "*/10 2-4 1 * *"
    },
    {
      "path": "/api/cron/health-check",
      "schedule": "0 8 * * *"
    }
  ]
}
Explanation:

*/10 2-4 1 * * = Run every 10 minutes between 2-4 AM on the 1st of each month
This allows processing in batches without hitting timeout
Automatically stops when all customers processed


PHASE 3: IMPROVE CSV PROPERTY MATCHING
Task 3.1: Create Property Name Normalization Utility
Create new file: lib/csv/normalize.ts
typescript/**
 * Normalizes property names for fuzzy matching
 * Example: "Sunset Blvd." → "sunset"
 */
export function normalizePropertyName(name: string): string {
  if (!name) return ''
  
  return name
    .toLowerCase()
    .trim()
    // Remove common street abbreviations
    .replace(/\b(street|st|avenue|ave|boulevard|blvd|road|rd|drive|dr|lane|ln|court|ct|place|pl)\b\.?/gi, '')
    // Remove apartment/unit numbers
    .replace(/\b(apt|apartment|unit|#)\s*\w+/gi, '')
    // Remove all special characters and spaces
    .replace(/[^a-z0-9]/g, '')
}

/**
 * Calculates similarity between two strings (0-1, 1 = identical)
 */
export function stringSimilarity(str1: string, str2: string): number {
  const s1 = normalizePropertyName(str1)
  const s2 = normalizePropertyName(str2)
  
  if (s1 === s2) return 1
  if (s1.length === 0 || s2.length === 0) return 0
  
  // Simple substring matching for now
  if (s1.includes(s2) || s2.includes(s1)) return 0.8
  
  // Check if first 5 characters match
  if (s1.substring(0, 5) === s2.substring(0, 5)) return 0.6
  
  return 0
}

/**
 * Find best matching property from a list
 */
export function findBestMatch(
  csvPropertyName: string,
  existingProperties: Array<{ id: string; property_name: string }>
): { match: any; confidence: number } | null {
  let bestMatch = null
  let highestConfidence = 0

  for (const property of existingProperties) {
    const confidence = stringSimilarity(csvPropertyName, property.property_name)
    
    if (confidence > highestConfidence) {
      highestConfidence = confidence
      bestMatch = property
    }
  }

  // Only return match if confidence is high enough
  if (highestConfidence >= 0.8) {
    return { match: bestMatch, confidence: highestConfidence }
  }

  return null
}

Task 3.2: Update CSV Parser to Use Normalization
Find and UPDATE lib/csv/parser.ts:
Add these imports at the top:
typescriptimport { normalizePropertyName, findBestMatch } from './normalize'
Then update the property matching logic:
Find the section where properties are matched (likely in parseCSV or similar function) and replace with:
typescriptasync function matchPropertyFromCSV(
  csvPropertyName: string,
  customerId: string,
  supabase: any
): Promise<string | null> {
  // Get all properties for this customer
  const { data: properties } = await supabase
    .from('properties')
    .select('id, property_name')
    .eq('customer_id', customerId)

  if (!properties || properties.length === 0) {
    return null
  }

  // Try exact match first
  const exactMatch = properties.find(
    p => p.property_name.toLowerCase().trim() === csvPropertyName.toLowerCase().trim()
  )
  
  if (exactMatch) {
    return exactMatch.id
  }

  // Try fuzzy match
  const fuzzyMatch = findBestMatch(csvPropertyName, properties)
  
  if (fuzzyMatch && fuzzyMatch.confidence >= 0.8) {
    console.log(`Fuzzy matched "${csvPropertyName}" to "${fuzzyMatch.match.property_name}" (confidence: ${fuzzyMatch.confidence})`)
    return fuzzyMatch.match.id
  }

  // No match found
  return null
}

Task 3.3: Create Manual Review Page for Unmatched Properties
Create new file: app/dashboard/upload/review/page.tsx
typescript'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface UnmatchedRow {
  csvPropertyName: string
  transactionData: any
  possibleMatches: Array<{ id: string; property_name: string; confidence: number }>
}

export default function ReviewPage() {
  const [unmatchedRows, setUnmatchedRows] = useState<UnmatchedRow[]>([])
  const [mappings, setMappings] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    // Load unmatched data from sessionStorage (set during upload)
    const unmatchedData = sessionStorage.getItem('unmatchedProperties')
    if (unmatchedData) {
      setUnmatchedRows(JSON.parse(unmatchedData))
    }
    setLoading(false)
  }, [])

  async function handleSaveWithMappings() {
    setSaving(true)
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get customer
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!customer) throw new Error('Customer not found')

      // Process each unmatched row
      for (let i = 0; i < unmatchedRows.length; i++) {
        const row = unmatchedRows[i]
        const selectedPropertyId = mappings[i]

        if (!selectedPropertyId) continue

        // If user selected "CREATE_NEW", create new property
        if (selectedPropertyId === 'CREATE_NEW') {
          const { data: newProperty } = await supabase
            .from('properties')
            .insert({
              customer_id: customer.id,
              property_name: row.csvPropertyName,
              unit_count: 1, // Default, user can update later
            })
            .select()
            .single()

          if (newProperty) {
            // Save transaction data with new property ID
            await saveTransactionData(row.transactionData, newProperty.id, customer.id)
          }
        } else {
          // Save transaction data with selected property ID
          await saveTransactionData(row.transactionData, selectedPropertyId, customer.id)
        }
      }

      // Clear session storage
      sessionStorage.removeItem('unmatchedProperties')

      // Redirect to dashboard with success message
      router.push('/dashboard?upload=success')
    } catch (error) {
      console.error('Error saving mappings:', error)
      alert('Failed to save mappings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function saveTransactionData(transactionData: any, propertyId: string, customerId: string) {
    const { error } = await supabase.from('property_data').insert({
      customer_id: customerId,
      property_id: propertyId,
      transaction_date: transactionData.date,
      category: transactionData.category,
      description: transactionData.description,
      amount: transactionData.amount,
      transaction_type: transactionData.type,
    })

    if (error) throw error
  }

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>
  }

  if (unmatchedRows.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <p>No unmatched properties to review.</p>
        <Button onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">Review Property Matches</h1>
      <p className="text-gray-600 mb-8">
        We found {unmatchedRows.length} properties in your CSV that don't exactly match existing properties. 
        Please confirm or correct the matches below.
      </p>

      <div className="space-y-4">
        {unmatchedRows.map((row, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">CSV Property: {row.csvPropertyName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {row.possibleMatches.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Possible matches:</p>
                    <ul className="text-sm list-disc list-inside mb-4">
                      {row.possibleMatches.map((match, i) => (
                        <li key={i}>
                          {match.property_name} 
                          <span className="text-gray-500"> (confidence: {(match.confidence * 100).toFixed(0)}%)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select matching property:
                  </label>
                  <Select
                    value={mappings[index] || ''}
                    onValueChange={(value) => setMappings({ ...mappings, [index]: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-- Select a property --" />
                    </SelectTrigger>
                    <SelectContent>
                      {row.possibleMatches.map((match) => (
                        <SelectItem key={match.id} value={match.id}>
                          {match.property_name}
                        </SelectItem>
                      ))}
                      <SelectItem value="CREATE_NEW">
                        ✨ Create new property: "{row.csvPropertyName}"
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <Button 
          onClick={handleSaveWithMappings} 
          disabled={saving || Object.keys(mappings).length !== unmatchedRows.length}
          className="flex-1"
        >
          {saving ? 'Saving...' : 'Confirm and Save'}
        </Button>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          Cancel
        </Button>
      </div>

      {Object.keys(mappings).length < unmatchedRows.length && (
        <p className="text-sm text-orange-600 mt-4">
          Please select a match for all {unmatchedRows.length} properties before saving.
        </p>
      )}
    </div>
  )
}

Task 3.4: Update Upload Flow to Redirect to Review
Find the upload action/page (likely app/dashboard/upload/actions.ts or app/dashboard/upload/page.tsx):
After CSV parsing, add logic to detect unmatched rows and redirect:
typescript// In your CSV upload handler, after parsing:

const { matchedTransactions, unmatchedRows } = await parseAndMatchCSV(csvFile, customerId)

// Save matched transactions
if (matchedTransactions.length > 0) {
  await supabase.from('property_data').insert(matchedTransactions)
}

// If there are unmatched rows, store in session and redirect to review
if (unmatchedRows.length > 0) {
  sessionStorage.setItem('unmatchedProperties', JSON.stringify(unmatchedRows))
  router.push('/dashboard/upload/review')
} else {
  // All matched, go straight to dashboard
  router.push('/dashboard?upload=success')
}

PHASE 4: ADD USER SETTINGS (LOGO UPLOAD)
Task 4.1: Add Logo URL Column to Database
Create Supabase migration: supabase/migrations/add_logo_support.sql
sql-- Add logo_url column to customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

Task 4.2: Update Settings Page to Include Logo Upload
Find and UPDATE app/dashboard/settings/page.tsx:
Add this section to the settings form:
typescript'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

// ... existing code ...

const [logoFile, setLogoFile] = useState<File | null>(null)
const [logoPreview, setLogoPreview] = useState<string | null>(customer?.logo_url || null)
const [uploadingLogo, setUploadingLogo] = useState(false)

async function handleLogoUpload() {
  if (!logoFile || !customer) return

  setUploadingLogo(true)

  try {
    const supabase = createClient()
    
    // Upload to Supabase Storage
    const fileExt = logoFile.name.split('.').pop()
    const fileName = `${customer.id}/logo.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('logos')
      .upload(fileName, logoFile, { 
        upsert: true,
        contentType: logoFile.type
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(fileName)

    // Update customer record
    const { error: updateError } = await supabase
      .from('customers')
      .update({ logo_url: publicUrl })
      .eq('id', customer.id)

    if (updateError) throw updateError

    setLogoPreview(publicUrl)
    alert('Logo uploaded successfully!')
  } catch (error) {
    console.error('Logo upload error:', error)
    alert('Failed to upload logo')
  } finally {
    setUploadingLogo(false)
  }
}

function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0]
  if (file) {
    setLogoFile(file)
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
}

// Add this to your settings form JSX:
<div className="space-y-4">
  <Label>Company Logo (for PDF reports)</Label>
  
  {logoPreview && (
    <div className="mb-4">
      <Image 
        src={logoPreview} 
        alt="Logo preview" 
        width={200} 
        height={100}
        className="border rounded"
      />
    </div>
  )}
  
  <Input 
    type="file" 
    accept="image/png,image/jpeg,image/jpg"
    onChange={handleFileSelect}
  />
  
  {logoFile && (
    <Button 
      onClick={handleLogoUpload}
      disabled={uploadingLogo}
    >
      {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
    </Button>
  )}
</div>

Task 4.3: Create Logos Storage Bucket in Supabase
Manual step (document in README):

Go to Supabase Dashboard → Storage
Create new bucket: logos
Make bucket public
Set allowed file types: image/png, image/jpeg, image/jpg
Set max file size: 2MB


Task 4.4: Update PDF Generator to Use Logo
Find lib/reports/document.tsx (or similar PDF generation file):
Update the header section to include logo if available:
typescriptimport { Image } from '@react-pdf/renderer'

// In your ReportDocument component:

interface ReportDocumentProps {
  propertyName: string
  month: number
  year: number
  income: any
  expenses: any
  metrics: any
  logoUrl?: string  // Add this
}

export function ReportDocument({ 
  propertyName, 
  month, 
  year, 
  income, 
  expenses, 
  metrics,
  logoUrl 
}: ReportDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logoUrl && (
            <Image 
              src={logoUrl} 
              style={styles.logo}
            />
          )}
          <Text style={styles.title}>{propertyName}</Text>
          <Text style={styles.subtitle}>Monthly Report - {month}/{year}</Text>
        </View>
        
        {/* Rest of your PDF content */}
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  // ... existing styles ...
  logo: {
    width: 100,
    height: 50,
    marginBottom: 10,
    objectFit: 'contain',
  },
})
Then update the report generator to pass logo URL:
typescript// In lib/reports/generator.ts (or wherever you call ReportDocument)

const { data: customer } = await supabase
  .from('customers')
  .select('logo_url')
  .eq('id', customerId)
  .single()

const pdfBuffer = await renderToBuffer(
  <ReportDocument 
    propertyName={data.propertyName}
    month={month}
    year={year}
    income={data.income}
    expenses={data.expenses}
    metrics={data.metrics}
    logoUrl={customer?.logo_url}  // Pass logo URL
  />
)

TESTING CHECKLIST
After implementing all changes, test these flows:
Billing Tests:

 Visit /dashboard/billing - page loads without errors
 Click "Subscribe Now" - Paddle checkout opens
 Complete test payment in Paddle sandbox
 Verify webhook received at /api/webhook/paddle (check logs)
 Verify customer status updated to 'active' in database
 Test "Manage Billing" button (opens customer portal)

Report Generation Tests:

 Manually trigger cron: curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://yourdomain.com/api/cron/monthly-reports
 Verify only 10 customers processed
 Verify last_report_generated_month updated in database
 Run cron again, verify next batch processed
 Verify cron stops when all customers processed

CSV Matching Tests:

 Upload CSV with exact property name match - should work automatically
 Upload CSV with slight variation (e.g., "Sunset Blvd" vs "Sunset Boulevard")
 Verify fuzzy match works or redirects to review page
 On review page, select correct property and save
 Verify data saved to correct property

Logo Upload Tests:

 Go to /dashboard/settings
 Upload logo (PNG or JPG, under 2MB)
 Verify logo appears in preview
 Generate test report
 Verify logo appears in PDF header


DEPLOYMENT STEPS

Run database migrations:

bash   # In Supabase dashboard, run the SQL from:
   # - add_report_tracking.sql
   # - add_logo_support.sql

Create storage bucket:

Supabase Dashboard → Storage → Create bucket "logos" (public)


Update environment variables:

Add Paddle credentials (if missing)
Add CRON_SECRET (if missing)


Deploy to Vercel:

bash   git add .
   git commit -m "Fix critical gaps: billing, scalability, CSV matching, logo upload"
   git push

Configure Paddle webhook:

Add webhook URL in Paddle dashboard
Copy secret to environment variables


Test in production:

Complete one full flow: signup → billing → upload → generate → receive email




IMPORTANT NOTES
DO NOT:

❌ Delete any existing files
❌ Modify database schema for existing tables (only ADD columns)
❌ Change existing API routes that are working
❌ Break authentication or dashboard functionality

DO:

✅ Only CREATE new files
✅ Only UPDATE files that are explicitly mentioned
✅ Only ADD new columns to database tables
✅ Test each phase before moving to the next

If anything breaks:

Revert the changes for that specific file
Report the error
We'll debug before proceeding