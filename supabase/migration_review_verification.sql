-- TrustGarage.nl — Migratie: Reviewverificatie ("Geverifieerd bezoek")
-- Uitvoeren in: Supabase Dashboard → SQL Editor → New query → Run

-- ============================================
-- 1. Uitnodigingen (Pad A — garage stuurt verzoek met factuurnummer vooraf)
-- ============================================
CREATE TABLE IF NOT EXISTS public.review_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  garage_id UUID REFERENCES public.garages(id) ON DELETE CASCADE NOT NULL,
  customer_email TEXT NOT NULL,
  invoice_number TEXT NOT NULL,
  token UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'used', 'expired')),
  review_id UUID REFERENCES public.reviews(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_review_invitations_token ON public.review_invitations(token);
CREATE INDEX IF NOT EXISTS idx_review_invitations_garage ON public.review_invitations(garage_id);

ALTER TABLE public.review_invitations ENABLE ROW LEVEL SECURITY;
-- Bewust GEEN policies voor anon/authenticated — alle toegang loopt via service-role API routes,
-- zodat invoice_number/customer_email/token nooit per ongeluk publiek leesbaar worden via een
-- verkeerd geconfigureerde policy.

-- Zonder deze GRANT krijgt zelfs de service_role "permission denied" op een nieuwe tabel.
GRANT ALL ON public.review_invitations TO service_role;

-- ============================================
-- 2. Verificatievelden op reviews
-- ============================================
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS receipt_number TEXT,
  ADD COLUMN IF NOT EXISTS invitation_id UUID REFERENCES public.review_invitations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verification_path TEXT CHECK (verification_path IN ('invitation', 'organic')),
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'none'
    CHECK (verification_status IN ('none', 'pending_admin', 'pending_garage', 'verified', 'rejected'));

-- Geen RLS-wijziging nodig op reviews zelf — RLS is rij-niveau, niet kolom-niveau. Het risico zit
-- in applicatiecode: elke publieke query op reviews moet expliciete kolommen selecteren in plaats
-- van '*', anders lekt receipt_number naar de browser (gefixt in app/garage/[slug]/page.tsx).

-- verified BOOLEAN (bestaande kolom) blijft de enige bron die de UI leest voor de badge — wordt
-- pas TRUE op het moment dat verification_status 'verified' wordt (in de API routes, niet hier).
