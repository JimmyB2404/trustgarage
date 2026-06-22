'use client'

import { IconPhone, IconCalendar } from '@tabler/icons-react'
import { trackEvent } from '@/lib/analytics'

interface GarageCTAButtonsProps {
  phone: string
  garageId: string
  callClassName: string
  appointmentClassName: string
}

export default function GarageCTAButtons({
  phone,
  garageId,
  callClassName,
  appointmentClassName,
}: GarageCTAButtonsProps) {
  return (
    <>
      <a
        href={`tel:${phone}`}
        className={callClassName}
        onClick={() => trackEvent('call_click', { garage_id: garageId })}
      >
        <IconPhone size={16} />
        Bellen
      </a>
      <button
        type="button"
        className={appointmentClassName}
        onClick={() => trackEvent('appointment_click', { garage_id: garageId })}
      >
        <IconCalendar size={16} />
        Afspraak maken
      </button>
    </>
  )
}
