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
  IconMenu2,
  IconX,
  IconLogout,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

// ─── Shared Dashboard Layout ─────────────────────────────────────────────────

const navItems = [
  { href: '/dashboard', label: 'Overzicht', icon: <IconChartBar size={16} /> },
  { href: '/dashboard/profiel', label: 'Profiel', icon: <IconShieldCheck size={16} /> },
  { href: '/dashboard/reviews', label: 'Reviews', icon: <IconStar size={16} />, badge: 2 },
  { href: '/dashboard/abonnement', label: 'Abonnement', icon: <IconCircleCheck size={16} /> },
]

function DashboardSidebar({ onClose }: { onClose?: () => void }) {
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
              {item.badge && !isActive && (
                <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-danger text-white text-[10px] font-medium">
                  {item.badge}
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

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[200px] bg-white border-r border-neutral-100 flex-col sticky top-0 h-screen">
        <DashboardSidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-[220px] bg-white h-full shadow-modal flex flex-col">
            <DashboardSidebar onClose={() => setMobileOpen(false)} />
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

// ─── Mock week data ───────────────────────────────────────────────────────────

const weekData = [
  { day: 'Ma', views: 28 },
  { day: 'Di', views: 35 },
  { day: 'Wo', views: 42 },
  { day: 'Do', views: 31 },
  { day: 'Vr', views: 55 },
  { day: 'Za', views: 38 },
  { day: 'Zo', views: 18 },
]
const todayIndex = 4 // Vrijdag
const maxViews = Math.max(...weekData.map((d) => d.views))

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h3 className="text-[22px] font-medium text-neutral-900 mb-6">Overzicht</h3>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profielweergaven */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-4">
          <p className="text-[12px] text-neutral-500 mb-1">Profielweergaven</p>
          <p className="text-[28px] font-semibold text-neutral-900 leading-none mb-2">247</p>
          <div className="flex items-center gap-1 text-[12px] text-primary">
            <IconTrendingUp size={13} />
            <span>+12% deze week</span>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-4">
          <p className="text-[12px] text-neutral-500 mb-1">Reviews</p>
          <p className="text-[28px] font-semibold text-neutral-900 leading-none mb-2">12</p>
          <div className="flex items-center gap-1 text-[12px] text-danger">
            <span className="inline-block w-2 h-2 rounded-full bg-danger" />
            2 onbeantwoord
          </div>
        </div>

        {/* Gemiddelde rating */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-4">
          <p className="text-[12px] text-neutral-500 mb-1">Gemiddelde rating</p>
          <p className="text-[28px] font-semibold text-neutral-900 leading-none mb-2">4.8</p>
          <div className="flex items-center gap-[2px]">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} width="12" height="12" viewBox="0 0 16 16" fill={s <= 4 ? '#EF9F27' : '#E4E4E4'}>
                <path d="M8 1l1.854 4.146L14 5.854l-3 2.854.708 4.146L8 10.854l-3.708 1.952L5 8.708 2 5.854l4.146-.708z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Reacties gegeven */}
        <div className="bg-white border border-neutral-100 rounded-[9px] p-4">
          <p className="text-[12px] text-neutral-500 mb-1">Reacties gegeven</p>
          <p className="text-[28px] font-semibold text-neutral-900 leading-none mb-2">8</p>
          <div className="flex items-center gap-1 text-[12px] text-primary">
            <IconCircleCheck size={13} />
            <span>van de 12 reviews</span>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-[9px] border border-neutral-100 p-5 mt-6">
        <p className="text-[14px] font-medium text-neutral-900 mb-5">Profielweergaven deze week</p>
        <div className="flex items-end gap-2 h-[120px]">
          {weekData.map((d, i) => (
            <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-1">
              <span className="text-[11px] text-neutral-500">{d.views}</span>
              <div
                className={cn(
                  'w-full rounded-t-sm transition-all',
                  i === todayIndex ? 'bg-primary' : 'bg-[#E4E4E4]'
                )}
                style={{ height: `${Math.round((d.views / maxViews) * 80)}px` }}
              />
              <span className={cn('text-[11px]', i === todayIndex ? 'text-primary font-medium' : 'text-neutral-500')}>
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Profile completeness */}
      <div className="bg-white rounded-[9px] border border-neutral-100 p-5 mt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[14px] font-medium text-neutral-900">Profielvolledigheid</p>
          <span className="text-[14px] font-semibold text-primary">65%</span>
        </div>
        <div className="h-[5px] bg-[#F0F0F0] rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: '65%' }} />
        </div>
        <p className="text-[12px] text-neutral-500 mt-2">
          Voeg meer informatie toe om beter gevonden te worden.
        </p>
      </div>

      {/* Upgrade card */}
      <div className="border-[1.5px] border-primary bg-[#F7FDF9] rounded-[9px] p-5 mt-4">
        <p className="text-[16px] font-semibold text-neutral-900 mb-1">Upgrade naar Premium</p>
        <p className="text-[13px] text-neutral-500 mb-4">Bereik meer klanten en bouw vertrouwen op.</p>
        <ul className="flex flex-col gap-2 mb-5">
          {[
            'Uitgelicht in zoekresultaten',
            'Onbeperkt foto\'s uploaden',
            'Prioriteit klantenservice',
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
    </DashboardLayout>
  )
}
