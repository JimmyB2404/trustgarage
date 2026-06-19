// Alleen weergave-bedragen — dit bestand wordt ook door client components geïmporteerd, dus
// de Stripe Price ID's (test/live verschillen) horen hier niet in, alleen server-side in de
// checkout-route, gevoed door env vars (STRIPE_PRICE_PREMIUM/STRIPE_PRICE_BUSINESS).
export const PLAN_PRICING = {
  premium: { amount: 39 },
  business: { amount: 89 },
} as const

export type PaidPlan = keyof typeof PLAN_PRICING
