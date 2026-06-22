-- TrustGarage.nl — Migratie: afspraak-aanvragen
-- Uitvoeren in: Supabase Dashboard → SQL Editor → New query → Run

CREATE TABLE IF NOT EXISTS public.appointment_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  garage_id UUID REFERENCES public.garages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  preferred_date DATE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'nieuw' CHECK (status IN ('nieuw', 'afgehandeld')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointment_requests_garage ON public.appointment_requests(garage_id);
CREATE INDEX IF NOT EXISTS idx_appointment_requests_user ON public.appointment_requests(user_id);

ALTER TABLE public.appointment_requests ENABLE ROW LEVEL SECURITY;
-- Bewust geen policies voor anon/authenticated — net als bij review_invitations gaat alle
-- toegang via service-role API routes, zodat telefoonnummer/e-mail nooit per ongeluk publiek
-- leesbaar worden via een policy-fout.

GRANT ALL ON public.appointment_requests TO service_role;
