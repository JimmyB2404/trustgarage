'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconChartBar,
  IconStar,
  IconEdit,
  IconTrash,
  IconCircleCheck,
  IconLogout,
  IconHeart,
  IconUser,
  IconChevronDown,
} from '@tabler/icons-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockReviews, mockGarages } from '@/lib/mock-data'
import { getInitials } from '@/lib/utils'

const USER_NAME = 'James Wilson'
const USER_EMAIL = 'james.wilson@email.com'

type FilterTab = 'Alle' | 'Actief' | 'Bewerkt'

function AccountSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { href: '/account/reviews', label: 'Mijn reviews', icon: IconChartBar },
    { href: '/account/profiel', label: 'Mijn profiel', icon: IconUser },
    { href: '/account/favorieten', label: 'Favorieten', icon: IconHeart },
  ]

  const activeItem = navItems.find(item => pathname === item.href) ?? navItems[0]

  return (
    <>
      {/* Mobile: dropdown trigger */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between gap-2 bg-white border border-neutral-100 rounded-xl px-4 py-3 shadow-card"
        >
          <div className="flex items-center gap-2">
            <div className="w-[34px] h-[34px] rounded-full bg-primary text-white flex items-center justify-center text-[13px] font-medium flex-shrink-0">
              {getInitials(USER_NAME)}
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
              <button className="w-full flex items-center gap-2.5 px-4 py-3 text-[14px] text-danger hover:bg-red-50 transition-colors">
                <IconLogout size={16} />
                Uitloggen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop: sidebar */}
      <aside className="hidden md:flex w-[220px] flex-shrink-0 flex-col">
        <div className="bg-white border border-neutral-100 rounded-xl shadow-card overflow-hidden">
          {/* User info */}
          <div className="px-4 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-2.5">
              <div className="w-[42px] h-[42px] rounded-full bg-primary text-white flex items-center justify-center text-[15px] font-medium flex-shrink-0">
                {getInitials(USER_NAME)}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-medium text-neutral-900 truncate">{USER_NAME}</div>
                <div className="text-[12px] text-neutral-500 truncate">{USER_EMAIL}</div>
              </div>
            </div>
          </div>

          {/* Nav items */}
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

          {/* Logout */}
          <div className="border-t border-neutral-100 py-1">
            <button className="w-full flex items-center gap-2.5 px-4 py-[10px] text-[13px] text-danger hover:bg-red-50 transition-colors duration-100">
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
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Alle')

  const displayedReviews = mockReviews.slice(0, 3)

  const filters: FilterTab[] = ['Alle', 'Actief', 'Bewerkt']

  const getGarageName = (garageId: string): string => {
    return mockGarages.find(g => g.id === garageId)?.name ?? 'Onbekende garage'
  }

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6 items-start">
          <AccountSidebar />

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Page heading */}
            <h1 className="text-[34px] sm:text-[36px] font-normal font-serif text-neutral-900 mb-6">
              Mijn reviews
            </h1>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-neutral-100 rounded-xl shadow-card px-4 py-4">
                <div className="text-[13px] text-neutral-500 mb-1">Mijn reviews</div>
                <div className="text-[28px] font-serif text-neutral-900 leading-none">3</div>
              </div>
              <div className="bg-white border border-neutral-100 rounded-xl shadow-card px-4 py-4">
                <div className="text-[13px] text-neutral-500 mb-1">Gemiddeld cijfer</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[28px] font-serif text-neutral-900 leading-none">4.8</span>
                  <IconStar size={14} className="text-amber mb-0.5" style={{ color: '#EF9F27' }} />
                </div>
              </div>
              <div className="bg-white border border-neutral-100 rounded-xl shadow-card px-4 py-4">
                <div className="text-[13px] text-neutral-500 mb-1">Garages bezocht</div>
                <div className="text-[28px] font-serif text-neutral-900 leading-none">3</div>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-5">
              {filters.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-[7px] rounded-full text-[13px] font-medium transition-colors duration-150 ${
                    activeFilter === tab
                      ? 'bg-primary text-white'
                      : 'bg-white border border-neutral-100 text-neutral-500 hover:border-neutral-300 hover:text-neutral-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Review list */}
            <div className="flex flex-col gap-3">
              {displayedReviews.map(review => {
                const garageName = getGarageName(review.garage_id)
                const garageInitials = getInitials(garageName)

                return (
                  <div key={review.id} className="bg-white border border-neutral-100 rounded-xl shadow-card p-4">
                    <div className="flex items-start gap-3">
                      {/* Garage avatar */}
                      <div className="w-[34px] h-[34px] rounded-[7px] bg-primary-light text-primary flex items-center justify-center text-[12px] font-medium flex-shrink-0">
                        {garageInitials}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <div className="text-[13px] font-medium text-neutral-900">{garageName}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {/* Star mini display */}
                              <span className="flex items-center gap-0.5" style={{ color: '#EF9F27' }}>
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <IconStar key={i} size={11} fill="#EF9F27" />
                                ))}
                              </span>
                              <span className="text-[11px] text-neutral-300">{formatDate(review.created_at)}</span>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button className="btn-ghost px-3 py-[6px] text-[12px] flex items-center gap-1.5 rounded-md">
                              <IconEdit size={13} />
                              Bewerken
                            </button>
                            <button className="btn-danger px-3 py-[6px] text-[12px] flex items-center gap-1.5 rounded-md">
                              <IconTrash size={13} />
                              Verwijderen
                            </button>
                          </div>
                        </div>

                        {/* Review text preview */}
                        <p className="mt-2 text-[13px] text-neutral-500 leading-[1.6] line-clamp-2">
                          {review.text}
                        </p>

                        {/* Verified badge */}
                        {review.verified && (
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
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
