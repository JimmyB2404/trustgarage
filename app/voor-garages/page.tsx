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

export const metadata: Metadata = {
  title: 'Voor Garagebedrijven',
  description:
    'Meld uw garage gratis aan op TrustGarage.nl. Vergroot uw online zichtbaarheid, ontvang meer reviews en bereik expat-klanten.',
}

// ─── Data ────────────────────────────────────────────────────────────────────

const benefits = [
  {
    icon: <IconCircleCheck size={40} className="text-primary" />,
    title: 'KVK geverifieerd',
    description: 'Bouw vertrouwen op met uw officiële KVK-verificatie.',
  },
  {
    icon: <IconStar size={40} className="text-primary" />,
    title: 'Meer reviews',
    description: 'Ontvang meer reviews van tevreden klanten.',
  },
  {
    icon: <IconLanguage size={40} className="text-primary" />,
    title: 'Expat klanten',
    description: 'Bereik internationale klanten die Engels spreken.',
  },
]

const plans = [
  {
    name: 'Gratis',
    price: '0',
    period: 'mnd',
    featured: false,
    cta: 'Gratis aanmelden',
    ctaVariant: 'primary' as const,
    href: '/registreren',
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
    price: '29',
    period: 'mnd',
    featured: true,
    cta: 'Premium kiezen',
    ctaVariant: 'primary' as const,
    href: '/registreren?plan=premium',
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
    price: '79',
    period: 'mnd',
    featured: false,
    cta: 'Business kiezen',
    ctaVariant: 'secondary' as const,
    href: '/registreren?plan=business',
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

const steps = [
  {
    number: '1',
    title: 'Aanmelden',
    description: 'Maak gratis een account aan met uw e-mailadres.',
  },
  {
    number: '2',
    title: 'KVK verifiëren',
    description: 'Verifieer uw bedrijf met uw KVK-nummer voor meer vertrouwen.',
  },
  {
    number: '3',
    title: 'Profiel aanvullen',
    description: 'Voeg openingstijden, diensten en foto\'s toe aan uw profiel.',
  },
  {
    number: '4',
    title: 'Klanten ontvangen',
    description: 'Word gevonden door Nederlanders en expats in uw regio.',
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function VoorGaragesPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-primary-dark text-white py-20">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <p className="text-[13px] font-medium text-white/60 uppercase tracking-widest mb-4">
            Voor garagebedrijven
          </p>
          <h1 className="text-[34px] sm:text-[36px] font-normal font-serif text-white leading-tight mb-5">
            Bereik meer klanten<br />met TrustGarage
          </h1>
          <p className="text-white/80 text-[16px] leading-[1.7] max-w-lg mb-8">
            Meld uw garage gratis aan en vergroot uw online zichtbaarheid. Laat
            tevreden klanten voor u spreken.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/registreren"
              className="inline-flex items-center justify-center rounded-md px-6 py-[11px] text-[14px] font-medium transition-colors duration-150 bg-white text-primary hover:bg-primary-light"
            >
              Gratis aanmelden
            </Link>
            <a
              href="#plannen"
              className="inline-flex items-center justify-center rounded-md px-6 py-[11px] text-[14px] font-medium transition-colors duration-150 border border-white text-white hover:bg-white/10"
            >
              Meer informatie
            </a>
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 mb-10 text-center">
            Waarom TrustGarage?
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
            Kies uw plan
          </h2>
          <p className="text-[14px] text-neutral-500 text-center mb-10">
            Begin gratis en upgrade wanneer uw bedrijf groeit.
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
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 mb-10 text-center">
            Hoe werkt het?
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
            Klaar om te beginnen?
          </h2>
          <p className="text-white/80 text-[15px] mb-8 max-w-md mx-auto">
            Meld uw garage vandaag nog gratis aan en word gevonden door nieuwe klanten.
          </p>
          <Link
            href="/registreren"
            className="inline-flex items-center justify-center rounded-md px-6 py-[11px] text-[14px] font-medium transition-colors duration-150 bg-white text-primary hover:bg-primary-light"
          >
            Gratis aanmelden
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
