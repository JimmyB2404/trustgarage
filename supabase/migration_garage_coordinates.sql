-- TrustGarage.nl — Migratie: garage-coördinaten (voor kaartweergave op /zoeken)
-- Uitvoeren in: Supabase Dashboard → SQL Editor → New query → Run

ALTER TABLE public.garages ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE public.garages ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
