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
  IconMenu2,
  IconX,
  IconLogout,
  IconCheck,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useGarage } from '@/hooks/useGarage'

// ─── Shared Dashboard Layout ──────────────────────────────────────────────────

const navItems = [
  { href: '/dashboard', label: 'Overzicht', icon: <IconChartBar size={16} /> },
  { href: '/dashboard/profiel', label: 'Profiel', icon: <IconShieldCheck size={16} /> },
  { href: '/dashboard/reviews', label: 'Reviews', icon: <IconStar size={16} /> },
  { href: '/dashboard/uitnodigingen', label: 'Uitnodigingen', icon: <IconMailForward size={16} /> },
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

// ─── Plan data ────────────────────────────────────────────────────────────────

type PlanKey = 'free' | 'premium' | 'business'

const CURRENT_PLAN: PlanKey = 'free'

interface PlanDef {
  key: PlanKey
  name: string
  price: string
  sub: string
  color: string
  badge: string
  badgeClass: string
  features: string[]
  cta: string
  ctaVariant: 'disabled' | 'primary' | 'secondary'
}

const PLANS: PlanDef[] = [
  {
    key: 'free',
    name: 'Gratis',
    price: '€0',
    sub: 'voor altijd',
    color: 'border-neutral-100',
    badge: 'Gratis',
    badgeClass: 'bg-[#F5F5F5] text-neutral-500',
    features: [
      'Basisprofiel met contactgegevens',
      'Tot 5 reviews ontvangen',
      'Standaard zoekplaatsing',
      'KVK-verificatie badge',
    ],
    cta: 'Huidig plan',
    ctaVariant: 'disabled',
  },
  {
    key: 'premium',
    name: 'Premium',
    price: '€29',
    sub: 'per maand',
    color: 'border-primary',
    badge: 'Populair',
    badgeClass: 'bg-primary text-white',
    features: [
      'Alles van Gratis',
      'Uitgelicht in zoekresultaten',
      'Onbeperkt foto\'s uploaden',
      'Onbeperkt reviews ontvangen',
      'Statistieken & inzichten',
      'Prioriteit klantenservice',
    ],
    cta: 'Upgrade naar Premium',
    ctaVariant: 'primary',
  },
  {
    key: 'business',
    name: 'Business',
    price: '€79',
    sub: 'per maand',
    color: 'border-neutral-100',
    badge: 'Business',
    badgeClass: 'bg-[#FAEEDA] text-[#633806]',
    features: [
      'Alles van Premium',
      'Meerdere locaties beheren',
      'API-integratie',
      'Dedicated accountmanager',
      'Aangepaste rapportages',
      'Vroeg toegang tot nieuwe functies',
    ],
    cta: 'Contact opnemen',
    ctaVariant: 'secondary',
  },
]

// Feature comparison table rows
const COMPARISON_FEATURES: { label: string; free: boolean | string; premium: boolean | string; business: boolean | string }[] = [
  { label: 'Basisprofiel', free: true, premium: true, business: true },
  { label: 'KVK-verificatie', free: true, premium: true, business: true },
  { label: 'Reviews ontvangen', free: 'Max. 5', premium: 'Onbeperkt', business: 'Onbeperkt' },
  { label: "Foto's uploaden", free: 'Max. 3', premium: 'Onbeperkt', business: 'Onbeperkt' },
  { label: 'Uitgelicht in zoeken', free: false, premium: true, business: true },
  { label: 'Statistieken', free: false, premium: true, business: true },
  { label: 'Meerdere locaties', free: false, premium: false, business: true },
  { label: 'API-integratie', free: false, premium: false, business: true },
  { label: 'Accountmanager', free: false, premium: false, business: true },
]

function FeatureCell({ value }: { value: boolean | string }) {
  if (value === true) return <IconCheck size={15} className="text-primary mx-auto" />
  if (value === false) return <span className="text-neutral-300 text-[12px] mx-auto block text-center">—</span>
  return <span className="text-[12px] text-neutral-500 block text-center">{value}</span>
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AbonnementPage() {
  const { garage } = useGarage()
  const unanswered = garage?.reviews.filter(r => r.garage_replies.length === 0).length ?? 0

  return (
    <DashboardLayout reviewBadge={unanswered}>
      <div className="max-w-[860px]">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-[22px] font-medium text-neutral-900">Abonnement</h3>
          <span className={cn(
            'inline-flex items-center px-2 py-[3px] rounded-sm text-[11px] font-medium',
            CURRENT_PLAN === 'free' && 'bg-[#F5F5F5] text-neutral-500',
            CURRENT_PLAN === 'premium' && 'bg-primary text-white',
            CURRENT_PLAN === 'business' && 'bg-[#FAEEDA] text-[#633806]',
          )}>
            {CURRENT_PLAN === 'free' && 'Gratis plan'}
            {CURRENT_PLAN === 'premium' && 'Premium plan'}
            {CURRENT_PLAN === 'business' && 'Business plan'}
          </span>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {PLANS.map((plan) => {
            const isCurrent = plan.key === CURRENT_PLAN
            return (
              <div
                key={plan.key}
                className={cn(
                  'bg-white rounded-[9px] border p-5 flex flex-col',
                  plan.key === 'premium' ? 'border-[1.5px] border-primary' : 'border-neutral-100',
                  isCurrent && 'ring-2 ring-primary/20'
                )}
              >
                {/* Badge */}
                <span className={cn('inline-flex w-fit items-center px-2 py-[3px] rounded-sm text-[10px] font-medium mb-3', plan.badgeClass)}>
                  {plan.badge}
                </span>

                {/* Name */}
                <p className="text-[16px] font-semibold text-neutral-900 mb-1">{plan.name}</p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-[28px] font-bold text-neutral-900">{plan.price}</span>
                  <span className="text-[12px] text-neutral-500">{plan.sub}</span>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-2 flex-1 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-neutral-900">
                      <IconCheck size={14} className="text-primary shrink-0 mt-[2px]" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.ctaVariant === 'disabled' && (
                  <button
                    disabled
                    className="btn-ghost text-[13px] py-[8px] w-full opacity-60 cursor-not-allowed"
                  >
                    {plan.cta}
                  </button>
                )}
                {plan.ctaVariant === 'primary' && (
                  <button className="btn-primary text-[13px] py-[8px] w-full">
                    {plan.cta}
                  </button>
                )}
                {plan.ctaVariant === 'secondary' && (
                  <button className="btn-secondary text-[13px] py-[8px] w-full">
                    {plan.cta}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Comparison table */}
        <div className="bg-white border border-neutral-100 rounded-[9px] overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <p className="text-[14px] font-semibold text-neutral-900">Vergelijking</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="px-5 py-3 text-[12px] font-medium text-neutral-500 w-[45%]">Functie</th>
                  <th className="px-3 py-3 text-[12px] font-medium text-neutral-500 text-center">Gratis</th>
                  <th className="px-3 py-3 text-[12px] font-medium text-primary text-center">Premium</th>
                  <th className="px-3 py-3 text-[12px] font-medium text-neutral-500 text-center">Business</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, i) => (
                  <tr
                    key={row.label}
                    className={cn(
                      'border-b border-neutral-100 last:border-0',
                      i % 2 === 1 && 'bg-surface'
                    )}
                  >
                    <td className="px-5 py-3 text-[13px] text-neutral-900">{row.label}</td>
                    <td className="px-3 py-3">
                      <FeatureCell value={row.free} />
                    </td>
                    <td className="px-3 py-3 bg-primary-light/30">
                      <FeatureCell value={row.premium} />
                    </td>
                    <td className="px-3 py-3">
                      <FeatureCell value={row.business} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-[12px] text-neutral-300 mt-4 text-center">
          Alle prijzen zijn exclusief BTW. U kunt op elk moment opzeggen.
        </p>
      </div>
    </DashboardLayout>
  )
}
