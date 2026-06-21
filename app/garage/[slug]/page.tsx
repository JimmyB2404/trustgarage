import { cache } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  IconPhone,
  IconMail,
  IconCalendar,
  IconCircleCheck,
  IconExternalLink,
  IconMapPin,
} from '@tabler/icons-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'
import ReviewCard from '@/components/ui/ReviewCard'
import { fetchGarageBySlug } from '@/lib/garages'
import { getDayName, isGarageOpen, getTodayHours, getInitials } from '@/lib/utils'
import type { Review } from '@/types'
import ReviewButton from '@/components/ui/ReviewButton'
import ViewTracker from '@/components/ui/ViewTracker'
import FavoriteButton from '@/components/ui/FavoriteButton'

// Zonder dit cachet Next.js de interne fetch()-calls van de Supabase client (rating, reviews,
// verificatiestatus, favorieten...) over requests heen, ook al is dit al een dynamische route.
// Resultaat: bezoekers zien verstopte/oude data totdat de cache toevallig verloopt.
export const dynamic = 'force-dynamic'

interface PageProps {
  params: { slug: string }
}

const CATEGORY_LABELS: Record<string, string> = {
  eerlijkheid: 'Eerlijkheid',
  prijs: 'Prijs',
  snelheid: 'Snelheid',
  communicatie: 'Communicatie',
  engels: 'Engelstalig',
}

const SUBCATEGORIES = ['eerlijkheid', 'prijs', 'snelheid', 'communicatie', 'engels'] as const

