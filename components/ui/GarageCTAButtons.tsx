'use client'

import { useState } from 'react'
import { IconPhone, IconCalendar } from '@tabler/icons-react'
import { trackEvent } from '@/lib/analytics'
import AppointmentModal from '@/components/modals/AppointmentModal'

interface GarageCTAButtonsProps {
  phone: string
  garageId: string
  garageName: string
  callClassName: string
  appointmentClassName: string
  locale?: 'nl' | 'en'
}

const TEXT = {
  nl: { call: 'Bellen', appointment: 'Afspraak maken' },
  en: { call: 'Call', appointment: 'Request appointment' },
}

export default function GarageCTAButtons({
  phone,
  garageId,
  garageName,
  callClassName,
  appointmentClassName,
  locale = 'nl',
}: GarageCTAButtonsProps) {
  const t = TEXT[locale]
  const [showAppointment, setShowAppointment] = useState(false)

  return (
    <>
      <a
        href={`tel:${phone}`}
        className={callClassName}
        onClick={() => trackEvent('call_click', { garage_id: garageId })}
      >
        <IconPhone size={16} />
        {t.call}
      </a>
      <button
        type="button"
        className={appointmentClassName}
        onClick={() => {
          trackEvent('appointment_click', { garage_id: garageId })
          setShowAppointment(true)
        }}
      >
        <IconCalendar size={16} />
        {t.appointment}
      </button>
      {showAppointment && (
        <AppointmentModal
          garageId={garageId}
          garageName={garageName}
          locale={locale}
          onClose={() => setShowAppointment(false)}
        />
      )}
    </>
  )
}
