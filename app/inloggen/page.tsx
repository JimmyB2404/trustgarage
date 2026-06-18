'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconCircleCheck, IconAlertCircle } from '@tabler/icons-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase'

export default function InloggenPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('E-mailadres of wachtwoord is onjuist.')
      setLoading(false)
      return
    }

    const [{ data: garage }, adminCheck] = await Promise.all([
      supabase.from('garages').select('id').eq('user_id', authData.user.id).maybeSingle(),
      fetch('/api/admin/check').then(r => r.json()).catch(() => ({ isAdmin: false })),
    ])

    setSuccess(true)
    window.location.href = adminCheck.isAdmin ? '/' : garage ? '/dashboard' : '/account/reviews'
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
                Inloggen bij TrustGarage
              </h1>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-danger text-[13px] font-medium px-4 py-3 rounded-lg mb-5">
                <IconAlertCircle size={17} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2 bg-primary-light text-primary text-[13px] font-medium px-4 py-3 rounded-lg mb-5">
                <IconCircleCheck size={17} className="shrink-0" />
                <span>Ingelogd! U wordt doorgestuurd...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
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
              <div className="mb-1">
                <label htmlFor="password" className="block text-[13px] font-medium text-neutral-900 mb-1">
                  Wachtwoord
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Forgot password */}
              <Link
                href="/wachtwoord-reset"
                className="text-[13px] text-primary hover:underline text-right block mt-1"
              >
                Wachtwoord vergeten?
              </Link>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success}
                className="btn-primary w-full mt-6"
              >
                {loading ? 'Inloggen...' : 'Inloggen'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-neutral-100" />
              <span className="text-[12px] text-neutral-300">of</span>
              <div className="flex-1 h-px bg-neutral-100" />
            </div>

            {/* Register link */}
            <p className="text-center text-[13px] text-neutral-500">
              Nog geen account?{' '}
              <Link href="/registreren" className="text-primary font-medium hover:underline">
                Aanmelden
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
