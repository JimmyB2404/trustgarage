-- TrustGarage.nl — Migratie: Stripe-koppeling
-- Uitvoeren in: Supabase Dashboard → SQL Editor → New query → Run

ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Eén actief abonnement per garage (geen historische ledger nodig) — maakt upsert mogelijk
-- vanuit de webhook zonder eerst handmatig te moeten checken of er al een rij bestaat.
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_garage_id_unique UNIQUE (garage_id);

-- Zonder deze GRANT krijgt service_role "permission denied" zodra de webhook erin probeert te
-- schrijven — zelfde patroon als eerder bij review_invitations.
GRANT ALL ON public.subscriptions TO service_role;
