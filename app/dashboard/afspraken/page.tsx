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
  IconMenu2,
  IconX,
  IconLogout,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useGarage } from '@/hooks/useGarage'
import { useAppointments } from '@/hooks/useAppointments'

// ─── Shared Dashboard Layout ──────────────────────────────────────────────────

const navItems = [
  { href: '/dashboard', label: 'Overzicht', icon: <IconChartBar size={16} /> },
  { href: '/dashboard/profiel', label: 'Profiel', icon: <IconShieldCheck size={16} /> },
  { href: '/dashboard/reviews', label: 'Reviews', icon: <IconStar size={16} /> },
  { href: '/dashboard/uitnodigingen', label: 'Uitnodigingen', icon: <IconMailForward size={16} /> },
  { href: '/dashboard/afspraken', label: 'Afspraken', icon: <IconCalendarEvent size={16} /> },
  { href: '/dashboard/abonnement', label: 'Abonnement', icon: <IconCircleCheck size={16} /> },
]

function DashboardSidebar({ onClose, reviewBadge, appointmentBadge }: { onClose?: () => void; reviewBadge?: number; appointmentBadge?: number }) {
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
          const badge = item.href === '/dashboard/reviews'
            ? reviewBadge
            : item.href === '/dashboard/afspraken'
              ? appointmentBadge
              : undefined
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

function DashboardLayout({ children, reviewBadge, appointmentBadge }: { children: React.ReactNode; reviewBadge?: number; appointmentBadge?: number }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-[200px] bg-white border-r border-neutral-100 flex-col sticky top-0 h-screen">
        <DashboardSidebar reviewBadge={reviewBadge} appointmentBadge={appointmentBadge} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[220px] bg-white h-full shadow-modal flex flex-col">
            <DashboardSidebar onClose={() => setMobileOpen(false)} reviewBadge={reviewBadge} appointmentBadge={appointmentBadge} />
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

// ─── Page ─────────────────────────────────────────────────────────────────────

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AfsprakenPage() {
  const { garage, loading: loadingGarage } = useGarage()
  const { appointments, loading: loadingAppointments, refetch } = useAppointments(garage?.id)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const unanswered = garage?.reviews.filter(r => r.garage_replies.length === 0).length ?? 0
  const newCount = appointments.filter(a => a.status === 'nieuw').length

  async function handleMarkDone(id: string) {
    setUpdatingId(id)
    await fetch('/api/garage/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'afgehandeld' }),
    })
    await refetch()
    setUpdatingId(null)
  }

  if (loadingGarage) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <span className="text-neutral-400 text-[14px]">Laden...</span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout reviewBadge={unanswered} appointmentBadge={newCount}>
      <h3 className="text-[22px] font-medium text-neutral-900 mb-1">Afspraken</h3>
      <p className="text-[13px] text-neutral-500 mb-6 max-w-[600px]">
        Aanvragen van klanten die graag een afspraak willen maken. Dit zijn geen geboekte
        afspraken — neem zelf telefonisch of per e-mail contact op, en zet de aanvraag daarna op
        &quot;Afgehandeld&quot;.
      </p>

      {loadingAppointments ? (
        <p className="text-[13px] text-neutral-400">Laden...</p>
      ) : appointments.length === 0 ? (
        <p className="text-[13px] text-neutral-400">Nog geen afspraakaanvragen ontvangen.</p>
      ) : (
        <div className="flex flex-col gap-3 max-w-[720px]">
          {appointments.map(a => (
            <div key={a.id} className="bg-white border border-neutral-100 rounded-[9px] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-neutral-900">{a.customer_name}</p>
                  <p className="text-[13px] text-neutral-500">{a.customer_phone}</p>
                  {a.customer_email && <p className="text-[13px] text-neutral-500">{a.customer_email}</p>}
                  <p className="text-[12px] text-neutral-300 mt-1">Gewenste datum: {formatDate(a.preferred_date)}</p>
                  {a.message && <p className="text-[13px] text-neutral-900 mt-2">{a.message}</p>}
                </div>
                <span className={cn(
                  'text-[11px] font-medium px-2 py-[3px] rounded-sm flex-shrink-0',
                  a.status === 'nieuw' ? 'bg-primary-light text-primary' : 'bg-[#F5F5F5] text-neutral-500'
                )}>
                  {a.status === 'nieuw' ? 'Nieuw' : 'Afgehandeld'}
                </span>
              </div>
              {a.status === 'nieuw' && (
                <button
                  onClick={() => handleMarkDone(a.id)}
                  disabled={updatingId === a.id}
                  className={cn('btn-ghost text-[13px] py-[6px] px-3 mt-3', updatingId === a.id && 'opacity-50 cursor-not-allowed')}
                >
                  {updatingId === a.id ? 'Bezig...' : 'Markeer als afgehandeld'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
