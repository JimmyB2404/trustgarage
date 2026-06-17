export const dynamic = 'force-dynamic'

import Link from 'next/link'
import {
  IconSearch,
  IconCircleCheck,
  IconShieldCheck,
  IconLanguage,
  IconStar,
} from '@tabler/icons-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GarageCard from '@/components/ui/GarageCard'
import { fetchGarages } from '@/lib/garages'

const filterChips = ['APK', 'Onderhoud', 'Banden', 'Airco', 'Engelstalig']

const trustBarItems = [
  { icon: <IconCircleCheck size={15} className="text-primary" />, label: 'KVK geverifieerd' },
  { icon: <IconShieldCheck size={15} className="text-primary" />, label: 'Eerlijke reviews' },
  { icon: <IconLanguage size={15} className="text-primary" />, label: 'Engelstalig beschikbaar' },
  { icon: <IconStar size={15} className="text-primary" />, label: 'Top beoordeeld' },
]

const howItWorksSteps = [
  {
    number: '1',
    title: 'Zoek een garage',
    text: 'Vul je stad of dienst in en bekijk de resultaten direct.',
  },
  {
    number: '2',
    title: 'Lees reviews',
    text: 'Vergelijk reviews van Nederlanders en expats.',
  },
  {
    number: '3',
    title: 'Neem contact op',
    text: 'Bel direct of plan een afspraak via het profiel.',
  },
]

export default async function HomePage() {
  const featuredGarages = await fetchGarages(3)

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-surface pt-[52px] pb-[44px]">
        <div className="max-w-site mx-auto px-4 sm:px-6 text-center">
          {/* Eyebrow */}
          <p className="text-[13px] text-primary font-medium uppercase tracking-wider">
            Betrouwbare garages in Nederland
          </p>

          {/* H1 */}
          <h1 className="text-[34px] sm:text-[36px] font-normal font-serif text-neutral-900 mt-3 max-w-[520px] mx-auto leading-tight">
            Vind een garage<br />die u vertrouwt
          </h1>

          {/* Subtitle */}
          <p className="text-[16px] text-neutral-500 mt-3 max-w-[420px] mx-auto">
            Lees eerlijke reviews van echte klanten. Vergelijk diensten, talen en openingstijden.
          </p>

          {/* Search bar */}
          <form action="/zoeken" method="GET" className="mt-8 max-w-[460px] mx-auto">
            {/* Desktop: side-by-side inside a single rounded pill */}
            <div className="hidden sm:flex items-center bg-white rounded-xl border border-neutral-100 shadow-card p-1">
              <div className="flex items-center flex-1 px-3 gap-2">
                <IconSearch size={17} className="text-neutral-300 flex-shrink-0" />
                <input
                  type="text"
                  name="q"
                  placeholder="Zoek op stad of garagenaam..."
                  className="flex-1 text-[14px] text-neutral-900 placeholder:text-neutral-300 bg-transparent outline-none py-2"
                />
              </div>
              <button
                type="submit"
                className="btn-primary text-[14px] py-[9px] px-5 rounded-lg flex-shrink-0"
              >
                Zoeken
              </button>
            </div>

            {/* Mobile: stacked */}
            <div className="flex flex-col gap-2 sm:hidden">
              <div className="flex items-center bg-white rounded-xl border border-neutral-100 shadow-card px-3 gap-2">
                <IconSearch size={17} className="text-neutral-300 flex-shrink-0" />
                <input
                  type="text"
                  name="q"
                  placeholder="Zoek op stad of garagenaam..."
                  className="flex-1 text-[14px] text-neutral-900 placeholder:text-neutral-300 bg-transparent outline-none py-3"
                />
              </div>
              <button
                type="submit"
                className="btn-primary text-[14px] py-3 w-full rounded-xl"
              >
                Zoeken
              </button>
            </div>
          </form>

          {/* Filter chips */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {filterChips.map((chip) => (
              <Link
                key={chip}
                href={`/zoeken?dienst=${encodeURIComponent(chip)}`}
                className="rounded-full text-[13px] py-[6px] px-4 border border-neutral-100 text-neutral-500 hover:border-primary hover:text-primary transition-colors bg-white"
              >
                {chip}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTBAR */}
      <div className="bg-white border-t border-b border-neutral-100 py-4 hidden md:flex">
        <div className="max-w-site mx-auto px-4 sm:px-6 w-full flex items-center justify-center gap-10">
          {trustBarItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-[13px] text-neutral-500 font-medium">
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* GARAGE CARDS SECTION */}
      <section className="py-[64px]">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 text-center mb-3">
            Aanbevolen garages in Maastricht
          </h2>
          <p className="text-[15px] text-neutral-500 text-center mb-8">
            Geverifieerde garages met de hoogste beoordelingen van echte klanten.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGarages.map((garage) => (
              <GarageCard key={garage.id} garage={garage} variant="vertical" featured={true} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/zoeken" className="btn-secondary mx-auto flex w-fit">
              Alle garages bekijken
            </Link>
          </div>
        </div>
      </section>

      {/* HOE HET WERKT */}
      <section className="bg-surface py-[64px]">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 text-center">
            Hoe werkt het?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {howItWorksSteps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center">
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-medium text-[16px] flex-shrink-0">
                  {step.number}
                </div>
                <h3 className="text-[17px] font-medium text-neutral-900 mt-4 mb-2">
                  {step.title}
                </h3>
                <p className="text-[14px] text-neutral-500 leading-[1.6] max-w-[240px]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BLOCK */}
      <section className="bg-primary-dark py-[64px] text-white text-center">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-white">
            Bent u eigenaar van een garage?
          </h2>
          <p className="text-[15px] text-white/80 mt-3 max-w-[400px] mx-auto">
            Meld uw garage gratis aan en bereik meer klanten in uw regio.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap mt-8">
            <Link
              href="/garage/aanmelden"
              className="inline-flex items-center justify-center rounded-lg px-5 py-[10px] text-[14px] font-medium bg-white text-primary hover:bg-primary-light transition-colors"
            >
              Gratis aanmelden
            </Link>
            <Link
              href="/voor-garages"
              className="inline-flex items-center justify-center rounded-lg px-5 py-[10px] text-[14px] font-medium border border-white text-white hover:bg-white/10 transition-colors"
            >
              Meer informatie
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
