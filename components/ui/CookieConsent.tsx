'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getCookieConsent, setCookieConsent } from '@/lib/cookie-consent'

const TEXT = {
  nl: {
    message: 'We gebruiken cookies om bezoekersstatistieken bij te houden en de site te verbeteren. Ga je hiermee akkoord?',
    decline: 'Weigeren',
    accept: 'Accepteren',
  },
  en: {
    message: 'We use cookies to track visitor statistics and improve the site. Do you agree?',
    decline: 'Decline',
    accept: 'Accept',
  },
}

export default function CookieConsent() {
  const pathname = usePathname()
  const t = pathname.startsWith('/en') ? TEXT.en : TEXT.nl
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(getCookieConsent() === null)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white shadow-lg">
      <div className="max-w-site mx-auto flex flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
        <p className="flex-1 text-[13px] text-neutral-600">
          {t.message}
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={() => { setCookieConsent('denied'); setVisible(false) }}
            className="btn-secondary text-[13px]"
          >
            {t.decline}
          </button>
          <button
            type="button"
            onClick={() => { setCookieConsent('granted'); setVisible(false) }}
            className="btn-primary text-[13px]"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
