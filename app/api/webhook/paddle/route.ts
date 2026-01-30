import { NextRequest, NextResponse } from 'next/server'
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

        const supabase = await createClient()

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
