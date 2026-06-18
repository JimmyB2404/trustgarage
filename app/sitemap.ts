import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://trustgarage.nl'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: garages } = await supabase
    .from('garages')
    .select('slug, created_at')

  const garageEntries: MetadataRoute.Sitemap = (garages ?? []).map((g) => ({
    url: `${BASE_URL}/garage/${g.slug}`,
    lastModified: g.created_at ?? undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/zoeken`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/voor-garages`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/over-ons`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/garage/aanmelden`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/inloggen`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/registreren`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  return [...staticEntries, ...garageEntries]
}
