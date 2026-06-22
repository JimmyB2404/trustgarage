'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  IconChartBar,
  IconStar,
  IconCircleCheck,
  IconTrendingUp,
  IconShieldCheck,
  IconMailForward,
  IconCalendarEvent,
  IconMenu2,
  IconX,
  IconLogout,
  IconHeartFilled,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useGarage, type GarageData } from '@/hooks/useGarage'
import { useDashboardViews } from '@/hooks/useDashboardViews'

// ─── Shared Dashboard Layout ─────────────────────────────────────────────────

const navItems = [
  { href: '/dashboard', label: 'Overzicht', icon: <IconChartBar size={16} /> },
  { href: '/dashboard/profiel', label: 'Profiel', icon: <IconShieldCheck size={16} /> },
  { href: '/dashboard/reviews', label: 'Reviews', icon: <IconStar size={16} /> },
  { href: '/dashboard/uitnodigingen', label: 'Uitnodigingen', icon: <IconMailForward size={16} /> },
  { href: '/dashboard/afspraken', label: 'Afspraken', icon: <IconCalendarEvent size={16} /> },
  { href: '/dashboard/inzichten', label: 'Inzichten', icon: <IconTrendingUp size={16} /> },
  { href: '/dashboard/abonnement', label: 'Abonnement', icon: <IconCircleCheck size={16} /> },
]

function DashboardSidebar({ onClose, reviewBadge }: { onClose?: () => void; reviewBadge?: number }) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full py-4 px-3">
      {/* Logo */}
      <div className="flex items-center justify-between mb-6 px-3">
        <Link href="/" className="font-serif text-[18px] text-primary font-normal tracking-tight">
          TrustGarage<span className="text-neutral-900">.nl</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-900 md:hidden">
            <IconX size={20} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const badge = item.href === '/dashboard/reviews' ? reviewBadge : undefined
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-[14px] transition-colors duration-150',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-neutral-900 hover:bg-[#F0F0F0]'
              )}
            >
              <span className={isActive ? 'text-white' : 'text-neutral-500'}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {badge != null && badge > 0 && !isActive && (
                <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-danger text-white text-[10px] font-medium">
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Uitloggen */}
      <div className="mt-auto border-t border-neutral-100 pt-3">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-[14px] text-danger hover:bg-red-50 w-full transition-colors duration-150"
        >
          <IconLogout size={16} />
          Uitloggen
        </button>
      </div>
    </div>
  )
}

