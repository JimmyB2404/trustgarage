'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GarageCard from '@/components/ui/GarageCard'
import { SERVICES, LANGUAGES } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase'
import { transformGarage } from '@/lib/garages'
import {
  IconSearch,
  IconFilter,
  IconX,
  IconChevronDown,
  IconAdjustmentsHorizontal,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react'
import type { Garage } from '@/types'

const RESULTS_PER_PAGE = 10

function ZoekenContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  const [allGarages, setAllGarages] = useState<Garage[]>([])
  const [query, setQuery] = useState(initialQuery)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number>(0)
  const [kvkOnly, setKvkOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'distance'>('rating')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('garages')
      .select('*, garage_services(service_name), garage_languages(language), garage_hours(day_of_week, open_time, close_time, is_closed), reviews(rating)')
      .then(({ data }) => {
        setAllGarages((data ?? []).map(transformGarage))
      })
  }, [])

  // --- filter logic ---
  const filteredGarages = useMemo<Garage[]>(() => {
    let result = [...allGarages]

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.filter(
        g =>
          g.name.toLowerCase().includes(q) ||
          g.city.toLowerCase().includes(q) ||
          g.address.toLowerCase().includes(q) ||
          g.services.some(s => s.toLowerCase().includes(q))
      )
    }

    if (selectedServices.length > 0) {
      result = result.filter(g =>
        selectedServices.some(s => g.services.includes(s))
      )
    }

    if (selectedLanguages.length > 0) {
      result = result.filter(g =>
        selectedLanguages.some(l => g.languages.includes(l))
      )
    }

    if (minRating > 0) {
      result = result.filter(g => g.rating >= minRating)
    }

    if (kvkOnly) {
      result = result.filter(g => g.kvk_verified)
    }

    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'reviews') return b.review_count - a.review_count
      if (sortBy === 'distance') {
        const da = a.distance ?? 999
        const db = b.distance ?? 999
        return da - db
      }
      return 0
    })

    return result
  }, [allGarages, query, selectedServices, selectedLanguages, minRating, kvkOnly, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredGarages.length / RESULTS_PER_PAGE))
  const paginatedGarages = filteredGarages.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  )

  function handlePageChange(page: number) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // --- active filters helpers ---
  const activeFilterCount =
    selectedServices.length + selectedLanguages.length + (minRating > 0 ? 1 : 0) + (kvkOnly ? 1 : 0)

  function removeService(s: string) {
    setSelectedServices(prev => prev.filter(x => x !== s))
    setCurrentPage(1)
  }
  function removeLanguage(l: string) {
    setSelectedLanguages(prev => prev.filter(x => x !== l))
    setCurrentPage(1)
  }
  function removeMinRating() {
    setMinRating(0)
    setCurrentPage(1)
  }
  function removeKvk() {
    setKvkOnly(false)
    setCurrentPage(1)
  }
  function clearAllFilters() {
    setSelectedServices([])
    setSelectedLanguages([])
    setMinRating(0)
    setKvkOnly(false)
    setCurrentPage(1)
  }

  function toggleService(s: string) {
    setSelectedServices(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
    setCurrentPage(1)
  }
  function toggleLanguage(l: string) {
    setSelectedLanguages(prev =>
      prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]
    )
    setCurrentPage(1)
  }

  const ratingOptions: { value: number; label: string }[] = [
    { value: 0, label: 'Alle' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' },
    { value: 4.5, label: '4.5+' },
  ]

  const sortOptions: { value: 'rating' | 'reviews' | 'distance'; label: string }[] = [
    { value: 'rating', label: 'Hoogste beoordeling' },
    { value: 'reviews', label: 'Meeste reviews' },
    { value: 'distance', label: 'Dichtsbij' },
  ]

  const FilterPanel = () => (
    <>
      {/* Diensten */}
      <div className="mb-6">
        <h4 className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-2">
          Diensten
        </h4>
        <div className="flex flex-col gap-[10px]">
          {SERVICES.map(service => (
            <label key={service} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedServices.includes(service)}
                onChange={() => toggleService(service)}
                className="w-[14px] h-[14px] accent-primary cursor-pointer"
              />
              <span className="text-[13px] text-neutral-900 group-hover:text-primary transition-colors">
                {service}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Talen */}
      <div className="mb-6">
        <h4 className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-2">
          Talen
        </h4>
        <div className="flex flex-col gap-[10px]">
          {LANGUAGES.map(lang => (
            <label key={lang} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedLanguages.includes(lang)}
                onChange={() => toggleLanguage(lang)}
                className="w-[14px] h-[14px] accent-primary cursor-pointer"
              />
              <span className="text-[13px] text-neutral-900 group-hover:text-primary transition-colors">
                {lang}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Min rating */}
      <div className="mb-6">
        <h4 className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-2">
          Minimale beoordeling
        </h4>
        <div className="flex flex-col gap-[10px]">
          {ratingOptions.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="minRating"
                checked={minRating === opt.value}
                onChange={() => {
                  setMinRating(opt.value)
                  setCurrentPage(1)
                }}
                className="w-[14px] h-[14px] accent-primary cursor-pointer"
              />
              <span className="text-[13px] text-neutral-900 group-hover:text-primary transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* KVK only */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={kvkOnly}
          onChange={e => {
            setKvkOnly(e.target.checked)
            setCurrentPage(1)
          }}
          className="w-[14px] h-[14px] accent-primary cursor-pointer"
        />
        <span className="text-[13px] text-neutral-900">Alleen KVK geverifieerd</span>
      </label>
    </>
  )

  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('ellipsis')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('ellipsis')
      pages.push(totalPages)
    }
    return pages
  }, [totalPages, currentPage])

  return (
    <>
      <Navbar />

      <div className="bg-surface min-h-screen">
        {/* Sticky search bar */}
        <div className="sticky top-[52px] z-40 bg-white border-b border-neutral-100 py-3">
          <div className="max-w-site mx-auto px-4 sm:px-6">
            <div className="flex gap-3 items-center">
              {/* Search input */}
              <div className="relative flex-1">
                <IconSearch
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none"
                />
                <input
                  type="search"
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Zoek op naam, stad of dienst..."
                  className="input-field pl-9 w-full text-[14px]"
                />
              </div>

              {/* Mobile filter button */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden btn-ghost flex items-center gap-1.5 text-[13px] py-[8px] px-3 relative"
              >
                <IconAdjustmentsHorizontal size={15} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-primary text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Desktop sort dropdown */}
              <div className="hidden lg:flex items-center gap-1.5 relative">
                <label className="text-[12px] text-neutral-500 whitespace-nowrap">Sorteren:</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="appearance-none text-[13px] text-neutral-900 bg-transparent border border-neutral-100 rounded-lg pl-3 pr-8 py-[7px] cursor-pointer focus:outline-none focus:border-primary transition-colors hover:border-neutral-300"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-2.5">
                {selectedServices.map(s => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 text-[12px] bg-primary-light text-primary px-2.5 py-1 rounded-full"
                  >
                    {s}
                    <button onClick={() => removeService(s)} aria-label={`Verwijder ${s}`}>
                      <IconX size={12} />
                    </button>
                  </span>
                ))}
                {selectedLanguages.map(l => (
                  <span
                    key={l}
                    className="inline-flex items-center gap-1 text-[12px] bg-primary-light text-primary px-2.5 py-1 rounded-full"
                  >
                    {l}
                    <button onClick={() => removeLanguage(l)} aria-label={`Verwijder ${l}`}>
                      <IconX size={12} />
                    </button>
                  </span>
                ))}
                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1 text-[12px] bg-primary-light text-primary px-2.5 py-1 rounded-full">
                    {minRating}+ sterren
                    <button onClick={removeMinRating} aria-label="Verwijder minimale beoordeling">
                      <IconX size={12} />
                    </button>
                  </span>
                )}
                {kvkOnly && (
                  <span className="inline-flex items-center gap-1 text-[12px] bg-primary-light text-primary px-2.5 py-1 rounded-full">
                    KVK geverifieerd
                    <button onClick={removeKvk} aria-label="Verwijder KVK filter">
                      <IconX size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-[12px] text-neutral-500 hover:text-neutral-900 underline transition-colors"
                >
                  Alles wissen
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page body */}
        <div className="max-w-site mx-auto px-4 sm:px-6 py-6 flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-[210px] flex-shrink-0">
            <div className="sticky top-[116px]">
              <h3 className="text-[13px] font-medium text-neutral-900 mb-4">Filters</h3>
              <FilterPanel />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] text-neutral-500">
                <span className="font-medium text-neutral-900">{filteredGarages.length}</span>{' '}
                {filteredGarages.length === 1 ? 'garage gevonden' : 'garages gevonden'}
              </p>
              {/* Mobile sort */}
              <div className="lg:hidden flex items-center gap-1.5">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="appearance-none text-[12px] text-neutral-900 bg-transparent border border-neutral-100 rounded-lg pl-3 pr-7 py-[6px] cursor-pointer focus:outline-none focus:border-primary transition-colors"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Results list */}
            {paginatedGarages.length > 0 ? (
              <div className="flex flex-col gap-4">
                {paginatedGarages.map(garage => (
                  <GarageCard
                    key={garage.id}
                    garage={garage}
                    variant="horizontal"
                    featured={garage.plan === 'premium' || garage.plan === 'business'}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <IconFilter size={40} className="text-neutral-300 mb-4" />
                <p className="text-[16px] font-medium text-neutral-900 mb-1">Geen garages gevonden</p>
                <p className="text-[13px] text-neutral-500 max-w-[300px]">
                  Probeer andere zoektermen of pas je filters aan.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="btn-primary mt-4 text-[13px] py-[8px] px-5 rounded-md"
                >
                  Filters wissen
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-10">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Vorige pagina"
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-100 text-neutral-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <IconChevronLeft size={15} />
                </button>

                {pageNumbers.map((page, idx) =>
                  page === 'ellipsis' ? (
                    <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-[13px] text-neutral-300">
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      aria-label={`Pagina ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-white border border-primary'
                          : 'border border-neutral-100 text-neutral-900 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Volgende pagina"
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-100 text-neutral-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <IconChevronRight size={15} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter bottom sheet */}
      {showFilters && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />

          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)] p-6 z-50 lg:hidden max-h-[85dvh] flex flex-col">
            {/* Sheet header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-medium text-neutral-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 text-neutral-500 hover:text-neutral-900 transition-colors"
                aria-label="Sluit filters"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Scrollable filter content */}
            <div className="flex-1 overflow-y-auto pr-1">
              {/* Mobile sort option */}
              <div className="mb-6">
                <h4 className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  Sorteren
                </h4>
                <div className="flex flex-col gap-[10px]">
                  {sortOptions.map(opt => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mobileSortBy"
                        checked={sortBy === opt.value}
                        onChange={() => setSortBy(opt.value)}
                        className="w-[14px] h-[14px] accent-primary cursor-pointer"
                      />
                      <span className="text-[13px] text-neutral-900">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <FilterPanel />
            </div>

            {/* Apply button */}
            <div className="pt-4 border-t border-neutral-100 mt-2">
              <button
                onClick={() => setShowFilters(false)}
                className="btn-primary w-full text-[14px] py-3 rounded-lg"
              >
                {activeFilterCount > 0
                  ? `Filters toepassen (${activeFilterCount})`
                  : 'Filters toepassen'}
              </button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </>
  )
}

export default function ZoekenPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center text-neutral-500">Laden...</div>}>
      <ZoekenContent />
    </Suspense>
  )
}
