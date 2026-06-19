# TrustGarage.nl — TODO

> Platform voor het vinden van betrouwbare garages in Nederland.
> Tech stack: Next.js 14+ (App Router) + Tailwind CSS 3.x + Supabase + Stripe + Vercel
> Taal: Nederlands (v1), later ook Engels

---

## 0. Voorbereiding door opdrachtgever

- [x] Domeinnaam TrustGarage.nl + .be registreren (via TransIP)
- [x] Supabase account aanmaken
- [x] Vercel account aanmaken + GitHub repository koppelen
- [x] Stripe account aanmaken (NL bedrijf), bedrijfsgegevens geverifieerd
- [ ] KVK API toegang aanvragen via developer.kvk.nl — aangevraagd 2026-06-19, ~2 werkdagen
- [ ] Google Maps API key aanvragen (voor kaart embed op garageprofiel)
- [ ] Initieel garagemateriaal verzamelen (10–15 garages in Maastricht als seed data)

---

## 1. Project Setup

- [x] Next.js 14+ project initialiseren (App Router + TypeScript)
- [x] Tailwind CSS 3.x installeren en configureren
- [x] Design tokens toevoegen aan `tailwind.config.js`
- [x] Tabler Icons installeren (`@tabler/icons-react`)
- [x] Supabase client instellen (`@supabase/supabase-js`) + credentials in `.env.local`
- [x] Stripe SDK installeren
- [x] `.env.local` aanmaken met variabelen
- [x] Mappenstructuur aanmaken (`app/`, `components/`, `lib/`, `types/`)
- [x] GitHub repository aanmaken en koppelen aan Vercel

---

## 2. Database (Supabase)

- [x] Tabellen aangemaakt: `garages`, `garage_services`, `garage_languages`, `garage_hours`, `garage_photos`, `reviews`, `review_ratings`, `garage_replies`, `subscriptions`
- [x] `page_views` tabel aangemaakt voor profielweergaven tracking
- [x] `logo_url` kolom toegevoegd aan `garages` tabel
- [x] `favorites_count` kolom toegevoegd aan `garages` tabel
- [x] `favorites` tabel aangemaakt met RLS (public read, authenticated write)
- [x] Supabase Auth inschakelen (e-mail + wachtwoord, bevestigingsmail actief)
- [x] GRANT permissions ingesteld voor anon/authenticated/service_role
- [x] Storage bucket aanmaken voor garage foto's (`garage-photos`)
- [ ] Seed data invoeren: 10–15 Maastricht garages

---

## 3. Design System & UI Componenten

- [x] **Knoppen** — 4 varianten: Primary, Secondary, Ghost, Danger
- [x] **Badges & tags** — KVK geverifieerd, Aanbevolen, Engels gesproken, Premium lid, Nu open, Expat, Service tag, Nieuw
- [x] **Formuliervelden** — states: Default, Hover, Focus, Filled, Error, Disabled
- [x] **Garage card (verticaal)** — voor homepage grid
- [x] **Garage card (horizontaal)** — voor zoekresultaten
- [x] **Review kaart** — avatar, naam, expat badge, sterren, tekst, garage reactie
- [x] **Navigatie (Navbar)** — desktop + hamburger mobiel, sticky, backdrop blur
- [x] **Footer** — logo, links, copyright

---

## 4. Publieke Pagina's — P0

### 4.1 Homepage (`/`)
- [x] Hero, trustbar, garage cards (echte Supabase data), "Hoe het werkt", CTA, Footer
- [x] Responsive

### 4.2 Zoekresultaten (`/zoeken`)
- [x] Filterbar, sidebar, resultaatkaarten (echte Supabase data)
- [x] Responsive

### 4.3 Garageprofiel (`/garage/{slug}`)
- [x] Hero, foto strip, beschrijving, diensten, openingstijden
- [x] Reviews — echte data uit Supabase
- [x] Review schrijven knop — redirect naar login als niet ingelogd
- [x] Profielweergaven bijgehouden via `ViewTracker` component
- [x] Responsive

---

## 5. Auth Pagina's — P0

### 5.1 Inloggen (`/inloggen`)
- [x] Supabase Auth gekoppeld, rol-gebaseerde redirect (garage-eigenaar → dashboard)

### 5.2 Registreren gebruiker (`/registreren`)
- [x] Supabase Auth gekoppeld, e-mailbevestiging actief

### 5.3 Registreren garage — wizard (`/garage/aanmelden`)
- [x] 5-staps wizard (account, bedrijfsgegevens, KVK, profiel, bevestiging)
- [x] Supabase Auth + database volledig gekoppeld via `/api/garage/register`
- [x] E-mailbevestiging verstuurd na aanmelding
- [x] Logo upload in wizard (stap 4) — preview + upload na registratie
- [x] Foto upload in wizard (stap 4) — preview + upload na registratie
- [ ] Echte KVK verificatie (wacht op API key)