function DashboardLayout({ children, reviewBadge }: { children: React.ReactNode; reviewBadge?: number }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[200px] bg-white border-r border-neutral-100 flex-col sticky top-0 h-screen">
        <DashboardSidebar reviewBadge={reviewBadge} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-[220px] bg-white h-full shadow-modal flex flex-col">
            <DashboardSidebar onClose={() => setMobileOpen(false)} reviewBadge={reviewBadge} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 bg-white border-b border-neutral-100 px-4 h-[52px]">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-neutral-500 hover:text-neutral-900"
            aria-label="Menu openen"
          >
            <IconMenu2 size={22} />
          </button>
          <span className="font-serif text-[17px] text-primary">
            TrustGarage<span className="text-neutral-900">.nl</span>
          </span>
        </div>

        <main className="flex-1 bg-surface p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

// ─── Profile completeness ─────────────────────────────────────────────────────

function computeCompleteness(g: GarageData): number {
  let score = 0
  if (g.name) score += 20
  if (g.address && g.city) score += 15
  if (g.phone) score += 10
  if (g.email) score += 10
  if (g.website) score += 10
  if (g.description && g.description.length > 30) score += 15
  if (g.garage_services.length > 0) score += 10
  if (g.garage_hours.length > 0) score += 10
  return score
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { garage, loading } = useGarage()
  const { weekViews, totalViews, loadingViews } = useDashboardViews(garage?.id)

  const reviews = garage?.reviews ?? []
  const reviewCount = reviews.length
  const avgRating = reviewCount > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviewCount : 0
  const unanswered = reviews.filter(r => r.garage_replies.length === 0).length
  const repliesGiven = reviews.filter(r => r.garage_replies.length > 0).length
  const completeness = garage ? computeCompleteness(garage) : 0
  const maxViews = Math.max(...weekViews.map(d => d.views), 1)

  return (
    <DashboardLayout reviewBadge={unanswered}>
      <h3 className="text-[22px] font-medium text-neutral-900 mb-6">Overzicht</h3>

      {garage?.suspended && (
        <p className="text-[13px] text-danger bg-danger/5 border border-danger/20 rounded-lg px-4 py-3 mb-5">
          Uw garage is momenteel geschorst en niet zichtbaar in zoekresultaten of op uw
          profielpagina. Neem contact op met TrustGarage voor meer informatie.
        </p>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Profielweergaven */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-4">
          <p className="text-[12px] text-neutral-500 mb-1">Profielweergaven</p>
          <p className="text-[28px] font-semibold text-neutral-900 leading-none mb-2">
            {loadingViews ? '—' : totalViews}
          </p>
          <div className="flex items-center gap-1 text-[12px] text-primary">
            <IconTrendingUp size={13} />
            <span>Totaal bezoeken</span>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-4">
          <p className="text-[12px] text-neutral-500 mb-1">Reviews</p>
          <p className="text-[28px] font-semibold text-neutral-900 leading-none mb-2">
            {loading ? '—' : reviewCount}
          </p>
          {unanswered > 0 ? (
            <div className="flex items-center gap-1 text-[12px] text-danger">
              <span className="inline-block w-2 h-2 rounded-full bg-danger" />
              {unanswered} onbeantwoord
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[12px] text-primary">
              <IconCircleCheck size={13} />
              <span>Alles beantwoord</span>
            </div>
          )}
        </div>

        {/* Gemiddelde rating */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-4">
          <p className="text-[12px] text-neutral-500 mb-1">Gemiddelde rating</p>
          <p className="text-[28px] font-semibold text-neutral-900 leading-none mb-2">
            {loading ? '—' : reviewCount > 0 ? avgRating.toFixed(1) : '—'}
          </p>
          <div className="flex items-center gap-[2px]">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} width="12" height="12" viewBox="0 0 16 16" fill={s <= Math.round(avgRating) ? '#EF9F27' : '#E4E4E4'}>
                <path d="M8 1l1.854 4.146L14 5.854l-3 2.854.708 4.146L8 10.854l-3.708 1.952L5 8.708 2 5.854l4.146-.708z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Reacties gegeven */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-4">
          <p className="text-[12px] text-neutral-500 mb-1">Reacties gegeven</p>
          <p className="text-[28px] font-semibold text-neutral-900 leading-none mb-2">
            {loading ? '—' : repliesGiven}
          </p>
          <div className="flex items-center gap-1 text-[12px] text-primary">
            <IconCircleCheck size={13} />
            <span>van de {reviewCount} reviews</span>
          </div>
        </div>

        {/* Favorieten */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-4">
          <p className="text-[12px] text-neutral-500 mb-1">Favorieten</p>
          <p className="text-[28px] font-semibold text-neutral-900 leading-none mb-2">
            {loading ? '—' : (garage?.favorites_count ?? 0)}
          </p>
          <div className="flex items-center gap-1 text-[12px] text-danger">
            <IconHeartFilled size={13} />
            <span>gebruikers</span>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-[9px] border border-neutral-100 p-5 mt-6">
        <p className="text-[14px] font-medium text-neutral-900 mb-5">Profielweergaven afgelopen 7 dagen</p>
        {loadingViews ? (
          <div className="h-[120px] flex items-center justify-center">
            <span className="text-[13px] text-neutral-300">Laden...</span>
          </div>
        ) : (
          <div className="flex items-end gap-2 h-[120px]">
            {weekViews.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-1">
                {d.views > 0 && (
                  <span className="text-[11px] text-neutral-500">{d.views}</span>
                )}
                <div
                  className={cn(
                    'w-full rounded-t-sm transition-all',
                    d.isToday ? 'bg-primary' : 'bg-[#E4E4E4]'
                  )}
                  style={{ height: `${Math.round((d.views / maxViews) * 80)}px`, minHeight: d.views > 0 ? '4px' : '0' }}
                />
                <span className={cn('text-[11px]', d.isToday ? 'text-primary font-medium' : 'text-neutral-500')}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile completeness */}
      <div className="bg-white rounded-[9px] border border-neutral-100 p-5 mt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[14px] font-medium text-neutral-900">Profielvolledigheid</p>
          <span className="text-[14px] font-semibold text-primary">{completeness}%</span>
        </div>
        <div className="h-[5px] bg-[#F0F0F0] rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${completeness}%` }} />
        </div>
        <p className="text-[12px] text-neutral-500 mt-2">
          {completeness < 100
            ? 'Voeg meer informatie toe om beter gevonden te worden.'
            : 'Uw profiel is volledig ingevuld.'}
        </p>
      </div>

      {/* Upgrade card — alleen voor garages die nog geen betaald plan hebben */}
      {(!garage || garage.plan === 'free') && (
        <div className="border-[1.5px] border-primary bg-[#F7FDF9] rounded-[9px] p-5 mt-4">
          <p className="text-[16px] font-semibold text-neutral-900 mb-1">Upgrade naar Premium</p>
          <p className="text-[13px] text-neutral-500 mb-4">Bereik meer klanten en bouw vertrouwen op.</p>
          <ul className="flex flex-col gap-2 mb-5">
            {[
              'Reageren op reviews',
              'Statistieken & inzichten',
              '"Aanbevolen"-badge in zoekresultaten',
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 text-[13px] text-neutral-900">
                <IconCircleCheck size={15} className="text-primary shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
          <Link href="/dashboard/abonnement" className="btn-primary text-[13px] py-[9px] px-5 rounded-md inline-flex items-center gap-2">
            Upgrade nu
          </Link>
        </div>
      )}
    </DashboardLayout>
  )
}
