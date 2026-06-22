'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  IconChartBar,
  IconHeart,
  IconUser,
  IconCalendarEvent,
  IconLogout,
  IconChevronDown,
} from '@tabler/icons-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getInitials, cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

type AccountAppointment = {
  id: string
  preferred_date: string | null
  message: string | null
  status: 'nieuw' | 'afgehandeld'
  created_at: string
  garages: { name: string; slug: string } | null
}

function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, signOut } = useAuth()

  const displayName = user?.user_metadata?.name || user?.email || ''
  const displayEmail = user?.email || ''

  const navItems = [
    { href: '/account/reviews', label: 'Mijn reviews', icon: IconChartBar },
    { href: '/account/profiel', label: 'Mijn profiel', icon: IconUser },
    { href: '/account/favorieten', label: 'Favorieten', icon: IconHeart },
    { href: '/account/aanvragen', label: 'Aanvragen', icon: IconCalendarEvent },
  ]

  const activeItem = navItems.find(item => pathname === item.href) ?? navItems[3]

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between gap-2 bg-white border border-neutral-100 rounded-xl px-4 py-3 shadow-card"
        >
          <div className="flex items-center gap-2">
            <div className="w-[34px] h-[34px] rounded-full bg-primary text-white flex items-center justify-center text-[13px] font-medium flex-shrink-0">
              {getInitials(displayName)}
            </div>
            <span className="text-[14px] font-medium text-neutral-900">{activeItem.label}</span>
          </div>
          <IconChevronDown size={16} className={`text-neutral-500 transition-transform duration-150 ${mobileOpen ? 'rotate-180' : ''}`} />
        </button>

        {mobileOpen && (
          <div className="mt-1 bg-white border border-neutral-100 rounded-xl shadow-card overflow-hidden">
            {navItems.map(item => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-3 text-[14px] transition-colors ${active ? 'bg-primary-light text-primary font-medium' : 'text-neutral-900 hover:bg-surface'}`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              )
            })}
            <div className="border-t border-neutral-100">
              <button onClick={handleSignOut} className="w-full flex items-center gap-2.5 px-4 py-3 text-[14px] text-danger hover:bg-red-50 transition-colors">
                <IconLogout size={16} />
                Uitloggen
              </button>
            </div>
          </div>
        )}
      </div>

      <aside className="hidden md:flex w-[220px] flex-shrink-0 flex-col">
        <div className="bg-white border border-neutral-100 rounded-xl shadow-card overflow-hidden">
          <div className="px-4 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-2.5">
              <div className="w-[42px] h-[42px] rounded-full bg-primary text-white flex items-center justify-center text-[15px] font-medium flex-shrink-0">
                {getInitials(displayName)}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-medium text-neutral-900 truncate">{displayName}</div>
                <div className="text-[12px] text-neutral-500 truncate">{displayEmail}</div>
              </div>
            </div>
          </div>

          <nav className="py-1">
            {navItems.map(item => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-4 py-[10px] text-[13px] transition-colors duration-100 ${active ? 'bg-primary-light text-primary font-medium' : 'text-neutral-900 hover:bg-surface'}`}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-neutral-100 py-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-4 py-[10px] text-[13px] text-danger hover:bg-red-50 transition-colors duration-100"
            >
              <IconLogout size={15} />
              Uitloggen
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AanvragenPage() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<AccountAppointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    fetch('/api/account/appointments')
      .then(r => r.json())
      .then(({ appointments }) => setAppointments(appointments ?? []))
      .finally(() => setLoading(false))
  }, [user])

  const isEmpty = !loading && appointments.length === 0

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6 items-start">
          <AccountSidebar />

          <main className="flex-1 min-w-0">
            <h1 className="text-[34px] sm:text-[36px] font-normal font-serif text-neutral-900 mb-6">
              Aanvragen
            </h1>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <span className="text-[14px] text-neutral-400">Laden...</span>
              </div>
            ) : isEmpty ? (
              <div className="bg-white border border-neutral-100 rounded-xl shadow-card py-16 px-6 flex flex-col items-center text-center">
                <div className="w-[56px] h-[56px] rounded-full bg-primary-light flex items-center justify-center mb-4">
                  <IconCalendarEvent size={26} className="text-primary" />
                </div>
                <p className="text-[16px] font-medium text-neutral-900 mb-1">
                  U heeft nog geen afspraakaanvragen gedaan
                </p>
                <p className="text-[14px] text-neutral-500 mb-6 max-w-[300px]">
                  Vraag op een garagepagina een afspraak aan om hier de status te volgen.
                </p>
                <Link href="/zoeken" className="btn-primary">Zoek een garage</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {appointments.map(a => (
                  <div key={a.id} className="bg-white border border-neutral-100 rounded-xl shadow-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium text-neutral-900">{a.garages?.name ?? 'Onbekende garage'}</p>
                        <p className="text-[12px] text-neutral-300 mt-1">Gewenste datum: {formatDate(a.preferred_date)}</p>
                        {a.message && <p className="text-[13px] text-neutral-500 mt-2">{a.message}</p>}
                      </div>
                      <span className={cn(
                        'text-[11px] font-medium px-2 py-[3px] rounded-sm flex-shrink-0',
                        a.status === 'nieuw' ? 'bg-primary-light text-primary' : 'bg-[#F5F5F5] text-neutral-500'
                      )}>
                        {a.status === 'nieuw' ? 'In behandeling' : 'Afgehandeld'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
