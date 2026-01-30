'use client'

import { initializePaddle, Paddle } from '@paddle/paddle-js'

let paddleInstance: Paddle | undefined | null = null

export async function getPaddleInstance() {
    if (paddleInstance) return paddleInstance

    const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN

    if (!clientToken) {
        console.error('Paddle Client Token is missing. Please check .env.local')
        return null
    }

    paddleInstance = await initializePaddle({
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
        token: clientToken,
        eventCallback: (data) => {
            // Optional: Log lifecycle events for debugging
            // console.log('Paddle Event:', data)
        }
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
