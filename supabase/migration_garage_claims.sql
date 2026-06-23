-- TrustGarage.nl — Migratie: garage claimen door eigenaar
-- Uitvoeren in: Supabase Dashboard → SQL Editor → New query → Run

CREATE TABLE IF NOT EXISTS public.garage_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  garage_id UUID REFERENCES public.garages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phone TEXT NOT NULL,
  kvk_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_garage_claims_garage ON public.garage_claims(garage_id);
CREATE INDEX IF NOT EXISTS idx_garage_claims_user ON public.garage_claims(user_id);

ALTER TABLE public.garage_claims ENABLE ROW LEVEL SECURITY;
-- Bewust geen policies voor anon/authenticated — zelfde patroon als review_invitations/
-- appointment_requests/review_reports: alle toegang via service-role API routes.

GRANT ALL ON public.garage_claims TO service_role;
