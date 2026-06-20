'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconCircleCheck, IconAlertCircle } from '@tabler/icons-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase'

export default function NieuwWachtwoordPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens bevatten.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)

    if (error) {
      setError(
        error.message.includes('session')
          ? 'Deze link is verlopen of al gebruikt. Vraag een nieuwe aan.'
          : 'Wachtwoord wijzigen mislukt. Probeer het opnieuw.'
      )
      return
    }

    setSuccess(true)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-52px)] bg-surface">
        <div className="max-w-[400px] mx-auto px-4 mt-16 mb-16">
          <div className="bg-white border border-neutral-100 rounded-xl p-8 shadow-card">

            <div className="text-center mb-4">
              <Link href="/" className="font-serif text-[20px] text-primary font-normal">
                TrustGarage<span className="text-neutral-900">.nl</span>
              </Link>
              <h1 className="mt-3 text-[22px] font-normal font-serif text-neutral-900">
                Nieuw wachtwoord instellen
              </h1>
            </div>

            {success ? (
              <>
                <div className="flex items-center gap-2 bg-primary-light text-primary text-[13px] font-medium px-4 py-3 rounded-lg mb-5">
                  <IconCircleCheck size={17} className="shrink-0" />
                  <span>Wachtwoord gewijzigd! U kunt nu inloggen met uw nieuwe wachtwoord.</span>
                </div>
                <button onClick={() => router.push('/inloggen')} className="btn-primary w-full">
                  Naar inloggen
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 text-danger text-[13px] font-medium px-4 py-3 rounded-lg mb-5">
                    <IconAlertCircle size={17} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor="new-password" className="block text-[13px] font-medium text-neutral-900 mb-1">
                    Nieuw wachtwoord
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Minimaal 8 tekens"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="mb-1">
                  <label htmlFor="confirm-password" className="block text-[13px] font-medium text-neutral-900 mb-1">
                    Bevestig nieuw wachtwoord
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Herhaal nieuw wachtwoord"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mt-6"
                >
                  {loading ? 'Bezig...' : 'Wachtwoord wijzigen'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
