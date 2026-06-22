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
import { useInvitations } from '@/hooks/useInvitations'

// ─── Shared Dashboard Layout ──────────────────────────────────────────────────

const navItems = [
  { href: '/dashboard', label: 'Overzicht', icon: <IconChartBar size={16} /> },
  { href: '/dashboard/profiel', label: 'Profiel', icon: <IconShieldCheck size={16} /> },
  { href: '/dashboard/reviews', label: 'Reviews', icon: <IconStar size={16} /> },
  { href: '/dashboard/uitnodigingen', label: 'Uitnodigingen', icon: <IconMailForward size={16} /> },
  { href: '/dashboard/afspraken', label: 'Afspraken', icon: <IconCalendarEvent size={16} /> },
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

// ─── Status label ─────────────────────────────────────────────────────────────

function StatusBadge({ status, hasReview, verified }: { status: string; hasReview: boolean; verified: boolean }) {
  if (verified) {
    return <span className="text-[12px] text-primary font-medium">Geverifieerd</span>
  }
  if (hasReview) {
    return <span className="text-[12px] text-neutral-500">Review ontvangen</span>
  }
  if (status === 'sent') {
    return <span className="text-[12px] text-neutral-300">Verstuurd</span>
  }
  return <span className="text-[12px] text-neutral-300">{status}</span>
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UitnodigingenPage() {
  const { garage, loading: loadingGarage } = useGarage()
  const { invitations, loading: loadingInvitations, refetch } = useInvitations(garage?.id)

  const [email, setEmail] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const unanswered = garage?.reviews.filter(r => r.garage_replies.length === 0).length ?? 0

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!garage) return
    setSending(true)
    setError('')
    setSuccess('')

    const res = await fetch('/api/garage/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ garageId: garage.id, customerEmail: email, invoiceNumber }),
    })
    const result = await res.json()
    setSending(false)

    if (!res.ok) {
      setError(result.error ?? 'Er is een fout opgetreden.')
      return
    }

    setSuccess(
      result.emailSent
        ? 'Uitnodiging verstuurd!'
        : 'Uitnodiging aangemaakt, maar de e-mail kon niet worden verzonden.'
    )
    setEmail('')
    setInvoiceNumber('')
    await refetch()
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
    <DashboardLayout reviewBadge={unanswered}>
      <h3 className="text-[22px] font-medium text-neutral-900 mb-1">Uitnodigingen</h3>
      <p className="text-[13px] text-neutral-500 mb-6 max-w-[600px]">
        Nodig een klant uit om een review te schrijven. Vul het factuurnummer in dat bij dit
        bezoek hoort — als de klant bij het schrijven van de review hetzelfde nummer invult,
        wordt die review beoordeeld voor een &quot;Geverifieerd bezoek&quot;-badge.
      </p>

      <form onSubmit={handleSend} className="bg-white border border-neutral-100 rounded-[9px] p-5 max-w-[480px] mb-8">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-neutral-500">E-mailadres klant</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="klant@email.nl"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-neutral-500">Factuurnummer</label>
            <input
              type="text"
              className="input-field"
              value={invoiceNumber}
              onChange={e => setInvoiceNumber(e.target.value)}
              placeholder="Bijv. 2024-00123"
              required
            />
          </div>
          {error && <p className="text-[12px] text-danger">{error}</p>}
          {success && <p className="text-[12px] text-primary">{success}</p>}
          <button
            type="submit"
            disabled={sending}
            className={cn('btn-primary self-start', sending && 'opacity-50 cursor-not-allowed')}
          >
            {sending ? 'Versturen...' : 'Uitnodiging versturen'}
          </button>
        </div>
      </form>

      <h4 className="text-[14px] font-semibold text-neutral-900 mb-3">Verstuurde uitnodigingen</h4>
      {loadingInvitations ? (
        <p className="text-[13px] text-neutral-400">Laden...</p>
      ) : invitations.length === 0 ? (
        <p className="text-[13px] text-neutral-400">Nog geen uitnodigingen verstuurd.</p>
      ) : (
        <div className="bg-white border border-neutral-100 rounded-[9px] overflow-hidden max-w-[720px]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-surface text-left text-neutral-500 border-b border-neutral-100">
                <th className="px-4 py-2 font-medium">E-mail</th>
                <th className="px-4 py-2 font-medium">Factuurnummer</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map(inv => (
                <tr key={inv.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-2 text-neutral-900">{inv.customer_email}</td>
                  <td className="px-4 py-2 text-neutral-500">{inv.invoice_number}</td>
                  <td className="px-4 py-2">
                    <StatusBadge
                      status={inv.status}
                      hasReview={!!inv.reviews}
                      verified={inv.reviews?.verified ?? false}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
