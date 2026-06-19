import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { IconCheck } from '@tabler/icons-react'
import { PLAN_PRICING } from '@/lib/plans'

export const metadata: Metadata = {
  title: 'Tarieven',
  description:
    'Bekijk de tarieven van TrustGarage.nl voor garagebedrijven. Begin gratis en upgrade naar Premium of Business wanneer uw bedrijf groeit.',
}

// ─── Data ────────────────────────────────────────────────────────────────────

const plans = [
  {
    name: 'Gratis',
    price: '0',
    period: 'mnd',
    featured: false,
    cta: 'Gratis aanmelden',
    ctaVariant: 'primary' as const,
    href: '/garage/aanmelden',
    features: [
      'Vermelding in zoekresultaten',
      'Basisprofiel met contactgegevens',
      'Tot 3 diensten vermelden',
      'Klanten kunnen reviews plaatsen',
      '1 foto',
    ],
    notIncluded: [
      'Reageren op reviews',
      'Statistieken en inzichten',
      'Prioriteit in zoekresultaten',
      'Onbeperkt foto\'s',
    ],
  },
  {
    name: 'Premium',
    price: String(PLAN_PRICING.premium.amount),
    period: 'mnd',
    featured: true,
    cta: 'Premium kiezen',
    ctaVariant: 'primary' as const,
    href: '/garage/aanmelden',
    features: [
      'Alles in Gratis',
      'Reageren op reviews',
      'Tot 10 diensten vermelden',
      'Statistieken en inzichten',
      'Tot 10 foto\'s',
      'Prioriteit in zoekresultaten',
      'KVK-verificatiebadge',
    ],
    notIncluded: [
      'Uitgelicht profiel (featured)',
      'Dedicated accountmanager',
    ],
  },
  {
    name: 'Business',
    price: String(PLAN_PRICING.business.amount),
    period: 'mnd',
    featured: false,
    cta: 'Business kiezen',
    ctaVariant: 'secondary' as const,
    href: '/garage/aanmelden',
    features: [
      'Alles in Premium',
      'Onbeperkt foto\'s',
      'Onbeperkt diensten',
      'Uitgelicht profiel (featured)',
      'Dedicated accountmanager',
      'Vroege toegang tot nieuwe functies',
      'Uitgebreide statistieken',
    ],
    notIncluded: [],
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TarievenPage() {
  return (
    <>
      <Navbar />

      <section className="py-16">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <h1 className="text-[34px] sm:text-[36px] font-normal font-serif text-neutral-900 mb-2 text-center">
            Tarieven
          </h1>
          <p className="text-[15px] text-neutral-500 text-center mb-12 max-w-lg mx-auto">
            Begin gratis en upgrade wanneer uw garage groeit. Geen verplichtingen, op elk moment opzegbaar.
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
                    Meest gekozen
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

          <p className="text-[12px] text-neutral-300 mt-8 text-center">
            Alle prijzen zijn exclusief BTW. U kunt op elk moment opzeggen.
          </p>
        </div>
      </section>

      <Footer />
    </>
  )
}
