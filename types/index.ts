export type Plan = 'free' | 'premium' | 'business'

export interface GarageHours {
  day: number // 0=Sunday, 1=Monday, ...
  open: string
  close: string
  closed: boolean
}

export interface Garage {
  id: string
  name: string
  slug: string
  address: string
  city: string
  kvk_number: string
  kvk_verified: boolean
  description: string
  phone: string
  email: string
  website: string
  plan: Plan
  rating: number
  review_count: number
  services: string[]
  languages: string[]
  hours: GarageHours[]
  photos: string[]
  logo_url?: string | null
  favorites_count?: number
  created_at: string
  distance?: number
  is_open?: boolean
  latitude?: number | null
  longitude?: number | null
  claimed?: boolean
}

export interface ReviewRating {
  category: 'eerlijkheid' | 'prijs' | 'snelheid' | 'communicatie' | 'engels'
  score: number
}

export interface GarageReply {
  id: string
  text: string
  created_at: string
}

export interface Review {
  id: string
  garage_id: string
  user_id: string
  user_name: string
  user_country?: string
  is_expat: boolean
  rating: number
  text: string
  language: string
  verified: boolean
  created_at: string
  ratings: ReviewRating[]
  reply?: GarageReply
}

export interface SearchFilters {
  query: string
  city: string
  services: string[]
  languages: string[]
  min_rating: number
  max_distance: number
  kvk_verified: boolean
}
