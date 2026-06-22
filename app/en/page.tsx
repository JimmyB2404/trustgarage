export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: 'TrustGarage.nl — Find a garage you can trust',
  description: 'Find a trustworthy garage in the Netherlands. Read honest reviews, compare services and prices. Ideal for locals and expats.',
  alternates: { canonical: '/en', languages: { nl: '/', en: '/en' } },
}

const filterChips = [
  { label: 'APK', value: 'APK' },
  { label: 'Maintenance', value: 'Onderhoud' },
  { label: 'Tyres', value: 'Banden' },
  { label: 'AC', value: 'Airco' },
  { label: 'English-speaking', value: 'Engelstalig' },
]

const trustBarItems = [
  { icon: <IconCircleCheck size={15} className="text-primary" />, label: 'KVK verified' },
  { icon: <IconShieldCheck size={15} className="text-primary" />, label: 'Honest reviews' },
  { icon: <IconLanguage size={15} className="text-primary" />, label: 'English spoken' },
  { icon: <IconStar size={15} className="text-primary" />, label: 'Top rated' },
]

const howItWorksSteps = [
  {
    number: '1',
    title: 'Find a garage',
    text: 'Enter your city or service and see the results instantly.',
  },
  {
    number: '2',
    title: 'Read reviews',
    text: 'Compare reviews from locals and expats.',
  },
  {
    number: '3',
    title: 'Get in touch',
    text: 'Call directly or request an appointment via the profile.',
  },
]

export default async function HomePageEn() {
  const featuredGarages = await fetchGarages(3)

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-surface pt-[52px] pb-[44px]">
        <div className="max-w-site mx-auto px-4 sm:px-6 text-center">
          {/* Eyebrow */}
          <p className="text-[13px] text-primary font-medium uppercase tracking-wider">
            Trustworthy garages in the Netherlands
          </p>

          {/* H1 */}
          <h1 className="text-[34px] sm:text-[36px] font-normal font-serif text-neutral-900 mt-3 max-w-[520px] mx-auto leading-tight">
            Find a garage<br />you can trust
          </h1>

          {/* Subtitle */}
          <p className="text-[16px] text-neutral-500 mt-3 max-w-[420px] mx-auto">
            Read honest reviews from real customers. Compare services, languages and opening hours.
          </p>

          {/* Search bar */}
          <form action="/en/zoeken" method="GET" className="mt-8 max-w-[460px] mx-auto">
            {/* Desktop: side-by-side inside a single rounded pill */}
            <div className="hidden sm:flex items-center bg-white rounded-xl border border-neutral-100 shadow-card p-1">
              <div className="flex items-center flex-1 px-3 gap-2">
                <IconSearch size={17} className="text-neutral-300 flex-shrink-0" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search by city or garage name..."
                  className="flex-1 text-[14px] text-neutral-900 placeholder:text-neutral-300 bg-transparent outline-none py-2"
                />
              </div>
              <button
                type="submit"
                className="btn-primary text-[14px] py-[9px] px-5 rounded-lg flex-shrink-0"
              >
                Search
              </button>
            </div>

            {/* Mobile: stacked */}
            <div className="flex flex-col gap-2 sm:hidden">
              <div className="flex items-center bg-white rounded-xl border border-neutral-100 shadow-card px-3 gap-2">
                <IconSearch size={17} className="text-neutral-300 flex-shrink-0" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search by city or garage name..."
                  className="flex-1 text-[14px] text-neutral-900 placeholder:text-neutral-300 bg-transparent outline-none py-3"
                />
              </div>
              <button
                type="submit"
                className="btn-primary text-[14px] py-3 w-full rounded-xl"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter chips */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {filterChips.map((chip) => (
              <Link
                key={chip.value}
                href={`/en/zoeken?q=${encodeURIComponent(chip.value)}`}
                className="rounded-full text-[13px] py-[6px] px-4 border border-neutral-100 text-neutral-500 hover:border-primary hover:text-primary transition-colors bg-white"
              >
                {chip.label}
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
            Recommended garages in the Netherlands
          </h2>
          <p className="text-[15px] text-neutral-500 text-center mb-8">
            Verified garages with the highest ratings from real customers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGarages.map((garage) => (
              <GarageCard key={garage.id} garage={garage} variant="vertical" featured={true} locale="en" />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/en/zoeken" className="btn-secondary mx-auto flex w-fit">
              View all garages
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-surface py-[64px]">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-neutral-900 text-center">
            How does it work?
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

          <div className="flex items-center justify-center gap-2 mt-10 text-[13px] text-neutral-500">
            <IconShieldCheck size={15} className="text-primary flex-shrink-0" />
            <span>
              Look for the <span className="text-primary font-medium">&quot;Verified visit&quot;</span> badge —
              that review is guaranteed to come from a real visit to the garage.
            </span>
          </div>
        </div>
      </section>

      {/* CTA BLOCK */}
      <section className="bg-primary-dark py-[64px] text-white text-center">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <h2 className="text-[22px] sm:text-[26px] font-normal font-serif text-white">
            Do you own a garage?
          </h2>
          <p className="text-[15px] text-white/80 mt-3 max-w-[400px] mx-auto">
            Register your garage for free and reach more customers in your area.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap mt-8">
            <Link
              href="/garage/aanmelden"
              className="inline-flex items-center justify-center rounded-lg px-5 py-[10px] text-[14px] font-medium bg-white text-primary hover:bg-primary-light transition-colors"
            >
              Sign up for free
            </Link>
            <Link
              href="/en/voor-garages"
              className="inline-flex items-center justify-center rounded-lg px-5 py-[10px] text-[14px] font-medium border border-white text-white hover:bg-white/10 transition-colors"
            >
              More information
            </Link>
          </div>
        </div>
      </section>

      <Footer locale="en" />
    </>
  )
}
