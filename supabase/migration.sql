-- TrustGarage.nl — Database migratie
-- Uitvoeren in: Supabase Dashboard → SQL Editor → New query → Run

-- 1. Users (wordt automatisch aangemaakt door Supabase Auth)
-- We voegen alleen een publiek profiel toe gekoppeld aan auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Garages
CREATE TABLE IF NOT EXISTS public.garages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT,
  city TEXT,
  kvk_number TEXT,
  kvk_verified BOOLEAN DEFAULT FALSE,
  description TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'business')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Garage diensten
CREATE TABLE IF NOT EXISTS public.garage_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  garage_id UUID REFERENCES public.garages(id) ON DELETE CASCADE NOT NULL,
  service_name TEXT NOT NULL
);

-- 4. Garage talen
CREATE TABLE IF NOT EXISTS public.garage_languages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  garage_id UUID REFERENCES public.garages(id) ON DELETE CASCADE NOT NULL,
  language TEXT NOT NULL
);

-- 5. Garage openingstijden
CREATE TABLE IF NOT EXISTS public.garage_hours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  garage_id UUID REFERENCES public.garages(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  open_time TEXT,
  close_time TEXT,
  is_closed BOOLEAN DEFAULT FALSE
);

-- 6. Garage foto's
CREATE TABLE IF NOT EXISTS public.garage_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  garage_id UUID REFERENCES public.garages(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- 7. Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  garage_id UUID REFERENCES public.garages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  language TEXT DEFAULT 'nl',
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Review deelcijfers
CREATE TABLE IF NOT EXISTS public.review_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('eerlijkheid', 'prijs', 'snelheid', 'communicatie', 'engels')),
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5)
);

-- 9. Garage reacties op reviews
CREATE TABLE IF NOT EXISTS public.garage_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
  garage_id UUID REFERENCES public.garages(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Abonnementen
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  garage_id UUID REFERENCES public.garages(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active',
  current_period_end TIMESTAMPTZ
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garage_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garage_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garage_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garage_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garage_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: iedereen mag lezen, alleen eigen profiel aanpassen
CREATE POLICY "Profielen zijn publiek leesbaar" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "Gebruiker beheert eigen profiel" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Garages: iedereen mag lezen, alleen eigenaar mag aanpassen
CREATE POLICY "Garages zijn publiek leesbaar" ON public.garages FOR SELECT USING (TRUE);
CREATE POLICY "Eigenaar beheert eigen garage" ON public.garages FOR ALL USING (auth.uid() = user_id);

-- Garage details: iedereen lezen, eigenaar schrijven
CREATE POLICY "Garage services publiek" ON public.garage_services FOR SELECT USING (TRUE);
CREATE POLICY "Eigenaar beheert services" ON public.garage_services FOR ALL
  USING (auth.uid() = (SELECT user_id FROM public.garages WHERE id = garage_id));

CREATE POLICY "Garage talen publiek" ON public.garage_languages FOR SELECT USING (TRUE);
CREATE POLICY "Eigenaar beheert talen" ON public.garage_languages FOR ALL
  USING (auth.uid() = (SELECT user_id FROM public.garages WHERE id = garage_id));

CREATE POLICY "Garage uren publiek" ON public.garage_hours FOR SELECT USING (TRUE);
CREATE POLICY "Eigenaar beheert uren" ON public.garage_hours FOR ALL
  USING (auth.uid() = (SELECT user_id FROM public.garages WHERE id = garage_id));

CREATE POLICY "Garage fotos publiek" ON public.garage_photos FOR SELECT USING (TRUE);
CREATE POLICY "Eigenaar beheert fotos" ON public.garage_photos FOR ALL
  USING (auth.uid() = (SELECT user_id FROM public.garages WHERE id = garage_id));

-- Reviews: iedereen lezen, ingelogde gebruikers schrijven, eigen reviews aanpassen
CREATE POLICY "Reviews zijn publiek leesbaar" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Ingelogd gebruiker plaatst review" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Gebruiker beheert eigen reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Gebruiker verwijdert eigen reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Review ratings publiek" ON public.review_ratings FOR SELECT USING (TRUE);
CREATE POLICY "Schrijven via eigen review" ON public.review_ratings FOR INSERT
  WITH CHECK (auth.uid() = (SELECT user_id FROM public.reviews WHERE id = review_id));

-- Garage reacties: iedereen lezen, garage eigenaar schrijven
CREATE POLICY "Reacties zijn publiek" ON public.garage_replies FOR SELECT USING (TRUE);
CREATE POLICY "Eigenaar plaatst reactie" ON public.garage_replies FOR ALL
  USING (auth.uid() = (SELECT user_id FROM public.garages WHERE id = garage_id));

-- Subscriptions: alleen garage eigenaar
CREATE POLICY "Eigenaar ziet abonnement" ON public.subscriptions FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM public.garages WHERE id = garage_id));

-- ============================================
-- STORAGE BUCKET voor garage foto's
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('garage-photos', 'garage-photos', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Fotos zijn publiek leesbaar" ON storage.objects
  FOR SELECT USING (bucket_id = 'garage-photos');

CREATE POLICY "Eigenaar upload fotos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'garage-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Eigenaar verwijdert fotos" ON storage.objects
  FOR DELETE USING (bucket_id = 'garage-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
