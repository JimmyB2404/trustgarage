'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import ClaimGarageModal from '@/components/modals/ClaimGarageModal'

interface ClaimGarageButtonProps {
  garageId: string
  garageName: string
  locale?: 'nl' | 'en'
}

const TEXT = {
  nl: { cta: 'Ik ben de eigenaar', pending: 'Uw claim-aanvraag is in behandeling' },
  en: { cta: 'I am the owner', pending: 'Your claim request is being reviewed' },
}

export default function ClaimGarageButton({ garageId, garageName, locale = 'nl' }: ClaimGarageButtonProps) {
  const t = TEXT[locale]
  const { user, loading } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (loading || !user) { setChecked(true); return }
    fetch(`/api/garage/claim?garageId=${garageId}`)
      .then(r => r.json())
      .then(({ status }) => setPending(status === 'pending'))
      .finally(() => setChecked(true))
  }, [garageId, user, loading])

  function handleClick() {
    if (!user) {
      router.push('/inloggen')
      return
    }
    setOpen(true)
  }

  if (!checked) return null

  if (pending) {
    return <p className="text-[12px] text-neutral-300">{t.pending}</p>
  }

  return (
    <>
      <button onClick={handleClick} className="text-[12px] text-neutral-300 hover:text-neutral-900 underline transition-colors">
        {t.cta}
      </button>
      {open && (
        <ClaimGarageModal
          garageId={garageId}
          garageName={garageName}
          locale={locale}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