// Dedupeert de Supabase call tussen generateMetadata en de page render
const getGarage = cache(fetchGarageBySlug)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const garage = await getGarage(params.slug)
  if (!garage) return {}

  const title = `${garage.name} — ${garage.city}`
  const description = garage.description
    ? garage.description.slice(0, 155)
    : `${garage.name} in ${garage.city}. ${garage.review_count} reviews met ${garage.rating.toFixed(1)} sterren. Bekijk diensten, openingstijden en contactgegevens.`
  const hasPhoto = garage.logo_url || garage.photos[0]
  const image = hasPhoto
    ? { url: hasPhoto, width: 800, height: 600 }
    : { url: '/opengraph-image', width: 1200, height: 630 }
  const url = `/garage/${garage.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${garage.name} | TrustGarage.nl`,
      description,
      url,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${garage.name} | TrustGarage.nl`,
      description,
      images: [image.url],
    },
  }
}

export default async function GarageProfilePage({ params }: PageProps) {
  const garage = await getGarage(params.slug)
  if (!garage) notFound()

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: rawReviews } = await supabase
    .from('reviews')
    .select(`
      id, garage_id, user_id, user_name, user_country, is_expat, rating, text, language, verified, created_at,
      review_ratings(category, score),
      garage_replies(id, text, created_at)
    `)
    .eq('garage_id', garage.id)
    .order('created_at', { ascending: false })
  // Expliciete kolommen, geen '*' — sluit bewust receipt_number/verification_status/
  // verification_path/invitation_id uit zodat die nooit publiek lekken.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const garageReviews: Review[] = (rawReviews ?? []).map((r: any) => ({
    id: r.id,
    garage_id: r.garage_id,
    user_id: r.user_id,
    user_name: r.user_name,
    user_country: r.user_country,
    is_expat: r.is_expat,
    rating: r.rating,
    text: r.text,
    language: r.language,
    verified: r.verified,
    created_at: r.created_at,
    ratings: (r.review_ratings ?? []).map((rr: { category: string; score: number }) => ({
      category: rr.category,
      score: rr.score,
    })),
    reply: r.garage_replies?.[0] ?? undefined,
  }))
  const open = isGarageOpen(garage.hours)
  const todayHours = getTodayHours(garage.hours)
  const initials = getInitials(garage.name)
  const todayDayIndex = new Date().getDay()

  // Compute average subcategory scores across all reviews
  const subcategoryAverages = SUBCATEGORIES.map(cat => {
    const scores = garageReviews
      .flatMap(r => r.ratings)
      .filter(r => r.category === cat)
      .map(r => r.score)
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    return { cat, avg }
  })

  const verifiedCount = garageReviews.filter(r => r.verified).length

  const speaksEnglish = garage.languages.includes('Engels')

  const SCHEMA_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: garage.name,
    image: garage.logo_url || garage.photos[0] || undefined,
    url: `https://trustgarage.nl/garage/${garage.slug}`,
    telephone: garage.phone || undefined,
    email: garage.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: garage.address,
      addressLocality: garage.city,
      addressCountry: 'NL',
    },
    ...(garage.review_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: garage.rating,
        reviewCount: garage.review_count,
      },
    }),
    openingHoursSpecification: garage.hours
      .filter(h => !h.closed)
      .map(h => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: SCHEMA_DAYS[h.day],
        opens: h.open,
        closes: h.close,
      })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker garageId={garage.id} />
      <Navbar />

      {/* Breadcrumb */}
      <div className="hidden sm:block max-w-site mx-auto px-6 py-3 text-[12px] text-neutral-500">
        <span>Home</span>
        <span className="mx-1">›</span>
        <span>{garage.city}</span>
        <span className="mx-1">›</span>
        <span className="text-neutral-900">{garage.name}</span>
      </div>

      {/* HERO */}
      <div className="bg-white border-b border-neutral-100 py-6">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">

            {/* Left: avatar + info */}
            <div className="flex items-start gap-4 flex-1">
              {/* Avatar */}
              <div className="flex-shrink-0 w-[80px] h-[80px] rounded-xl overflow-hidden">
                {garage.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={garage.logo_url} alt={garage.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary-light flex items-center justify-center text-primary font-serif text-3xl select-none">
                    {initials}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-[24px] font-medium font-sans text-neutral-900 leading-tight">
                  {garage.name}
                </h1>

                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  {garage.kvk_verified && <Badge variant="kvk" />}
                  {garage.plan === 'premium' && <Badge variant="premium" />}
                  {garage.plan === 'business' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-[3px] rounded-sm whitespace-nowrap bg-[#FAEEDA] text-[#633806]">
                      Business lid
                    </span>
                  )}
                  {speaksEnglish && <Badge variant="english" />}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 mt-2 text-[13px] text-neutral-500">
                  <IconMapPin size={14} className="flex-shrink-0" />
                  <span>{garage.address}, {garage.city}</span>
                </div>

                {/* Rating + open status */}
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-medium text-neutral-900">{garage.rating.toFixed(1)}</span>
                    <StarRating rating={garage.rating} size={13} />
                    <span className="text-[12px] text-neutral-500">({garage.review_count} reviews)</span>
                  </div>
                  <span className="text-neutral-300">·</span>
                  {open ? (
                    <Badge variant="open" />
                  ) : (
                    <Badge variant="closed" />
                  )}
                  <span className="text-[12px] text-neutral-500">{todayHours}</span>
                </div>
              </div>
            </div>

            {/* Right: CTA buttons (desktop only) */}
            <div className="hidden lg:flex flex-col gap-2 flex-shrink-0">
              <a
                href={`tel:${garage.phone}`}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <IconPhone size={16} />
                Bellen
              </a>
              <button className="btn-secondary flex items-center justify-center gap-2">
                <IconCalendar size={16} />
                Afspraak maken
              </button>
              <div className="flex items-center justify-center gap-2 py-[7px]">
                <FavoriteButton
                  garageId={garage.id}
                  initialCount={garage.favorites_count ?? 0}
                  showCount={true}
                  size={16}
                />
                <span className="text-[13px] text-neutral-500">Favoriet</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PHOTO STRIP */}
      <div className="bg-surface py-4">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          {garage.photos.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {garage.photos.slice(0, 5).map((photo, i) => (
                <div
                  key={i}
                  className="h-[120px] w-[160px] bg-neutral-100 rounded-lg flex-shrink-0 overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[120px] w-[160px] bg-neutral-100 rounded-lg flex-shrink-0 flex items-center justify-center text-[12px] text-neutral-300"
                >
                  Geen foto
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT + ASIDE */}
      <div className="max-w-site mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Main column */}
        <div className="flex-1 min-w-0 space-y-8">

          {/* Over de garage */}
          <section>
            <h2 className="text-[20px] font-serif font-normal text-neutral-900 mb-3">
              Over de garage
            </h2>
            <div className="space-y-3">
              {garage.description.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-[15px] text-neutral-900 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Beoordelingen */}
          <section>
            <h2 className="text-[20px] font-serif font-normal text-neutral-900 mb-4">
              Beoordelingen
            </h2>
            <div className="flex items-start gap-8 mb-6 flex-wrap">
              {/* Overall score */}
              <div className="text-center flex-shrink-0">
                <div className="text-[48px] font-medium text-neutral-900 leading-none">
                  {garage.rating.toFixed(1)}
                </div>
                <div className="mt-1">
                  <StarRating rating={garage.rating} size={16} />
                </div>
                <div className="text-[12px] text-neutral-500 mt-1">
                  {garage.review_count} reviews
                </div>
              </div>

              {/* Subcategory bars */}
              <div className="flex-1 min-w-[200px] space-y-2">
                {subcategoryAverages.map(({ cat, avg }) => (
                  <div key={cat} className="flex items-center gap-3 text-[13px]">
                    <span className="text-neutral-500 w-[100px] flex-shrink-0">
                      {CATEGORY_LABELS[cat]}
                    </span>
                    <div className="flex-1 h-[6px] bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(avg / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-neutral-900 font-medium w-[28px] text-right">
                      {avg > 0 ? avg.toFixed(1) : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Diensten */}
          <section>
            <h2 className="text-[20px] font-serif font-normal text-neutral-900 mb-4">
              Diensten
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {garage.services.map(service => (
                <div key={service} className="flex items-center gap-2 text-[14px] text-neutral-900">
                  <IconCircleCheck size={16} className="text-primary flex-shrink-0" />
                  {service}
                </div>
              ))}
            </div>
          </section>

          {/* Openingstijden */}
          <section>
            <h2 className="text-[20px] font-serif font-normal text-neutral-900 mb-4">
              Openingstijden
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 max-w-[400px]">
              {garage.hours.map(h => {
                const isToday = h.day === todayDayIndex
                return (
                  <div
                    key={h.day}
                    className="flex justify-between py-1.5 border-b border-neutral-100 text-[14px]"
                  >
                    <span className={isToday ? 'font-medium text-primary' : 'text-neutral-900'}>
                      {getDayName(h.day)}
                    </span>
                    <span
                      className={
                        h.closed
                          ? 'text-neutral-300'
                          : isToday
                          ? 'text-primary font-medium'
                          : 'text-neutral-900'
                      }
                    >
                      {h.closed ? 'Gesloten' : `${h.open} – ${h.close}`}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-[20px] font-serif font-normal text-neutral-900">
                Reviews ({garageReviews.length})
                {verifiedCount > 0 && (
                  <span className="text-[13px] font-sans text-primary ml-2">
                    · {verifiedCount} van {garageReviews.length} geverifieerd
                  </span>
                )}
              </h2>
              <ReviewButton garageId={garage.id} garageName={garage.name} />
            </div>
            {garageReviews.length > 0 ? (
              <div className="space-y-4">
                {garageReviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-neutral-500">
                Nog geen reviews voor deze garage. Wees de eerste!
              </p>
            )}
          </section>
        </div>

        {/* Aside (desktop only) */}
        <aside className="hidden lg:block w-[280px] flex-shrink-0">
          {/* Contact card */}
          <div className="card p-5 mb-4">
            <h3 className="text-[15px] font-medium text-neutral-900 mb-4">Contact</h3>
            <div className="space-y-3 text-[14px] text-neutral-500">
              {garage.phone && (
                <div className="flex items-center gap-2">
                  <IconPhone size={15} className="flex-shrink-0 text-neutral-300" />
                  <a href={`tel:${garage.phone}`} className="hover:text-primary transition-colors">
                    {garage.phone}
                  </a>
                </div>
              )}
              {garage.email && (
                <div className="flex items-center gap-2">
                  <IconMail size={15} className="flex-shrink-0 text-neutral-300" />
                  <a href={`mailto:${garage.email}`} className="hover:text-primary transition-colors truncate">
                    {garage.email}
                  </a>
                </div>
              )}
              {garage.website && (
                <div className="flex items-center gap-2">
                  <IconExternalLink size={15} className="flex-shrink-0 text-neutral-300" />
                  <a
                    href={garage.website.startsWith('http') ? garage.website : `https://${garage.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors truncate"
                  >
                    {garage.website}
                  </a>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={`tel:${garage.phone}`}
                className="btn-primary text-center w-full flex items-center justify-center gap-2"
              >
                <IconPhone size={16} />
                Bellen
              </a>
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                <IconCalendar size={16} />
                Afspraak maken
              </button>
            </div>
          </div>

          {/* Location card */}
          <div className="card p-5">
            <h3 className="text-[15px] font-medium text-neutral-900 mb-3">Locatie</h3>
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? (
              <iframe
                title={`Kaart van ${garage.name}`}
                className="w-full h-[150px] rounded-lg border border-neutral-100"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${encodeURIComponent(`${garage.address}, ${garage.city}`)}`}
              />
            ) : (
              <div className="h-[150px] bg-surface rounded-lg flex items-center justify-center text-neutral-300 text-[13px] border border-neutral-100 text-center px-4">
                Kaart beschikbaar na Google Maps setup
              </div>
            )}
            <p className="text-[12px] text-neutral-500 mt-2">
              {garage.address}, {garage.city}
            </p>
          </div>
        </aside>
      </div>

      {/* Mobile sticky footer CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-4 py-3 flex gap-3 z-40">
        <a
          href={`tel:${garage.phone}`}
          className="btn-ghost flex-1 flex items-center justify-center gap-2"
        >
          <IconPhone size={16} />
          Bellen
        </a>
        <button className="btn-primary flex-1 flex items-center justify-center gap-2">
          <IconCalendar size={16} />
          Afspraak maken
        </button>
        <FavoriteButton
          garageId={garage.id}
          initialCount={garage.favorites_count ?? 0}
          showCount={false}
          size={18}
        />
      </div>

      {/* Extra bottom padding on mobile for sticky footer */}
      <div className="lg:hidden h-[72px]" />

      <Footer />
    </>
  )
}
