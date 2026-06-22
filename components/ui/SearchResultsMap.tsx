'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { GoogleMap, MarkerF, InfoWindowF, useLoadScript } from '@react-google-maps/api'
import StarRating from './StarRating'
import type { Garage } from '@/types'

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

const MAASTRICHT_CENTER = { lat: 50.8514, lng: 5.6910 }

const TEXT = {
  nl: { mapUnavailable: 'Kaart beschikbaar na Google Maps setup', viewProfile: 'Bekijk profiel →' },
  en: { mapUnavailable: 'Map available after Google Maps setup', viewProfile: 'View profile →' },
}

export default function SearchResultsMap({ garages, locale = 'nl' }: { garages: Garage[]; locale?: 'nl' | 'en' }) {
  const t = TEXT[locale]
  const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_KEY ?? '' })
  const [activeId, setActiveId] = useState<string | null>(null)

  const located = useMemo(
    () => garages.filter((g): g is Garage & { latitude: number; longitude: number } =>
      typeof g.latitude === 'number' && typeof g.longitude === 'number'
    ),
    [garages]
  )

  const center = located[0] ? { lat: located[0].latitude, lng: located[0].longitude } : MAASTRICHT_CENTER

  if (!GOOGLE_MAPS_KEY) {
    return (
      <div className="h-full bg-surface rounded-lg border border-neutral-100 flex items-center justify-center text-neutral-300 text-[13px] text-center px-4">
        {t.mapUnavailable}
      </div>
    )
  }

  if (!isLoaded) {
    return <div className="h-full bg-surface rounded-lg border border-neutral-100 animate-pulse" />
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full rounded-lg"
      center={center}
      zoom={located.length > 0 ? 12 : 13}
      options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
    >
      {located.map(garage => (
        <MarkerF
          key={garage.id}
          position={{ lat: garage.latitude, lng: garage.longitude }}
          onClick={() => setActiveId(garage.id)}
        >
          {activeId === garage.id && (
            <InfoWindowF onCloseClick={() => setActiveId(null)}>
              <div className="min-w-[180px]">
                <p className="text-[14px] font-medium text-neutral-900 mb-1">{garage.name}</p>
                <StarRating rating={garage.rating} size={12} showNumber count={garage.review_count} />
                <Link
                  href={locale === 'en' ? `/en/garage/${garage.slug}` : `/garage/${garage.slug}`}
                  className="block mt-2 text-[12px] text-primary font-medium hover:underline"
                >
                  {t.viewProfile}
                </Link>
              </div>
            </InfoWindowF>
          )}
        </MarkerF>
      ))}
    </GoogleMap>
  )
}
