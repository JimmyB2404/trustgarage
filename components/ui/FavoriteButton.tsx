'use client'

import { useState, useEffect } from 'react'
import { IconHeart, IconHeartFilled } from '@tabler/icons-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
  garageId: string
  initialCount?: number
  showCount?: boolean
  size?: number
}

export default function FavoriteButton({
  garageId,
  initialCount = 0,
  showCount = true,
  size = 16,
}: FavoriteButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!user) return
    fetch(`/api/favorites?garageId=${garageId}&userId=${user.id}`)
      .then(r => r.json())
      .then(({ isFavorited }) => setIsFavorited(isFavorited))
      .catch(() => {})
  }, [garageId, user])

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      router.push('/inloggen')
      return
    }
    if (busy) return
    setBusy(true)
    const adding = !isFavorited
    setIsFavorited(adding)
    setCount(prev => adding ? prev + 1 : Math.max(0, prev - 1))
    await fetch('/api/favorites', {
      method: adding ? 'POST' : 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ garageId, userId: user.id }),
    }).catch(() => {
      // Revert on failure
      setIsFavorited(!adding)
      setCount(prev => adding ? Math.max(0, prev - 1) : prev + 1)
    })
    setBusy(false)
  }

  return (
    <button
      onClick={toggle}
      aria-label={isFavorited ? 'Verwijder uit favorieten' : 'Toevoegen aan favorieten'}
      className={`flex items-center gap-1 transition-colors duration-150 ${
        isFavorited ? 'text-danger' : 'text-neutral-400 hover:text-danger'
      }`}
    >
      {isFavorited
        ? <IconHeartFilled size={size} />
        : <IconHeart size={size} />
      }
      {showCount && count > 0 && (
        <span className="text-[12px] tabular-nums">{count}</span>
      )}
    </button>
  )
}
