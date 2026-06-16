import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  IconMail,
  IconShieldCheck,
  IconCircleCheck,
  IconStar,
} from '@tabler/icons-react'

export const metadata: Metadata = {
  title: 'Over Ons',
  description:
    'Leer meer over TrustGarage.nl — ons verhaal, onze missie en de waarden die ons drijven om transparantie in de autobranche te brengen.',
}

// ─── Data ────────────────────────────────────────────────────────────────────

const values = [
  {
    icon: <IconCircleCheck size={32} className="text-primary" />,
    title: 'Eerlijkheid',
    description:
      'Wij presenteren reviews zoals ze zijn — ongefilterd en onbewerkt. Geen nep-reviews, geen verborgen agenda.',
  },
  {
    icon: <IconShieldCheck size={32} className="text-primary" />,
    title: 'Transparantie',
    description:
      'Garagebedrijven worden geverifieerd via KVK, zodat u altijd weet met wie u te maken heeft.',
  },
  {
    icon: <IconStar size={32} className="text-primary" />,
    title: 'Betrouwbaarheid',
    description:
      'Onze data is actueel, onze verificaties zijn echt en onze reviewscores zijn te vertrouwen.',
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OverOnsPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-surface py-16">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <h1 className="text-[34px] sm:text-[36px] font-normal font-serif text-neutral-900 mb-4">
            Over TrustGarage.nl
          </h1>
          <p className="text-[16px] text-neutral-500 leading-[1.7] max-w-xl">
            Wij verbinden Nederlanders en expats met betrouwbare garages.
          </p>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 mb-6">
            Onze missie
          </h2>
          <p className="text-[16px] text-neutral-500 leading-[1.8]">
            TrustGarage is opgericht met een simpele missie: transparantie in de autobranche.
            Te vaak betalen autorijders te veel of krijgen ze onnodig werk uitgevoerd. Wij geloven
            in eerlijke reviews en geverifieerde informatie — zodat u altijd een weloverwogen keuze
            kunt maken voor uw auto.
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
                Ons verhaal
              </h2>
              <div className="flex flex-col gap-4 text-[15px] text-neutral-500 leading-[1.8]">
                <p>
                  TrustGarage.nl is ontstaan vanuit een persoonlijke frustratie: het vinden van een
                  eerlijke, betrouwbare garage was moeilijker dan het zou moeten zijn. Zeker voor expats
                  die nog niet vertrouwd zijn met de Nederlandse autobranche.
                </p>
                <p>
                  In 2024 zijn we gestart in de regio Maastricht — een stad met een grote internationale
                  gemeenschap. Het idee: één platform waar Nederlanders en expats dezelfde toegang hebben
                  tot betrouwbare garageinformatie, in zowel het Nederlands als het Engels.
                </p>
                <p>
                  Sindsdien zijn we gegroeid naar tientallen geverifieerde garages. Elk bedrijf op
                  TrustGarage is geverifieerd via de Kamer van Koophandel, zodat u altijd weet dat u
                  met een echt, geregistreerd bedrijf te maken heeft.
                </p>
              </div>
            </div>

            {/* Image placeholder */}
            <div className="bg-surface rounded-xl h-[250px] flex items-center justify-center border border-neutral-100">
              <span className="text-[13px] text-neutral-300">Afbeelding volgt</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="bg-surface py-12">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 mb-10 text-center">
            Onze waarden
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
            Neem contact op
          </h2>
          <p className="text-[15px] text-neutral-500 mb-6 max-w-md mx-auto">
            Vragen of suggesties? Neem contact op.
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
              Stuur een bericht
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
