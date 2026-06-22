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
    .eq('suspended', false)

  const garageEntries: MetadataRoute.Sitemap = (garages ?? []).flatMap((g) => [
    {
      url: `${BASE_URL}/garage/${g.slug}`,
      lastModified: g.created_at ?? undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/en/garage/${g.slug}`,
      lastModified: g.created_at ?? undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ])

  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/zoeken`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/voor-garages`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/tarieven`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/over-ons`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/garage/aanmelden`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/inloggen`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/registreren`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/en`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/en/zoeken`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/en/voor-garages`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/en/tarieven`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/en/over-ons`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  return [...staticEntries, ...garageEntries]
}
