'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import ReviewModal from '@/components/modals/ReviewModal'

interface ReviewButtonProps {
  garageId: string
  garageName: string
}

export default function ReviewButton({ garageId, garageName }: ReviewButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

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
        />
      )}
    </>
  )
}
