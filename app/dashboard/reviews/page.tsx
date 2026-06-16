'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconChartBar,
  IconStar,
  IconStarFilled,
  IconCircleCheck,
  IconShieldCheck,
  IconMenu2,
  IconX,
  IconLogout,
} from '@tabler/icons-react'
import { cn, getInitials } from '@/lib/utils'
import { mockReviews } from '@/lib/mock-data'
import type { Review } from '@/types'

// ─── Shared Dashboard Layout ──────────────────────────────────────────────────

const navItems = [
  { href: '/dashboard', label: 'Overzicht', icon: <IconChartBar size={16} /> },
  { href: '/dashboard/profiel', label: 'Profiel', icon: <IconShieldCheck size={16} /> },
  { href: '/dashboard/reviews', label: 'Reviews', icon: <IconStar size={16} />, badge: 2 },
  { href: '/dashboard/abonnement', label: 'Abonnement', icon: <IconCircleCheck size={16} /> },
]

function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

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

      <div className="mt-auto border-t border-neutral-100 pt-3">
        <button className="flex items-center gap-2 px-3 py-2 rounded-md text-[14px] text-danger hover:bg-red-50 w-full transition-colors duration-150">
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
      <aside className="hidden md:flex w-[200px] bg-white border-r border-neutral-100 flex-col sticky top-0 h-screen">
        <DashboardSidebar />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[220px] bg-white h-full shadow-modal flex flex-col">
            <DashboardSidebar onClose={() => setMobileOpen(false)} />
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

// ─── Star row ─────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((s) =>
        s <= rating ? (
          <IconStarFilled key={s} size={13} className="text-amber" />
        ) : (
          <IconStar key={s} size={13} className="text-neutral-300" />
        )
      )}
    </div>
  )
}

// ─── Review card with inline reply ───────────────────────────────────────────

function ReviewRow({ review, isNew }: { review: Review; isNew: boolean }) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmitReply(e: React.FormEvent) {
    e.preventDefault()
    if (!replyText.trim()) return
    setSubmitted(true)
    setReplyOpen(false)
  }

  const initials = getInitials(review.user_name)

  return (
    <div className="bg-white border border-neutral-100 rounded-[9px] p-4">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center shrink-0">
          <span className="text-[12px] font-semibold text-primary">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[14px] font-semibold text-neutral-900">{review.user_name}</span>
            {isNew && (
              <span className="inline-flex items-center px-[7px] py-[2px] rounded-sm bg-danger text-white text-[10px] font-medium">
                Nieuw
              </span>
            )}
            {review.is_expat && (
              <span className="inline-flex items-center px-[7px] py-[2px] rounded-sm bg-info-light text-info text-[10px] font-medium">
                Expat
              </span>
            )}
          </div>

          {/* Stars + date */}
          <div className="flex items-center gap-2 mb-2">
            <Stars rating={review.rating} />
            <span className="text-[11px] text-neutral-300">
              {new Date(review.created_at).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          {/* Review text */}
          <p className="text-[13px] text-neutral-900 leading-relaxed mb-3">{review.text}</p>

          {/* Existing reply */}
          {(review.reply || submitted) && (
            <div className="bg-surface border border-neutral-100 rounded-md px-3 py-2 mb-3">
              <p className="text-[11px] font-semibold text-primary mb-1">Uw reactie</p>
              <p className="text-[12px] text-neutral-500 leading-relaxed">
                {submitted && !review.reply ? replyText : review.reply?.text}
              </p>
            </div>
          )}

          {/* Reply toggle / form */}
          {!review.reply && !submitted && (
            <>
              {!replyOpen ? (
                <button
                  onClick={() => setReplyOpen(true)}
                  className="text-[12px] text-primary font-medium hover:underline"
                >
                  Reageer
                </button>
              ) : (
                <form onSubmit={handleSubmitReply} className="flex flex-col gap-2 mt-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    placeholder="Schrijf uw reactie..."
                    className="w-full px-3 py-2 border border-[#D8D8D8] rounded-md bg-white text-[13px] text-neutral-900 outline-none resize-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(15,110,86,0.12)] transition-all duration-100 placeholder:text-neutral-300"
                  />
                  <div className="flex items-center gap-2">
                    <button type="submit" className="btn-primary text-[12px] py-[7px] px-4">
                      Versturen
                    </button>
                    <button
                      type="button"
                      onClick={() => { setReplyOpen(false); setReplyText('') }}
                      className="text-[12px] text-neutral-500 hover:text-neutral-900"
                    >
                      Annuleren
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// Reviews for garage '1'. Reviews without a reply are "new/unanswered".
const garageReviews = mockReviews.filter((r) => r.garage_id === '1')

export default function ReviewsPage() {
  const unanswered = garageReviews.filter((r) => !r.reply).length

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[22px] font-medium text-neutral-900">Reviews</h3>
        <div className="flex items-center gap-2 text-[13px] text-neutral-500">
          <span className="font-semibold text-neutral-900">{garageReviews.length}</span> reviews
          {unanswered > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-sm bg-danger/10 text-danger text-[12px] font-medium">
              {unanswered} onbeantwoord
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 max-w-[720px]">
        {garageReviews.map((review) => (
          <ReviewRow
            key={review.id}
            review={review}
            isNew={!review.reply}
          />
        ))}

        {garageReviews.length === 0 && (
          <div className="bg-white border border-neutral-100 rounded-[9px] p-10 text-center">
            <p className="text-[14px] text-neutral-500">Nog geen reviews ontvangen.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
