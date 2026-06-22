'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  IconChartBar,
  IconStar,
  IconCircleCheck,
  IconShieldCheck,
  IconMailForward,
  IconCalendarEvent,
  IconTrendingUp,
  IconMenu2,
  IconX,
  IconLogout,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useGarage } from '@/hooks/useGarage'
import { useInsights } from '@/hooks/useInsights'

// ─── Shared Dashboard Layout ──────────────────────────────────────────────────

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
      <aside className="hidden md:flex w-[200px] bg-white border-r border-neutral-100 flex-col sticky top-0 h-screen">
        <DashboardSidebar reviewBadge={reviewBadge} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[220px] bg-white h-full shadow-modal flex flex-col">
            <DashboardSidebar onClose={() => setMobileOpen(false)} reviewBadge={reviewBadge} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center gap-3 bg-white border-b border-neutral-100 px-4 h-[52px]">
          <button onClick={() => setMobileOpen(true)} className="text-neutral-500 hover:text-neutral-900" aria-label="Menu openen">
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

// ─── Comparison row ─────────────────────────────────────────────────────────

function ComparisonRow({ label, own, regional, format, higherIsBetter = true }: {
  label: string
  own: number
  regional: number
  format: (v: number) => string
  higherIsBetter?: boolean
}) {
  const diff = own - regional
  const isBetter = higherIsBetter ? diff > 0 : diff < 0
  const isWorse = higherIsBetter ? diff < 0 : diff > 0

  return (
    <div className="bg-white border border-neutral-100 rounded-[9px] p-4">
      <p className="text-[12px] text-neutral-500 mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[24px] font-semibold text-neutral-900 leading-none">{format(own)}</p>
          <p className="text-[11px] text-neutral-300 mt-1">Uw garage</p>
        </div>
        <div className="text-right">
          <p className="text-[16px] font-medium text-neutral-500 leading-none">{format(regional)}</p>
          <p className="text-[11px] text-neutral-300 mt-1">Regionaal gemiddelde</p>
        </div>
      </div>
      {Math.abs(diff) > 0.001 && (
        <p className={cn('text-[12px] mt-2', isBetter && 'text-primary', isWorse && 'text-danger')}>
          {isBetter ? '↑' : '↓'} {format(Math.abs(diff))} {isBetter ? 'boven' : 'onder'} het gemiddelde
        </p>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InzichtenPage() {
  const { garage, loading: loadingGarage } = useGarage()
  const { insights, loading: loadingInsights } = useInsights(garage?.id)

  const unanswered = garage?.reviews.filter(r => r.garage_replies.length === 0).length ?? 0

  if (loadingGarage || loadingInsights) {
    return (
      <DashboardLayout reviewBadge={unanswered}>
        <div className="flex items-center justify-center h-64">
          <span className="text-neutral-400 text-[14px]">Laden...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (!insights || insights.gated) {
    return (
      <DashboardLayout reviewBadge={unanswered}>
        <h3 className="text-[22px] font-medium text-neutral-900 mb-1">Inzichten</h3>
        <p className="text-[13px] text-neutral-500 mb-6 max-w-[600px]">
          Zie hoe uw garage scoort t.o.v. andere garages in uw regio.
        </p>
        <div className="border-[1.5px] border-primary bg-[#F7FDF9] rounded-[9px] p-5 max-w-[480px]">
          <p className="text-[16px] font-semibold text-neutral-900 mb-1">Exclusief voor Business</p>
          <p className="text-[13px] text-neutral-500 mb-4">
            Upgrade naar Business om te zien hoe uw beoordeling, aantal reviews en reactiesnelheid
            zich verhouden tot het regionaal gemiddelde.
          </p>
          <Link href="/dashboard/abonnement" className="btn-primary text-[13px] py-[9px] px-5 rounded-md inline-flex items-center gap-2">
            Upgrade naar Business
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const { own, regional, city } = insights
  if (!own || !regional) return null

  return (
    <DashboardLayout reviewBadge={unanswered}>
      <h3 className="text-[22px] font-medium text-neutral-900 mb-1">Inzichten</h3>
      <p className="text-[13px] text-neutral-500 mb-6 max-w-[600px]">
        Vergeleken met {regional.garageCount} andere {regional.garageCount === 1 ? 'garage' : "garage's"} in {city}.
      </p>

      {regional.garageCount === 0 ? (
        <p className="text-[13px] text-neutral-400">
          Nog geen andere garages in {city} om mee te vergelijken.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[760px]">
          <ComparisonRow
            label="Gemiddelde beoordeling"
            own={own.avgRating}
            regional={regional.avgRating}
            format={v => v.toFixed(1)}
          />
          <ComparisonRow
            label="Aantal reviews"
            own={own.reviewCount}
            regional={regional.avgReviewCount}
            format={v => Math.round(v).toString()}
          />
          <ComparisonRow
            label="Reactiesnelheid"
            own={own.responseRate}
            regional={regional.avgResponseRate}
            format={v => `${Math.round(v)}%`}
          />
        </div>
      )}
    </DashboardLayout>
  )
}
