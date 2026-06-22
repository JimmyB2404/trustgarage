import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  IconMail,
  IconShieldCheck,
  IconCircleCheck,
  IconStar,
} from '@tabler/icons-react'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn more about TrustGarage.nl — our story, our mission and the values that drive us to bring transparency to the automotive industry.',
  alternates: { canonical: '/en/over-ons', languages: { nl: '/over-ons', en: '/en/over-ons' } },
}

// ─── Data ────────────────────────────────────────────────────────────────────

const values = [
  {
    icon: <IconCircleCheck size={32} className="text-primary" />,
    title: 'Honesty',
    description:
      'We present reviews as they are — unfiltered and unedited. No fake reviews, no hidden agenda.',
  },
  {
    icon: <IconShieldCheck size={32} className="text-primary" />,
    title: 'Transparency',
    description:
      'Garages are verified via the Dutch Chamber of Commerce (KVK), so you always know who you\'re dealing with.',
  },
  {
    icon: <IconStar size={32} className="text-primary" />,
    title: 'Reliability',
    description:
      'Our data is up to date, our verifications are real, and our review scores can be trusted.',
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OverOnsPageEn() {
  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-surface py-16">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <h1 className="text-[34px] sm:text-[36px] font-normal font-serif text-neutral-900 mb-4">
            About TrustGarage.nl
          </h1>
          <p className="text-[16px] text-neutral-500 leading-[1.7] max-w-xl">
            We connect locals and expats with trustworthy garages.
          </p>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 mb-6">
            Our mission
          </h2>
          <p className="text-[16px] text-neutral-500 leading-[1.8]">
            TrustGarage was founded with a simple mission: transparency in the automotive industry.
            Too often, drivers overpay or get unnecessary work done on their car. We believe in
            honest reviews and verified information — so you can always make an informed choice for
            your car.
          </p>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 mb-5">
                Our story
              </h2>
              <div className="flex flex-col gap-4 text-[15px] text-neutral-500 leading-[1.8]">
                <p>
                  TrustGarage.nl was born out of a personal frustration: finding an honest,
                  trustworthy garage was harder than it should be. Especially for expats who
                  aren&apos;t yet familiar with the Dutch automotive industry.
                </p>
                <p>
                  We started in the Maastricht region in 2024 — a city with a large international
                  community. The idea: one platform where locals and expats have equal access to
                  trustworthy garage information, in both Dutch and English.
                </p>
                <p>
                  Since then, we&apos;ve grown to dozens of verified garages. Every business on
                  TrustGarage is verified via the Dutch Chamber of Commerce, so you always know
                  you&apos;re dealing with a real, registered business.
                </p>
              </div>
            </div>

            {/* Founders photo */}
            <div className="relative rounded-xl overflow-hidden border border-neutral-100 h-[250px]">
              <Image
                src="/jimmyalexandra_nieuw.png"
                alt="Jimmy and Alexandra, founders of TrustGarage.nl"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="bg-surface py-12">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 mb-10 text-center">
            Our values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card p-6 flex flex-col gap-4">
                {v.icon}
                <h3 className="text-[16px] font-medium text-neutral-900">{v.title}</h3>
                <p className="text-[14px] text-neutral-500 leading-[1.6]">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section id="contact" className="py-12">
        <div className="max-w-site mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 mb-3">
            Get in touch
          </h2>
          <p className="text-[15px] text-neutral-500 mb-6 max-w-md mx-auto">
            Questions or suggestions? Get in touch.
          </p>

          {/* Email */}
          <a
            href="mailto:info@trustgarage.nl"
            className="inline-flex items-center gap-2 text-[15px] text-primary font-medium hover:underline mb-8"
          >
            <IconMail size={18} />
            info@trustgarage.nl
          </a>

          {/* CTA */}
          <div>
            <Link
              href="mailto:info@trustgarage.nl"
              className="btn-primary inline-flex items-center gap-2"
            >
              <IconMail size={16} />
              Send a message
            </Link>
          </div>
        </div>
      </section>

      <Footer locale="en" />
    </>
  )
}