### 5.4 Wachtwoord reset (`/wachtwoord-reset`)
- [x] Supabase gekoppeld, reset mail actief

---

## 6. API Routes

### 6.1 Garage registratie & beheer
- [x] `POST /api/garage/register` — account aanmaken + garage opslaan (service role), geeft `garageId` terug
- [x] `PUT /api/garage/update` — garage profiel updaten (service role)
- [x] `POST /api/garage/reply` — garage reactie opslaan (service role)
- [x] `POST /api/garage/view` — profielweergave loggen (service role)
- [x] `GET /api/dashboard/views` — views ophalen voor dashboard (service role)
- [x] `POST /api/garage/photos` — foto's uploaden naar Storage + opslaan in `garage_photos`
- [x] `DELETE /api/garage/photos` — foto verwijderen uit Storage + database
- [x] `POST /api/garage/logo` — logo uploaden naar Storage + `garages.logo_url` bijwerken
- [x] `DELETE /api/garage/logo` — logo verwijderen uit Storage + `garages.logo_url` leegmaken
- [x] `GET /api/favorites` — check of favoriet / haal alle favorieten op (service role)
- [x] `POST /api/favorites` — favoriet toevoegen + `garages.favorites_count` syncen
- [x] `DELETE /api/favorites` — favoriet verwijderen + `garages.favorites_count` syncen

### 6.2 KVK verificatie
- [x] `POST /api/kvk` — stub met mock data
- [ ] Echte KVK API activeren zodra `KVK_API_KEY` beschikbaar is

