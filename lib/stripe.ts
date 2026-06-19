import Stripe from 'stripe'

// Pas hier aanmaken, niet op module-niveau — anders crasht elk bestand dat dit importeert
// zodra STRIPE_SECRET_KEY ontbreekt (zelfde les als bij lib/resend.ts).
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key || key === 'your_stripe_secret_key_here') {
    throw new Error('Stripe is nog niet geconfigureerd.')
  }
  return new Stripe(key)
}
