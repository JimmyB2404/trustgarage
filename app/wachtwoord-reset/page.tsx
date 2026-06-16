'use client'

import { useState } from 'react'
import Link from 'next/link'
import { IconCircleCheck, IconArrowLeft } from '@tabler/icons-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function WachtwoordResetPage() {
  const [email, setEmail] = useState('')
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
            <div className="text-center mb-4">
              <Link href="/" className="font-serif text-[20px] text-primary font-normal">
                TrustGarage<span className="text-neutral-900">.nl</span>
              </Link>
              <h1 className="mt-3 text-[22px] font-normal font-serif text-neutral-900">
                Wachtwoord vergeten
              </h1>
            </div>

            {/* Description */}
            <p className="text-[14px] text-neutral-500 text-center mb-6 leading-[1.6]">
              Vul uw e-mailadres in. U ontvangt een link om uw wachtwoord te resetten.
            </p>

            {/* Success state */}
            {success && (
              <div className="flex items-center gap-2 bg-primary-light text-primary text-[13px] font-medium px-4 py-3 rounded-lg mb-5">
                <IconCircleCheck size={17} className="shrink-0" />
                <span>Reset link verstuurd! Controleer uw inbox.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="mb-1">
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success}
                className="btn-primary w-full mt-6"
              >
                {loading ? 'Versturen...' : 'Reset link versturen'}
              </button>
            </form>

            {/* Back to login */}
            <div className="mt-6 text-center">
              <Link
                href="/inloggen"
                className="inline-flex items-center gap-1 text-[13px] text-neutral-500 hover:text-primary transition-colors"
              >
                <IconArrowLeft size={14} />
                Terug naar inloggen
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
