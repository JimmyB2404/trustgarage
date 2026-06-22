'use client'

import { useState } from 'react'
import { IconFlag } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export default function ReportReviewButton({ reviewId }: { reviewId: string }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit() {
    setSending(true)
    await fetch('/api/reviews/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, reason: reason.trim() || undefined }),
    }).catch(() => {})
    setSending(false)
    setSent(true)
  }

  if (sent) {
    return <p className="mt-2 text-[11px] text-neutral-300">Bedankt, we bekijken dit.</p>
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 flex items-center gap-1 text-[11px] text-neutral-300 hover:text-danger transition-colors"
      >
        <IconFlag size={11} />
        Rapporteren
      </button>
    )
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <input
        type="text"
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder="Reden (optioneel)"
        className="text-[12px] px-2 py-[6px] border border-[#D8D8D8] rounded-md outline-none focus:border-primary"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={sending}
          className={cn('text-[11px] text-danger font-medium', sending && 'opacity-50 cursor-not-allowed')}
        >
          {sending ? 'Versturen...' : 'Verzend rapport'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[11px] text-neutral-300 hover:text-neutral-900"
        >
          Annuleren
        </button>
      </div>
    </div>
  )
}
