import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { garageId, plan } = await req.json()

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey || stripeKey === 'your_stripe_secret_key_here') {
    return NextResponse.json(
      { error: 'Stripe is nog niet geconfigureerd. Voeg STRIPE_SECRET_KEY toe aan .env.local' },
      { status: 503 }
    )
  }

  // Real implementation:
  // const stripe = new Stripe(stripeKey)
  // const session = await stripe.checkout.sessions.create({ ... })
  // return NextResponse.json({ url: session.url })

  return NextResponse.json({ url: '/dashboard?upgrade=pending' })
}
