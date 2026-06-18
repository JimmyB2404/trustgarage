'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import ReviewModal from '@/components/modals/ReviewModal'

interface ReviewButtonProps {
  garageId: string
  garageName: string
}

export default function ReviewButton({ garageId, garageName }: ReviewButtonProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const inviteToken = searchParams.get('invite')

  useEffect(() => {
    if (!inviteToken || loading) return
    if (!user) {
      router.push('/inloggen')
      return
    }
    setOpen(true)
  }, [inviteToken, user, loading, router])

  function handleClick() {
    if (!user) {
      router.push('/inloggen')
      return
    }
    setOpen(true)
  }

  return (
    <>
      <button onClick={handleClick} className="btn-primary text-[13px] py-[8px] px-4">
        Review schrijven
      </button>
      {open && (
        <ReviewModal
          garageId={garageId}
          garageName={garageName}
          onClose={() => setOpen(false)}
          onSubmit={() => router.refresh()}
        />
      )}
    </>
  )
}
