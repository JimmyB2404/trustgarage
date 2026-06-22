'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  IconChartBar,
  IconStar,
  IconEdit,
  IconTrash,
  IconCircleCheck,
  IconLogout,
  IconHeart,
  IconCalendarEvent,
  IconUser,
  IconChevronDown,
  IconCheck,
  IconX,
  IconMessageCircle,
} from '@tabler/icons-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getInitials } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase'

type Review = {
  id: string
  rating: number
  text: string
  created_at: string
  verified: boolean
  garages: { name: string; slug: string } | null
}

function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, signOut } = useAuth()

  const displayName = user?.user_metadata?.name || user?.email || ''
  const displayEmail = user?.email || ''

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  const navItems = [
    { href: '/account/reviews', label: 'Mijn reviews', icon: IconChartBar },
    { href: '/account/profiel', label: 'Mijn profiel', icon: IconUser },
    { href: '/account/favorieten', label: 'Favorieten', icon: IconHeart },
    { href: '/account/aanvragen', label: 'Aanvragen', icon: IconCalendarEvent },
  ]

  const activeItem = navItems.find(item => pathname === item.href) ?? navItems[0]

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
            <button onClick={handleSignOut} className="w-full flex items-center gap-2.5 px-4 py-[10px] text-[13px] text-danger hover:bg-red-50 transition-colors duration-100">
              <IconLogout size={15} />
              Uitloggen
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default function MyReviewsPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('reviews')
      .select('id, rating, text, created_at, verified, garages(name, slug)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReviews((data as unknown as Review[]) ?? [])
        setLoading(false)
      })
  }, [user])

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('reviews').delete().eq('id', id)
    setReviews(prev => prev.filter(r => r.id !== id))
    setDeletingId(null)
  }

  async function handleSaveEdit(id: string) {
    const supabase = createClient()
    await supabase.from('reviews').update({ text: editText }).eq('id', id)
    setReviews(prev => prev.map(r => r.id === id ? { ...r, text: editText } : r))
    setEditingId(null)
  }

  function startEdit(review: Review) {
    setEditingId(review.id)
    setEditText(review.text)
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6 items-start">
          <AccountSidebar />

          <main className="flex-1 min-w-0">
            <h1 className="text-[34px] sm:text-[36px] font-normal font-serif text-neutral-900 mb-6">
              Mijn reviews
            </h1>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-neutral-100 rounded-xl shadow-card px-4 py-4">
                <div className="text-[13px] text-neutral-500 mb-1">Mijn reviews</div>
                <div className="text-[28px] font-serif text-neutral-900 leading-none">{reviews.length}</div>
              </div>
              <div className="bg-white border border-neutral-100 rounded-xl shadow-card px-4 py-4">
                <div className="text-[13px] text-neutral-500 mb-1">Gemiddeld cijfer</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[28px] font-serif text-neutral-900 leading-none">{avgRating}</span>
                  {reviews.length > 0 && <IconStar size={14} style={{ color: '#EF9F27' }} />}
                </div>
              </div>
              <div className="bg-white border border-neutral-100 rounded-xl shadow-card px-4 py-4">
                <div className="text-[13px] text-neutral-500 mb-1">Garages bezocht</div>
                <div className="text-[28px] font-serif text-neutral-900 leading-none">
                  {new Set(reviews.map(r => r.garages?.name)).size}
                </div>
              </div>
            </div>

            {/* Review list */}
            {loading ? (
              <div className="text-[14px] text-neutral-400 py-8 text-center">Reviews laden...</div>
            ) : reviews.length === 0 ? (
              <div className="bg-white border border-neutral-100 rounded-xl shadow-card py-16 px-6 flex flex-col items-center text-center">
                <div className="w-[56px] h-[56px] rounded-full bg-primary-light flex items-center justify-center mb-4">
                  <IconMessageCircle size={26} className="text-primary" />
                </div>
                <p className="text-[16px] font-medium text-neutral-900 mb-1">Nog geen reviews</p>
                <p className="text-[14px] text-neutral-500 mb-6 max-w-[280px]">
                  Zoek een garage en schrijf je eerste review.
                </p>
                <Link href="/zoeken" className="btn-primary">Zoek een garage</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews.map(review => {
                  const garageName = review.garages?.name ?? 'Onbekende garage'
                  const isEditing = editingId === review.id
                  const isDeleting = deletingId === review.id

                  return (
                    <div key={review.id} className="bg-white border border-neutral-100 rounded-xl shadow-card p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-[34px] h-[34px] rounded-[7px] bg-primary-light text-primary flex items-center justify-center text-[12px] font-medium flex-shrink-0">
                          {getInitials(garageName)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              {review.garages?.slug ? (
                                <Link href={`/garage/${review.garages.slug}`} className="text-[13px] font-medium text-neutral-900 hover:text-primary">
                                  {garageName}
                                </Link>
                              ) : (
                                <div className="text-[13px] font-medium text-neutral-900">{garageName}</div>
                              )}
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="flex items-center gap-0.5">
                                  {Array.from({ length: review.rating }).map((_, i) => (
                                    <IconStar key={i} size={11} fill="#EF9F27" color="#EF9F27" />
                                  ))}
                                </span>
                                <span className="text-[11px] text-neutral-300">{formatDate(review.created_at)}</span>
                              </div>
                            </div>

                            {!isDeleting && !isEditing && (
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={() => startEdit(review)}
                                  className="btn-ghost px-3 py-[6px] text-[12px] flex items-center gap-1.5 rounded-md"
                                >
                                  <IconEdit size={13} />
                                  Bewerken
                                </button>
                                <button
                                  onClick={() => setDeletingId(review.id)}
                                  className="btn-danger px-3 py-[6px] text-[12px] flex items-center gap-1.5 rounded-md"
                                >
                                  <IconTrash size={13} />
                                  Verwijderen
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Inline edit */}
                          {isEditing ? (
                            <div className="mt-3 flex flex-col gap-2">
                              <textarea
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                rows={3}
                                className="input-field resize-none text-[13px]"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveEdit(review.id)}
                                  className="btn-primary px-3 py-[6px] text-[12px] flex items-center gap-1.5 rounded-md"
                                >
                                  <IconCheck size={13} />
                                  Opslaan
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="btn-ghost px-3 py-[6px] text-[12px] flex items-center gap-1.5 rounded-md"
                                >
                                  <IconX size={13} />
                                  Annuleren
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-2 text-[13px] text-neutral-500 leading-[1.6]">{review.text}</p>
                          )}

                          {/* Delete confirm */}
                          {isDeleting && (
                            <div className="mt-3 flex items-center gap-3 bg-red-50 rounded-lg px-3 py-2">
                              <span className="text-[12px] text-danger flex-1">Weet je zeker dat je deze review wilt verwijderen?</span>
                              <button
                                onClick={() => handleDelete(review.id)}
                                className="btn-danger px-3 py-[5px] text-[12px] rounded-md"
                              >
                                Ja, verwijderen
                              </button>
                              <button
                                onClick={() => setDeletingId(null)}
                                className="btn-ghost px-3 py-[5px] text-[12px] rounded-md"
                              >
                                Annuleren
                              </button>
                            </div>
                          )}

                          {review.verified && !isEditing && !isDeleting && (
                            <div className="mt-2 flex items-center gap-1 text-[11px] text-primary">
                              <IconCircleCheck size={12} />
                              Geverifieerde review
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