### 6.3 Stripe abonnement — **volledig werkend, bevestigd met een echte test-betaling**
- [x] `lib/plans.ts` — gedeelde bron voor weergaveprijzen (Premium €39, Business €89); Price ID's
      zitten bewust niet hier maar server-side in env vars (test/live hebben andere ID's)
- [x] `POST /api/stripe/create-checkout` — ownership-check, Stripe customer aanmaken/herbruiken,
      Checkout Session voor het gekozen plan, Price ID's via `STRIPE_PRICE_PREMIUM`/`STRIPE_PRICE_BUSINESS`
- [x] `POST /api/stripe/webhook` — `checkout.session.completed` (upgrade + meteen `current_period_end`
      ingevuld), `customer.subscription.updated` (status/periode sync), `customer.subscription.deleted`
      (terug naar gratis)
- [x] `supabase/migration_stripe.sql` — `stripe_customer_id` kolom + unique constraint op
      `subscriptions.garage_id` + service_role GRANT — uitgevoerd
- [x] `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PREMIUM`, `STRIPE_PRICE_BUSINESS`
      ingevuld in `.env.local` én Vercel (test mode), gedeployed
- [x] Bug gevonden en gefixt: webhook-endpoint stond op `trustgarage.nl` (zonder www), wat
      308-redirect naar `www.trustgarage.nl` en de aflevering liet mislukken — endpoint-URL
      aangepast naar de www-versie
- [x] Echte test-betaling doorlopen (Stripe testkaart) — `garages.plan` en `subscriptions`
      bevestigd correct bijgewerkt in productie
- [x] Bug gefixt: Gratis-kaart toonde altijd "Huidig plan" (hardcoded), ook als de garage al op
      Premium/Business zat — CTA per kaart nu afgeleid van het echte `garage.plan`
- [x] Gratis-kaart is nu klikbaar als "Downgrade naar Gratis" wanneer niet het huidige plan, met
      inline bevestigingsstap, annuleert het echte Stripe-abonnement via nieuwe
      `POST /api/stripe/cancel-subscription`
- [x] Business is nu een echte, altijd-bestelbare Stripe-checkoutknop ("Upgrade naar Business")
      i.p.v. een niet-functionele "Contact opnemen"-placeholder
- [x] Veiligheidsfix: wisselen tussen Premium/Business annuleert eerst het oude abonnement
      (voorkomt dubbele facturatie)
- [x] Dashboard-overzicht: "Upgrade naar Premium"-kaart verborgen zodra de garage al een betaald
      plan heeft — getest en bevestigd op productie (inclusief downgrade-flow)
- [ ] Overstap naar live mode: nieuwe live-webhook aanmaken + live Price ID's/secret key invullen
      zodra er echte garages gaan betalen (live Price ID's al bekend: zie commit-historie)

---

## 7. Garage Dashboard — P0

### 7.1 Dashboard overzicht (`/dashboard`)
- [x] Layout: sidebar + main content, responsive
- [x] Echte metrics: aantal reviews, gemiddelde rating, onbeantwoord, reacties gegeven
- [x] Profielweergaven: totaal + 7-daagse staafgrafiek (echte data)
- [x] Profielvolledigheid berekend op basis van ingevulde velden
- [x] Upgrade card
- [x] Afgeschermd voor niet-ingelogde gebruikers (middleware)

### 7.2 Profiel beheren (`/dashboard/profiel`)
- [x] Formulier laadt echte garage data via `useGarage` hook
- [x] Opslaan naar Supabase via `/api/garage/update`
- [x] Omschrijving, diensten, talen, openingstijden bewerkbaar
- [x] Logo uploaden, previewer en verwijderen via `/api/garage/logo`
- [x] Foto's uploaden (max. 8) en verwijderen via `/api/garage/photos`

### 7.3 Reviews beheren (`/dashboard/reviews`)
- [x] Echte reviews geladen via `useGarage` hook
- [x] Reactie plaatsen opgeslagen via `/api/garage/reply`
- [x] Badge in sidebar toont live aantal onbeantwoorde reviews

### 7.4 Abonnement (`/dashboard/abonnement`)
- [x] Plan tonen + upgrade knop
- [x] Bug gefixt: "Uitloggen"-knop werkt nu (echte `signOut`) en sidebar-badge toont het live
      aantal onbeantwoorde reviews i.p.v. een hardcoded `2` — consistent met de andere 4
      dashboardpagina's
- [x] Huidig plan + "Huidig plan"-knopstatus leest nu echte `garage.plan` i.p.v. hardcoded `'free'`
- [x] "Upgrade naar Premium" gekoppeld aan `/api/stripe/create-checkout`, met laadstatus en
      succes/geannuleerd-banner na terugkomst van Stripe — getest en werkend in productie

---

## 8. Gebruikersaccount — P1

- [x] Mijn reviews (`/account/reviews`) — echte data, bewerken/verwijderen via Supabase
- [x] Mijn profiel (`/account/profiel`) — echte gebruikersdata, naam/e-mail/wachtwoord wijzigen
- [x] Favorieten (`/account/favorieten`) — UI + Supabase data gekoppeld via `/api/favorites`

---

## 9. Review schrijven (modal) — P0

- [x] Modal UI: sterren, tekst, taal, subcategoriescores
- [x] Opslaan in Supabase `reviews` + `review_ratings` tabellen
- [x] Bug gefixt: nieuwe review verscheen niet direct op het garageprofiel (geen refresh na
      opslaan — `ReviewButton` riep de bestaande `onSubmit`-callback van de modal nooit aan), nu
      via `router.refresh()`
- [ ] Bevestigingsmail naar gebruiker sturen

---

## 9b. Reviewverificatie ("Geverifieerd bezoek") — P0

Tweede vertrouwenslaag naast KVK: bewijst dat een specifieke review van een bevestigd bezoek komt.
**Volledig gebouwd en end-to-end getest** (Playwright, Pad A + Pad B + privacy + admin-poort) —
klaar voor productie, mist alleen nog een echt Resend-account voor verzending.

- [x] Database: `review_invitations` tabel + `receipt_number`/`verification_path`/
      `verification_status` op `reviews` (`supabase/migration_review_verification.sql`)
- [x] Privacyfix: garageprofiel selecteert expliciete kolommen i.p.v. `*` (bonnummer lekt anders)
- [x] Platform-adminrol via `ADMIN_EMAIL` env var (`lib/session.ts`, `lib/admin.ts`) — `/admin` en
      `/admin/verificaties`, alleen zichtbaar voor dat ene account, 404 voor iedereen anders
- [x] Pad B (spontaan): optioneel bonnummerveld in reviewformulier → blinde wachtrij in
      `/dashboard/reviews` (garage ziet alleen nummer + datum, nooit de review zelf)
- [x] Pad A (uitnodiging): nieuwe dashboardpagina `/dashboard/uitnodigingen` — garage stuurt
      factuurnummer vooraf naar klant via e-mail (Resend), platform vergelijkt nummers, match komt
      in admin-wachtrij voor laatste handmatige bevestiging
- [x] Badge op reviews ("Geverifieerd bezoek") + aggregaatcijfer op garageprofiel ("X van Y
      geverifieerd") + korte uitleg op homepage en zoekresultaten
- [x] End-to-end getest met Playwright — 4 bugs gevonden en gefixt onderweg, inclusief een
      belangrijke fix: garageprofiel cachete Supabase-data oneindig (gold voor alle reviews/
      ratings/favorieten, niet alleen verificatie) — opgelost met `export const dynamic =
      'force-dynamic'`
- [x] `ADMIN_EMAIL`/`NEXT_PUBLIC_SITE_URL` toegevoegd aan Vercel environment variables + geredeployed
- [x] Productie-buildfout gefixt: Resend-client werd op module-niveau aangemaakt en crashte de build
      zolang `RESEND_API_KEY` ontbrak — nu pas aangemaakt op het moment dat een mail verstuurd wordt
- [x] `ADMIN_EMAIL` ondersteunt nu een kommagescheiden lijst — meerdere adminaccounts mogelijk
- [x] Admin landt na inloggen op de homepage en krijgt, net als garage-eigenaren, een
      "Dashboard"-knop in de Navbar die naar `/admin` linkt
- [ ] Resend account + geverifieerd verzenddomein (SPF/DKIM via TransIP) — zonder dit wordt de
      uitnodigingsmail niet echt verstuurd (uitnodiging wordt wel aangemaakt, token leesbaar in
      Supabase om handmatig te verzenden); `RESEND_API_KEY` nog toevoegen aan Vercel zodra dit klaar is
- [ ] Optioneel: los, toegewijd admin-account aanmaken (i.p.v. het huidige persoonlijke account)

---

## 10. Overige Publieke Pagina's

- [x] Voor garages (`/voor-garages`) — uitleg, prijsplannen, CTA
- [x] Bug gefixt: alle aanmeldknoppen op `/voor-garages` linkten naar `/registreren` (particulieren)
      i.p.v. `/garage/aanmelden` (garage-wizard)
- [x] Tarieven (`/tarieven`) — losse pagina met de 3 prijsplannen, toegevoegd aan Navbar + sitemap
- [x] Over ons (`/over-ons`) — verhaal, missie, team

---

## 11. Responsive & Mobiel

- [x] Navbar hamburger menu
- [x] Homepage hero zoekbalk mobiel
- [x] Garage grid responsive
- [x] Zoekresultaten sidebar → bottom sheet
- [x] Garageprofiel aside → tabs
- [x] Dashboard sidebar → overlay drawer

---

## 12. SEO & Performance

- [x] Meta titles en descriptions per pagina
- [x] `sitemap.xml` genereren (`app/sitemap.ts`) — statische pagina's + alle garage slugs uit Supabase
- [x] `robots.txt` aanmaken (`app/robots.ts`) — disallow dashboard/account/api, verwijst naar sitemap
- [x] Open Graph + Twitter Card tags per garagepagina, met eigen logo/foto als afbeelding
- [x] Standaard OG-afbeelding (`app/opengraph-image.tsx`) — gegenereerd met huisstijl, fallback voor garages zonder foto
- [x] Structured data / JSON-LD voor garages (AutoRepair schema met aggregateRating + openingstijden)
- [ ] `next/image` optimaliseren met `sizes` attribuut
- [ ] Lazy loading voor foto strips

---

## 13. Deployment & Productie

- [x] Vercel project + GitHub gekoppeld (auto-deploy actief)
- [x] Domeinen toegevoegd: trustgarage.nl + trustgarage.be
- [x] DNS ingesteld in TransIP
- [x] trustgarage.be live + redirect naar trustgarage.nl
- [x] trustgarage.nl live
- [x] Omgevingsvariabelen ingesteld in Vercel (Supabase URL/key, service role key)
- [ ] Stripe webhook endpoint registreren in Stripe dashboard
- [ ] Smoke test: registreer garage → schrijf review → upgrade abonnement

---

## Prioriteiten voor lancering

1. **Seed data** — 10–15 Maastricht garages invoeren in Supabase (wacht op materiaal van opdrachtgever)
2. **Smoke test** — registreer garage → schrijf review → check dashboard, op productie
3. **Google Analytics 4** — bezoekersdata bijhouden
4. **Stripe naar live mode** — zodra er echte garages gaan betalen (test mode is volledig werkend
   en bevestigd; zie 6.3)
5. **KVK API activeren** — zodra API key beschikbaar is (aangevraagd 2026-06-19, opdrachtgever)
6. **Google Maps API key** — zodra key beschikbaar is (opdrachtgever)

---

## Later (post-lancering) — P2

- [ ] Bevestigingsmail naar klant na review schrijven (Resend)
- [ ] E-mailnotificaties voor garage-eigenaar bij nieuwe review (Resend)
- [ ] Custom SMTP via Resend (vervangt Supabase free tier limiet van 4 mails/uur)
- [ ] `next/image` optimaliseren met `sizes` attribuut + lazy loading foto strips
- [ ] Google Maps embed op garageprofiel + kaartweergave zoekresultaten
- [ ] Afspraak maken functionaliteit
- [ ] Volwaardig moderatie-dashboard (garages/gebruikers beheren, content verwijderen) — er bestaat
      nu alleen een admin-panel specifiek voor reviewverificatie (`/admin`)
- [ ] Engelstalige versie van de website
- [ ] Meer steden toevoegen buiten Maastricht
