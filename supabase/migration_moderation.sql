-- TrustGarage.nl — Migratie: moderatiedashboard (garages schorsen, reviews rapporteren)
-- Uitvoeren in: Supabase Dashboard → SQL Editor → New query → Run

ALTER TABLE public.garages ADD COLUMN IF NOT EXISTS suspended BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.review_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
  reporter_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'afgehandeld')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_reports_review ON public.review_reports(review_id);

ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;
-- Bewust geen policies voor anon/authenticated — zelfde patroon als review_invitations/
-- appointment_requests, alle toegang via service-role API routes.

GRANT ALL ON public.review_reports TO service_role;
