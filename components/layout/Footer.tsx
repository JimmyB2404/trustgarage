import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-neutral-100 mt-20">
      <div className="max-w-site mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="font-serif text-[20px] text-primary font-normal">
              TrustGarage<span className="text-neutral-900">.nl</span>
            </Link>
            <p className="mt-3 text-[13px] text-neutral-500 leading-[1.6]">
              Vind een betrouwbare garage in Nederland. Eerlijke reviews van echte klanten.
            </p>
          </div>

          {/* Garages */}
          <div>
            <h4 className="text-[13px] font-medium text-neutral-900 mb-3">Zoeken</h4>
            <ul className="space-y-2">
              {['Garages in Nederland', 'APK in de buurt', 'Engelstalige garage', 'Hoogst beoordeeld'].map(item => (
                <li key={item}>
                  <Link href="/zoeken" className="text-[13px] text-neutral-500 hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For garages */}
          <div>
            <h4 className="text-[13px] font-medium text-neutral-900 mb-3">Voor garages</h4>
            <ul className="space-y-2">
              {[
                { label: 'Gratis aanmelden', href: '/garage/aanmelden' },
                { label: 'Voordelen', href: '/voor-garages' },
                { label: 'Prijsplannen', href: '/voor-garages#plannen' },
                { label: 'Inloggen dashboard', href: '/inloggen' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[13px] text-neutral-500 hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[13px] font-medium text-neutral-900 mb-3">TrustGarage</h4>
            <ul className="space-y-2">
              {[
                { label: 'Over ons', href: '/over-ons' },
                { label: 'Contact', href: '/over-ons#contact' },
                { label: 'Privacybeleid', href: '/privacy' },
                { label: 'Algemene voorwaarden', href: '/voorwaarden' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[13px] text-neutral-500 hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[12px] text-neutral-300">
            © 2026 TrustGarage.nl — Alle rechten voorbehouden
          </span>
          <span className="text-[12px] text-neutral-300">
            Gebouwd met ❤ in Nederland
          </span>
        </div>
      </div>
    </footer>
  )
}
