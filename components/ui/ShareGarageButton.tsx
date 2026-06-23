'use client'

import { useState, useRef, useEffect } from 'react'
import { IconShare2, IconCopy, IconCheck, IconBrandWhatsapp } from '@tabler/icons-react'

interface ShareGarageButtonProps {
  garageName: string
  locale?: 'nl' | 'en'
}

const TEXT = {
  nl: {
    share: 'Delen',
    whatsapp: 'Delen via WhatsApp',
    copy: 'Kopieer link',
    copied: 'Gekopieerd!',
    whatsappText: (name: string, url: string) => `Bekijk ${name} op TrustGarage.nl: ${url}`,
  },
  en: {
    share: 'Share',
    whatsapp: 'Share via WhatsApp',
    copy: 'Copy link',
    copied: 'Copied!',
    whatsappText: (name: string, url: string) => `Check out ${name} on TrustGarage.nl: ${url}`,
  },
}

export default function ShareGarageButton({ garageName, locale = 'nl' }: ShareGarageButtonProps) {
  const t = TEXT[locale]
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(t.whatsappText(garageName, typeof window !== 'undefined' ? window.location.href : ''))}`

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-[13px] text-neutral-500 hover:text-primary transition-colors"
      >
        <IconShare2 size={15} />
        {t.share}
      </button>

      {open && (
        <div className="absolute z-30 top-full mt-2 right-0 bg-white border border-neutral-100 rounded-lg shadow-modal py-1 min-w-[180px]">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-[13px] text-neutral-900 hover:bg-surface transition-colors"
          >
            <IconBrandWhatsapp size={16} className="text-primary" />
            {t.whatsapp}
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-neutral-900 hover:bg-surface transition-colors"
          >
            {copied ? <IconCheck size={16} className="text-primary" /> : <IconCopy size={16} className="text-neutral-500" />}
            {copied ? t.copied : t.copy}
          </button>
        </div>
      )}
    </div>
  )
}
