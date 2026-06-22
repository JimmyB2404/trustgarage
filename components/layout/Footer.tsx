import Link from 'next/link'

const TEXT = {
  nl: {
    tagline: 'Vind een betrouwbare garage in Nederland. Eerlijke reviews van echte klanten.',
    searchHeading: 'Zoeken',
    searchLinks: ['Garages in Nederland', 'APK in de buurt', 'Engelstalige garage', 'Hoogst beoordeeld'],
    forGaragesHeading: 'Voor garages',
    forGarages: [
      { label: 'Gratis aanmelden', href: '/garage/aanmelden' },
      { label: 'Voordelen', href: '/voor-garages' },
      { label: 'Prijsplannen', href: '/voor-garages#plannen' },
      { label: 'Inloggen dashboard', href: '/inloggen' },
    ],
    companyHeading: 'TrustGarage',
    company: [
      { label: 'Over ons', href: '/over-ons' },
      { label: 'Contact', href: '/over-ons#contact' },
      { label: 'Privacybeleid', href: '/privacy' },
      { label: 'Algemene voorwaarden', href: '/voorwaarden' },
    ],
    copyright: '© 2026 TrustGarage.nl — Alle rechten voorbehouden',
    builtWith: 'Gebouwd met ❤ in Nederland',
    searchHref: '/zoeken',
  },
  en: {
    tagline: 'Find a trustworthy garage in the Netherlands. Honest reviews from real customers.',
    searchHeading: 'Search',
    searchLinks: ['Garages in the Netherlands', 'MOT nearby', 'English-speaking garage', 'Highest rated'],
    forGaragesHeading: 'For garages',
    forGarages: [
      { label: 'Sign up for free', href: '/garage/aanmelden' },
      { label: 'Benefits', href: '/en/voor-garages' },
      { label: 'Pricing', href: '/en/voor-garages#plannen' },
      { label: 'Dashboard login', href: '/inloggen' },
    ],
    companyHeading: 'TrustGarage',
    company: [
      { label: 'About us', href: '/en/over-ons' },
      { label: 'Contact', href: '/en/over-ons#contact' },
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms & conditions', href: '/voorwaarden' },
    ],
    copyright: '© 2026 TrustGarage.nl — All rights reserved',
    builtWith: 'Built with ❤ in the Netherlands',
    searchHref: '/en/zoeken',
  },
}

export default function Footer({ locale = 'nl' }: { locale?: 'nl' | 'en' }) {
  const t = TEXT[locale]

  return (
    <footer className="bg-surface border-t border-neutral-100 mt-20">
      <div className="max-w-site mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link href={locale === 'en' ? '/en' : '/'} className="font-serif text-[20px] text-primary font-normal">
              TrustGarage<span className="text-neutral-900">.nl</span>
            </Link>
            <p className="mt-3 text-[13px] text-neutral-500 leading-[1.6]">
              {t.tagline}
            </p>
          </div>

          {/* Garages */}
          <div>
            <h4 className="text-[13px] font-medium text-neutral-900 mb-3">{t.searchHeading}</h4>
            <ul className="space-y-2">
              {t.searchLinks.map(item => (
                <li key={item}>
                  <Link href={t.searchHref} className="text-[13px] text-neutral-500 hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For garages */}
          <div>
            <h4 className="text-[13px] font-medium text-neutral-900 mb-3">{t.forGaragesHeading}</h4>
            <ul className="space-y-2">
              {t.forGarages.map(item => (
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
            <h4 className="text-[13px] font-medium text-neutral-900 mb-3">{t.companyHeading}</h4>
            <ul className="space-y-2">
              {t.company.map(item => (
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
            {t.copyright}
          </span>
          <span className="text-[12px] text-neutral-300">
            {t.builtWith}
          </span>
        </div>
      </div>
    </footer>
  )
}
