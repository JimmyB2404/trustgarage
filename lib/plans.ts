export const PLAN_PRICING = {
  premium: { amount: 39, stripePriceId: 'price_1Tk8KSH1uSjryMmZgRfHZt53' },
  business: { amount: 89, stripePriceId: 'price_1Tk8L3H1uSjryMmZ1wqew7S4' },
} as const

export type PaidPlan = keyof typeof PLAN_PRICING
