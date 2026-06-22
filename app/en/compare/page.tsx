'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { IconCheck, IconX, IconPhone, IconMapPin } from '@tabler/icons-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StarRating from '@/components/ui/StarRating'
import { createClient } from '@/lib/supabase'
import { transformGarage } from '@/lib/garages'
import { isGarageOpen, getTodayHours } from '@/lib/utils'
import { SERVICE_LABELS_EN, LANGUAGE_LABELS_EN } from '@/lib/mock-data'
import type { Garage } from '@/types'

function CompareContent() {
  const searchParams = useSearchParams()
  const ids = (searchParams.get('ids') ?? '').split(',').filter(Boolean)

  const [garages, setGarages] = useState<Garage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ids.length === 0) { setLoading(false); return }
    const supabase = createClient()
    supabase
      .from('garages')
      .select('*, garage_services(service_name), garage_languages(language), garage_hours(day_of_week, open_time, close_time, is_closed), reviews(rating)')
      .in('id', ids)
      .then(({ data, error }) => {
        if (error) {
          console.error('[TrustGarage] Compare fetch error:', error)
        } else {
          const byId = new Map((data ?? []).map(transformGarage).map(g => [g.id, g]))
          setGarages(ids.map(id => byId.get(id)).filter((g): g is Garage => !!g))
        }
        setLoading(false)
      })
  }, [ids.join(',')])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-neutral-500">Loading...</div>
  }

  if (garages.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
          <p className="text-[16px] font-medium text-neutral-900 mb-2">No garages to compare</p>
          <p className="text-[13px] text-neutral-500 mb-4">Select garages on the search page to compare them here.</p>
          <Link href="/en/zoeken" className="btn-primary">Search garages</Link>
        </div>
        <Footer locale="en" />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-site mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-[28px] font-normal font-serif text-neutral-900 mb-6">Compare garages</h1>

        <div className="overflow-x-auto">
          <div className={`grid gap-4 min-w-[600px]`} style={{ gridTemplateColumns: `repeat(${garages.length}, minmax(220px, 1fr))` }}>
            {garages.map(garage => {
              const open = isGarageOpen(garage.hours)
              return (
                <div key={garage.id} className="bg-white border border-neutral-100 rounded-xl shadow-card p-5 flex flex-col gap-4">
                  <div>
                    <h2 className="text-[16px] font-medium text-neutral-900 mb-1">{garage.name}</h2>
                    <div className="flex items-center gap-1 text-[12px] text-neutral-500">
                      <IconMapPin size={12} />
                      {garage.address}, {garage.city}
                    </div>
                  </div>

                  <div>
                    <StarRating rating={garage.rating} size={14} showNumber count={garage.review_count} />
                  </div>

                  <div className="flex items-center gap-2 text-[13px]">
                    {garage.kvk_verified ? (
                      <span className="flex items-center gap-1 text-primary"><IconCheck size={14} /> KVK verified</span>
                    ) : (
                      <span className="flex items-center gap-1 text-neutral-300"><IconX size={14} /> Not KVK verified</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[13px]">
                    {open ? (
                      <span className="text-primary font-medium">Open now</span>
                    ) : (
                      <span className="text-neutral-500">Closed</span>
                    )}
                    <span className="text-neutral-300">·</span>
                    <span className="text-neutral-500">{getTodayHours(garage.hours, 'en')}</span>
                  </div>

                  <div>
                    <p className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-2">Services</p>
                    <div className="flex flex-col gap-1">
                      {garage.services.length > 0 ? garage.services.map(s => (
                        <span key={s} className="text-[13px] text-neutral-900">{SERVICE_LABELS_EN[s] ?? s}</span>
                      )) : <span className="text-[13px] text-neutral-300">—</span>}
                    </div>
                  </div>

                  <div>
                    <p className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-2">Languages</p>
                    <div className="flex flex-col gap-1">
                      {garage.languages.length > 0 ? garage.languages.map(l => (
                        <span key={l} className="text-[13px] text-neutral-900">{LANGUAGE_LABELS_EN[l] ?? l}</span>
                      )) : <span className="text-[13px] text-neutral-300">—</span>}
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-2">
                    <a
                      href={`tel:${garage.phone}`}
                      className="btn-primary text-center flex items-center justify-center gap-2 text-[13px] py-[8px]"
                    >
                      <IconPhone size={14} /> Call
                    </a>
                    <Link href={`/en/garage/${garage.slug}`} className="btn-secondary text-center text-[13px] py-[8px]">
                      View profile
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <Footer locale="en" />
    </>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-neutral-500">Loading...</div>}>
      <CompareContent />
    </Suspense>
  )
}
