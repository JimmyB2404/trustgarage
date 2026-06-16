'use client'

import { useState } from 'react'
import Link from 'next/link'
import { IconCircleCheck } from '@tabler/icons-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function RegistrerenPage() {
  const [naam, setNaam] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Supabase auth not yet configured — simulate success
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 800)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-52px)] bg-surface">
        <div className="max-w-[400px] mx-auto px-4 mt-16 mb-16">
          <div className="bg-white border border-neutral-100 rounded-xl p-8 shadow-card">

            {/* Logo + Title */}
            <div className="text-center mb-7">
              <Link href="/" className="font-serif text-[20px] text-primary font-normal">
                TrustGarage<span className="text-neutral-900">.nl</span>
              </Link>
              <h1 className="mt-3 text-[22px] font-normal font-serif text-neutral-900">
                Account aanmaken
              </h1>
            </div>

            {/* Success state */}
            {success && (
              <div className="flex items-center gap-2 bg-primary-light text-primary text-[13px] font-medium px-4 py-3 rounded-lg mb-5">
                <IconCircleCheck size={17} className="shrink-0" />
                <span>Account aangemaakt! Controleer uw e-mail om te bevestigen.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Naam */}
              <div className="mb-4">
                <label htmlFor="naam" className="block text-[13px] font-medium text-neutral-900 mb-1">
                  Volledige naam
                </label>
                <input
                  id="naam"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Jan de Vries"
                  value={naam}
                  onChange={e => setNaam(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-[13px] font-medium text-neutral-900 mb-1">
                  E-mailadres
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="uw@email.nl"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-[13px] font-medium text-neutral-900 mb-1">
                  Wachtwoord
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Minimaal 8 tekens"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Password confirm */}
              <div className="mb-1">
                <label htmlFor="password-confirm" className="block text-[13px] font-medium text-neutral-900 mb-1">
                  Wachtwoord bevestigen
                </label>
                <input
                  id="password-confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={e => setPasswordConfirm(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success}
                className="btn-primary w-full mt-6"
              >
                {loading ? 'Account aanmaken...' : 'Account aanmaken'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-neutral-100" />
              <span className="text-[12px] text-neutral-300">of</span>
              <div className="flex-1 h-px bg-neutral-100" />
            </div>

            {/* Login link */}
            <p className="text-center text-[13px] text-neutral-500">
              Al een account?{' '}
              <Link href="/inloggen" className="text-primary font-medium hover:underline">
                Inloggen
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
