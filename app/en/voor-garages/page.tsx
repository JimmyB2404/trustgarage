import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  IconCircleCheck,
  IconStar,
  IconLanguage,
  IconCheck,
} from '@tabler/icons-react'
import { PLAN_PRICING } from '@/lib/plans'

export const metadata: Metadata = {
  title: 'For Garages',
  description:
    'Register your garage for free on TrustGarage.nl. Increase your online visibility, get more reviews and reach expat customers.',
  alternates: { canonical: '/en/voor-garages', languages: { nl: '/voor-garages', en: '/en/voor-garages' } },
}

// ─── Data ────────────────────────────────────────────────────────────────────

const benefits = [
  {
    icon: <IconCircleCheck size={40} className="text-primary" />,
    title: 'KVK verified',
    description: 'Build trust with your official KVK verification.',
  },
  {
    icon: <IconStar size={40} className="text-primary" />,
    title: 'More reviews',
    description: 'Receive more reviews from satisfied customers.',
  },
  {
    icon: <IconLanguage size={40} className="text-primary" />,
    title: 'Expat customers',
    description: 'Reach international customers who speak English.',
  },
]

const plans = [
  {
    name: 'Free',
    price: '0',
    period: 'mo',
    featured: false,
    cta: 'Sign up for free',
    ctaVariant: 'primary' as const,
    href: '/garage/aanmelden',
    features: [
      'Listing in search results',
      'Basic profile with contact details',
      'List up to 3 services',
      'Customers can leave reviews',
      '1 photo',
    ],
    notIncluded: [
      'Reply to reviews',
      'Statistics and insights',
      'Priority in search results',
      'Unlimited photos',
    ],
  },
  {
    name: 'Premium',
    price: String(PLAN_PRICING.premium.amount),
    period: 'mo',
    featured: true,
    cta: 'Choose Premium',
    ctaVariant: 'primary' as const,
    href: '/garage/aanmelden',
    features: [
      'Everything in Free',
      'Reply to reviews',
      'List up to 10 services',
      'Statistics and insights',
      'Up to 10 photos',
      'Priority in search results',
      'KVK verification badge',
    ],
    notIncluded: [
      'Featured profile',
      'Dedicated account manager',
    ],
  },
  {
    name: 'Business',
    price: String(PLAN_PRICING.business.amount),
    period: 'mo',
    featured: false,
    cta: 'Choose Business',
    ctaVariant: 'secondary' as const,
    href: '/garage/aanmelden',
    features: [
      'Everything in Premium',
      'Unlimited photos',
      'Unlimited services',
      'Featured profile',
      'Dedicated account manager',
      'Early access to new features',
      'Advanced statistics',
    ],
    notIncluded: [],
  },
]

const steps = [
  {
    number: '1',
    title: 'Sign up',
    description: 'Create a free account with your email address.',
  },
  {
    number: '2',
    title: 'Verify KVK',
    description: 'Verify your business with your KVK number for extra trust.',
  },
  {
    number: '3',
    title: 'Complete your profile',
    description: 'Add opening hours, services and photos to your profile.',
  },
  {
    number: '4',
    title: 'Get customers',
    description: 'Get found by locals and expats in your region.',
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function VoorGaragesPageEn() {
  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-primary-dark text-white py-20">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <p className="text-[13px] font-medium text-white/60 uppercase tracking-widest mb-4">
            For garages
          </p>
          <h1 className="text-[34px] sm:text-[36px] font-normal font-serif text-white leading-tight mb-5">
            Reach more customers<br />with TrustGarage
          </h1>
          <p className="text-white/80 text-[16px] leading-[1.7] max-w-lg mb-8">
            Register your garage for free and increase your online visibility. Let
            satisfied customers speak for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/garage/aanmelden"
              className="inline-flex items-center justify-center rounded-md px-6 py-[11px] text-[14px] font-medium transition-colors duration-150 bg-white text-primary hover:bg-primary-light"
            >
              Sign up for free
            </Link>
            <a
              href="#plannen"
              className="inline-flex items-center justify-center rounded-md px-6 py-[11px] text-[14px] font-medium transition-colors duration-150 border border-white text-white hover:bg-white/10"
            >
              More information
            </a>
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 mb-10 text-center">
            Why TrustGarage?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="card p-6 text-center flex flex-col items-center gap-4">
                {b.icon}
                <h3 className="text-[16px] font-medium text-neutral-900">{b.title}</h3>
                <p className="text-[14px] text-neutral-500 leading-[1.6]">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="plannen" className="bg-surface py-16">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 mb-2 text-center">
            Choose your plan
          </h2>
          <p className="text-[14px] text-neutral-500 text-center mb-10">
            Start for free and upgrade as your business grows.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-xl p-6 flex flex-col gap-5 transition-all duration-150 ${
                  plan.featured
                    ? 'border-2 border-primary shadow-card-hover'
                    : 'border border-neutral-100 shadow-card'
                }`}
              >
                {plan.featured && (
                  <span className="self-start inline-flex items-center bg-primary-light text-primary text-[11px] font-medium px-2 py-[3px] rounded-sm">
                    Most popular
                  </span>
                )}

                <div>
                  <p className="text-[13px] font-medium text-neutral-500 mb-1">{plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[32px] font-semibold text-neutral-900 font-serif">
                      €{plan.price}
                    </span>
                    <span className="text-[14px] text-neutral-500">/{plan.period}</span>
                  </div>
                </div>

                <ul className="flex flex-col gap-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-neutral-900">
                      <IconCheck size={16} className="text-primary mt-[2px] shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-neutral-300">
                      <IconCheck size={16} className="text-neutral-300 mt-[2px] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-auto text-center rounded-md px-5 py-[10px] text-[14px] font-medium transition-colors duration-150 ${
                    plan.ctaVariant === 'primary'
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-transparent text-primary border border-primary hover:bg-primary-light'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 mb-10 text-center">
            How does it work?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center text-center gap-4">
                {/* Number circle + connector line */}
                <div className="relative flex items-center justify-center w-full">
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute left-1/2 top-5 w-full h-px bg-neutral-100" />
                  )}
                  <div className="relative z-10 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-[15px] font-semibold font-serif shrink-0">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-[15px] font-medium text-neutral-900">{step.title}</h3>
                <p className="text-[13px] text-neutral-500 leading-[1.6]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-site mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-white/80 text-[15px] mb-8 max-w-md mx-auto">
            Register your garage for free today and get found by new customers.
          </p>
          <Link
            href="/garage/aanmelden"
            className="inline-flex items-center justify-center rounded-md px-6 py-[11px] text-[14px] font-medium transition-colors duration-150 bg-white text-primary hover:bg-primary-light"
          >
            Sign up for free
          </Link>
        </div>
      </section>

      <Footer locale="en" />
    </>
  )
}
