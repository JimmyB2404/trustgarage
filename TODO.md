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
- [ ] KVK API toegang aanvragen via developer.kvk.nl — aangevraagd 2026-06-19, oorspronkelijke
      schatting van ~2 werkdagen bleek te optimistisch: stand 2026-06-22 nog zeker 5 werkdagen te gaan
- [x] Google Maps API key aangevraagd, ingevuld in `.env.local` én Vercel — werkend bevestigd op
      productie
- [ ] Initieel garagemateriaal verzamelen (10–15 garages in Maastricht als seed data) — pas na
      lancering, opdrachtgever doet dit zelf via sales-bezoeken bij de garages

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
- [ ] Seed data invoeren: 10–15 Maastricht garages — pas na lancering, zie sectie 0

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
- [x] Bug gefixt: foto's uploaden bleef oneindig op "uploading..." staan op iPad. Oorzaak:
      ontbrekende foutafhandeling rond de upload-`fetch`-calls (zowel hier als in
      `/dashboard/profiel`) — een grote foto (iPad-camera's zitten al snel boven 5 MB) kreeg op de
      server een platformfoutpagina i.p.v. JSON terug, en die crashte ongevangen op `res.json()`,
      waardoor de laadstatus nooit meer werd gereset. De UI beloofde overal "max. 5 MB" maar dit
      werd nergens echt gecontroleerd. Nu: clientside groottecheck vóór elke upload (gedeelde
      `validatePhotoSize()` in `lib/utils.ts`) + try/catch/finally rond alle upload-calls, zodat de
      gebruiker altijd een duidelijke foutmelding krijgt i.p.v. een oneindige spinner. In de wizard
      blokkeert een mislukte logo/foto-upload bovendien niet langer de bevestigingsstap — het
      account/de garage is op dat punt al aangemaakt
- [ ] Echte KVK verificatie (wacht op API key)

### 5.4 Wachtwoord reset (`/wachtwoord-reset`)
- [x] Supabase gekoppeld, reset mail actief
- [x] Bug gefixt: reset-link in de mail wees naar een niet-bestaande pagina
      (`/account/nieuw-wachtwoord`), en zou daar zelfs bij bestaan alsnog door de middleware naar
      `/inloggen` zijn gestuurd (geen sessie bekend op het moment dat de server het verzoek
      binnenkrijgt). Nieuwe pagina `/wachtwoord-reset/nieuw` toegevoegd, buiten het door
      middleware afgeschermde `/account`-pad — vraagt nieuw wachtwoord op en slaat het op via
      `supabase.auth.updateUser()`
- [x] Bevestigd: `https://www.trustgarage.nl/**` staat als wildcard in Supabase's Redirect
      URLs-lijst, dekt `/wachtwoord-reset/nieuw` automatisch — volledige flow getest en werkend
      op productie (link → formulier → wachtwoord wijzigen → inloggen met nieuw wachtwoord)

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

### 6.3 Stripe abonnement — **live en volledig werkend, inclusief BTW**
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
- [x] **Live mode geactiveerd** — live secret key, live webhook (`www.trustgarage.nl`, geleerd van
      de test-mode-bug) en live Price ID's ingevuld in Vercel
- [x] Bug gefixt: `automatic_tax` stond niet aan bij het aanmaken van de checkout-sessie, waardoor
      het in het Stripe-dashboard ingestelde BTW-tarief nooit werd toegepast
- [x] Bug gefixt: automatische belasting heeft een factuuradres op de klant nodig — Checkout vraagt
      dit nu op en slaat het automatisch op (`customer_update.address: 'auto'`)
- [x] Bug gefixt: upgrade-knop bleef oneindig laden bij een Stripe-fout i.p.v. een melding te tonen
      (ontbrekende try/catch in zowel de API-route als de frontend)
- [x] BTW (21% NL/BE) bevestigd correct werkend op de live checkout-pagina
- [x] Plannen-indeling (Gratis/Premium/Business) herzien en consistent gemaakt — bleek voorheen op
      6 plekken (`/tarieven`, `/voor-garages`, `/dashboard/abonnement`'s twee arrays, de
      "Upgrade naar Premium"-kaart op het dashboard, en de Engelse varianten) elk een ANDER verhaal
      te vertellen, en bijna geen van de beloofde limieten (foto's, diensten, reviews) werd ook
      maar ergens in de code afgedwongen. Nieuwe, overal identieke indeling:
      - **Gratis**: vermelding + basisprofiel, KVK-badge, **onbeperkt** foto's/diensten/reviews
        (bewuste keuze: een onvolledig gratis profiel schaadt niet alleen de garage maar ook het
        vertrouwen in het platform zelf — zie ook Google Business Profile/TripAdvisor, die hetzelfde
        doen)
      - **Premium** (€39): + reageren op reviews, statistieken & inzichten, "Uitgelicht"-badge
      - **Business** (€89): + concurrentie-inzicht t.o.v. regionaal gemiddelde, dedicated
        accountmanager, vroege toegang tot nieuwe functies
      "Meerdere locaties beheren" en "API-integratie" geschrapt van de Business-lijst — die
      bestonden alleen in tekst, nergens in de code (geen datamodel, geen endpoint)
      "Reageren op reviews" is nu het hoofdargument voor Premium (niet statistieken) — een garage
      die niet kan reageren op een onterechte review voelt dat acuut, sterker dan abstracte cijfers
- [x] Premium/Business-uitlichting op `/zoeken` + `/en/zoeken` nu ook echt functioneel, niet meer
      puur visueel: betalende garages (Premium/Business) staan altijd boven Gratis-garages, voor
      elke sorteeroptie (beoordeling/reviews/dichtsbij). Binnen die twee groepen blijft de
      sortering zelf eerlijk/ongewijzigd — betalen bepaalt dus alleen óf je in de uitgelichte groep
      zit, niet je positie daarbinnen (een slecht-beoordeelde Business-garage staat niet boven een
      beter-beoordeelde Premium-garage). Voorkomt dat een betalende garage met een matige score een
      betere gratis garage in de "eerlijke" ranking voorbij gaat, wat de reviews-gebaseerde
      geloofwaardigheid van het platform zou ondermijnen
      Badge hernoemd van "Aanbevolen" naar "Uitgelicht" op alle plekken (kaarten + alle
      pricing-pagina's, NL en EN)
      Bug gevonden en gefixt tijdens het bouwen: de verticale GarageCard (gebruikt op de homepage)
      toonde de badge alleen bij `plan === 'premium'`, een overgebleven extra check die Business-
      garages onterecht uitsloot — `featured` was al genoeg
      Getest met de bestaande mix van Premium/Gratis-testgarages: een Gratis-garage met de hoogste
      beoordeling van de hele lijst (5.0) staat na het sorteren correct ÓNDER alle Premium-garages

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
- [x] Bug gefixt: zie de identieke fix bij 5.3 — dezelfde ontbrekende foutafhandeling/
      groottecheck zat ook in `handlePhotoUpload`/`handleLogoUpload` hier

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
- [x] Bevestigingsmail naar gebruiker sturen (zie sectie 9b — `/api/reviews/notify`)

---

## 9b. Reviewverificatie ("Geverifieerd bezoek") — P0

Tweede vertrouwenslaag naast KVK: bewijst dat een specifieke review van een bevestigd bezoek komt.
**Volledig gebouwd, getest en live** (Playwright, Pad A + Pad B + privacy + admin-poort +
uitnodigingsmail via Resend) — geen openstaande punten meer.

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
- [x] Beide paden komen nu samen bij de admin: garage's blinde bevestiging (Pad B) zet niet meer
      direct op `verified`, maar op `pending_admin` — zelfde eindstap als Pad A. Admin-wachtrij
      toont per item via welk pad de review kwam ("Via uitnodiging" / "Spontaan — garage al
      bevestigd"), met aangepaste weergave per pad (nummervergelijking bij Pad A, enkel bonnummer
      bij Pad B)
- [x] Badge op reviews ("Geverifieerd bezoek") + aggregaatcijfer op garageprofiel ("X van Y
      geverifieerd") + korte uitleg op homepage en zoekresultaten
- [x] End-to-end getest met Playwright — 4 bugs gevonden en gefixt onderweg, inclusief een
      belangrijke fix: garageprofiel cachete Supabase-data oneindig (gold voor alle reviews/
      ratings/favorieten, niet alleen verificatie) — opgelost met `export const dynamic =
      'force-dynamic'`
- [x] Tweede, vergelijkbare bug gevonden tijdens de smoke test (2026-06-21): een gloednieuwe
      garage's allereerste review kwam soms structureel niet mee in de reviews-query op
      `/garage/[slug]`, terwijl `garage.review_count` (een andere query) al wel correct was en
      directe queries via een los script de review altijd gewoon teruggaven — wijst op een
      kortstondige staleness in het leespad bij Vercel/Supabase, niet op een fout in de query
      zelf. Mitigatie: als `rawReviews` leeg terugkomt terwijl `garage.review_count > 0`, één
      automatische herhaalde poging na 300ms — verholpen het structureel bij testen
- [x] `ADMIN_EMAIL`/`NEXT_PUBLIC_SITE_URL` toegevoegd aan Vercel environment variables + geredeployed
- [x] Productie-buildfout gefixt: Resend-client werd op module-niveau aangemaakt en crashte de build
      zolang `RESEND_API_KEY` ontbrak — nu pas aangemaakt op het moment dat een mail verstuurd wordt
- [x] `ADMIN_EMAIL` ondersteunt nu een kommagescheiden lijst — meerdere adminaccounts mogelijk
- [x] Admin landt na inloggen op de homepage en krijgt, net als garage-eigenaren, een
      "Dashboard"-knop in de Navbar die naar `/admin` linkt
- [x] Resend account + geverifieerd verzenddomein (SPF/DKIM via TransIP) — `RESEND_API_KEY`
      (Sending access) ingevuld in `.env.local` én Vercel, uitnodigingsmail getest en bevestigd
      ontvangen op productie
- [ ] Optioneel: los, toegewijd admin-account aanmaken (i.p.v. het huidige persoonlijke account)

---

## 10. Overige Publieke Pagina's

- [x] Voor garages (`/voor-garages`) — uitleg, prijsplannen, CTA
- [x] Bug gefixt: alle aanmeldknoppen op `/voor-garages` linkten naar `/registreren` (particulieren)
      i.p.v. `/garage/aanmelden` (garage-wizard)
- [x] Tarieven (`/tarieven`) — losse pagina met de 3 prijsplannen, toegevoegd aan Navbar + sitemap
- [x] Over ons (`/over-ons`) — verhaal, missie, team, oprichtersfoto toegevoegd

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
- [x] `next/image` optimaliseren met `sizes` attribuut — alle echte foto/logo-`<img>`'s
      (GarageCard, garageprofiel, dashboard profiel, over-ons) omgezet naar `<Image fill sizes=...>`,
      met de Supabase Storage-domain toegevoegd aan `next.config.mjs`'s `remotePatterns`. De
      blob-preview-afbeeldingen in de aanmeldwizard blijven bewust gewone `<img>`'s — `next/image`
      optimaliseert lokale `blob:`-object-URL's niet
- [x] Lazy loading voor foto strips — gratis meegekomen met de `next/image`-omzetting hierboven
      (lazy-load by default)

---

## 12b. Google Analytics 4

- [x] Cookie-consent-banner (`components/ui/CookieConsent.tsx`) — keuze (geaccepteerd/geweigerd)
      onthouden in `localStorage`, GA4 laadt nooit vóór een expliciete "Accepteren"
- [x] GA4-script conditioneel geladen (`components/ui/GoogleAnalytics.tsx`, via `next/script`) —
      alleen als er consent is gegeven **en** `NEXT_PUBLIC_GA_MEASUREMENT_ID` is ingesteld; zonder
      Measurement ID (huidige status) doet de component niets, geen crash
- [x] Custom events getagd op de afgesproken conversiemomenten (`lib/analytics.ts`'s `trackEvent`):
      `search_performed` (zoekopdracht, gedebounced op 600ms), `call_click`/`appointment_click`
      (CTA-knoppen op garagepagina, via nieuw `GarageCTAButtons.tsx`), `registration_started`/
      `registration_completed` (aanmeldwizard), `review_submitted`, `upgrade_started`/
      `upgrade_completed` (Stripe-checkout)
- [x] GA4-property aangemaakt op analytics.google.com + Measurement ID (`G-JS0L91R4RD`) ingevuld in
      `.env.local` en Vercel — geverifieerd live op productie (2026-06-23): geen GA-verkeer vóór
      consent, `gtag.js` laadt correct na "Accepteren" en er kwam een collect-hit binnen bij Google
- Let op: cijfers komen in Google's eigen GA4-interface (analytics.google.com) terecht, niet in
  `/admin`. Per-garage profielweergaven blijven via de bestaande `page_views`-tabel/dashboard lopen
  — dat is een apart systeem en verandert niet door GA4

---

## 13. Deployment & Productie

- [x] Vercel project + GitHub gekoppeld (auto-deploy actief)
- [x] Domeinen toegevoegd: trustgarage.nl + trustgarage.be
- [x] DNS ingesteld in TransIP
- [x] trustgarage.nl is het hoofddomein — `.be` (met en zonder www) redirect met een 308 naar
      `www.trustgarage.nl` via Vercel domain settings (was eerder onjuist gemarkeerd als gedaan:
      `.be` redirectte naar zijn eigen www-versie, niet naar `.nl` — nu echt gefixt)
- [x] trustgarage.nl live
- [x] Omgevingsvariabelen ingesteld in Vercel (Supabase URL/key, service role key)
- [x] Stripe webhook endpoint geregistreerd (test + live mode, op `www.trustgarage.nl`)
- [x] Smoke test geslaagd op productie (2026-06-21): garage geregistreerd via de wizard, klant
      schreef een review, checkout voor Premium correct aangemaakt in live mode. Betaling zelf
      niet met een echte kaart afgerond (bewuste keuze, die flow is al uitgebreid gedekt door de
      eerdere test-mode-tests) — onderweg de hierboven genoemde reviews-staleness-bug gevonden
      en gefixt. Testdata (garage, account, reviews) achteraf opgeruimd

---

## Voor morgen (2026-06-24)

- [ ] Privacybeleid-pagina (`/privacy`) — wordt al gelinkt vanuit de footer op elke pagina, maar
      bestaat nog niet (dode link, 404)
- [ ] Algemene voorwaarden-pagina (`/voorwaarden`) — zelfde situatie, al gelinkt vanuit de footer,
      bestaat nog niet (dode link, 404)
- [ ] Profielvolledigheid op het dashboard-overzicht uitbreiden: toont nu alleen een percentage
      (`computeCompleteness` in `app/dashboard/page.tsx`) met een generieke tekst. Graag concreet
      met bullet points tonen wélke velden nog ontbreken om naar 100% te gaan (bv. "Voeg een
      omschrijving toe", "Voeg openingstijden toe")

---

## Prioriteiten voor lancering

1. ~~**Smoke test**~~ — geslaagd op productie, 2026-06-21 (zie sectie 13)
2. ~~**Google Analytics 4**~~ — live en geverifieerd op productie, 2026-06-23 (zie sectie 12b)
3. **KVK API activeren** — zodra API key beschikbaar is (aangevraagd 2026-06-19, stand 2026-06-22:
   nog zeker 5 werkdagen)
4. **Seed data** is geen lanceerblokker meer — opdrachtgever voert dit pas na lancering in, via
   sales-bezoeken bij de garages zelf (zie sectie 0)

---

## Later (post-lancering) — P2

- [x] Bevestigingsmail naar klant na review schrijven + e-mailnotificatie naar garage-eigenaar bij
      nieuwe review (`POST /api/reviews/notify`, vanuit `ReviewModal.tsx` aangeroepen na opslaan,
      best-effort — review zelf faalt niet als een van de mails mislukt)
- [x] Custom SMTP via Resend ingesteld in Supabase (Authentication → SMTP Settings) —
      bevestigingsmail registreren, wachtwoord-reset en e-mailwijziging lopen nu via Resend i.p.v.
      Supabase's eigen mailer. Rate limit verhoogd naar 30 mails/uur (instelbaar, was hard
      vastgezet op 4/uur zolang Supabase's eigen mailer gebruikt werd)
- [x] `next/image` optimaliseren met `sizes` attribuut + lazy loading foto strips — zie sectie 12
- [x] Google Maps embed op garageprofiel — vervangt placeholder, valt netjes terug als de key
      ontbreekt
- [x] Kaartweergave zoekresultaten (meerdere markers, via `@react-google-maps/api`'s Maps
      JavaScript API i.p.v. de simpele Embed API). Desktop: permanente split, lijst + sticky kaart
      naast elkaar. Mobiel: Lijst/Kaart-toggle (nooit beide tegelijk). `garages` kreeg nieuwe
      `latitude`/`longitude`-kolommen (`supabase/migration_garage_coordinates.sql`), gevuld via
      gratis OpenStreetMap-geocoding (`lib/geocode.ts` — Google's Geocoding API accepteert geen
      server-side calls met een referrer-restricted key) bij aanmelden/adreswijziging. Bestaande
      11 garages eenmalig achteraf geocodeerd (9 gelukt, 2 nep-testadressen gemist, verwacht)
- [x] Afspraak maken functionaliteit — bewust géén agenda/tijdslot-systeem (te veel gevraagd van
      garages voor een eerste versie), maar een aanvraagformulier: klant vult naam, telefoon
      (verplicht), e-mail/gewenste datum/omschrijving (optioneel) in via een modal op de
      garagepagina (`components/modals/AppointmentModal.tsx`, geen login vereist — zelfde drempel
      als "Bellen"). Garage krijgt een meldingsmail via Resend en ziet de aanvraag in een nieuwe
      "Afspraken"-sectie in het dashboard (`/dashboard/afspraken`), met alleen "Markeer als
      afgehandeld" — bewust geen "Bevestigen/Afwijzen", want het platform boekt zelf niets, de
      garage regelt de afspraak telefonisch/per mail. Als de klant ingelogd was bij het aanvragen,
      ziet die de aanvraag ook terug op `/account/aanvragen` (status "In behandeling" →
      "Afgehandeld" zodra de garage hem afhandelt — zelfde onderliggende status, andere copy per
      kant). Nieuwe `appointment_requests`-tabel, geen RLS-policies voor anon/authenticated (zelfde
      privacypatroon als `review_invitations` — telefoonnummer/e-mail alleen via service-role
      routes). Getest met een tijdelijk wegwerp-testaccount: gast-aanvraag, ingelogde aanvraag
      (incl. voorinvullen naam/e-mail uit sessie), en de hele dashboard-flow inclusief
      status-wijziging — alle drie end-to-end bevestigd, daarna opgeruimd
- [x] Volwaardig moderatie-dashboard — drie nieuwe secties toegevoegd aan `/admin`, allemaal
      bereikbaar via dezelfde nav als Statistieken/Verificaties:
      - **Reviews** (`/admin/reviews`): overzicht van alle reviews met verwijderknop, plus een
        "Gerapporteerd"-filter. Klanten kunnen nu zelf een review rapporteren (knop onderaan elke
        review op de garagepagina, geen login vereist) via een nieuwe `review_reports`-tabel —
        zelfde "geen publieke RLS-policy"-patroon als `review_invitations`/`appointment_requests`
      - **Garages** (`/admin/garages`): overzicht van alle garages met Schorsen (verdwijnt uit
        zoekresultaten/profiel/sitemap, eigenaar kan nog wel inloggen op het dashboard — met een
        duidelijke melding daar, **en krijgt nu een e-mail bij schorsen**) en Verwijderen
        (definitief, cascadeert naar reviews/foto's/etc. via bestaande FK's, **en stuurt ook een
        e-mail** — naam/adres worden vóór het verwijderen opgehaald, anders is er niemand meer om
        naar te mailen). Nieuwe `garages.suspended`-kolom, gefilterd in `lib/garages.ts`,
        `/zoeken` en `app/sitemap.ts`
      - **Gebruikers** (`/admin/gebruikers`): overzicht van alle accounts (klant of garage-
        eigenaar), met blokkeren/deblokkeren via Supabase Auth's eigen ban-functionaliteit
      - Rapportreden wordt nu ook echt getoond in `/admin/reviews` (eerste versie haalde alleen
        het *aantal* rapportages op, niet de ingevulde reden zelf — gefixt)
      Eén bekende beperking: verwijderen van een garage ruimt de database-rijen op maar laat
      eventuele logo/foto-bestanden in Supabase Storage staan (die zijn niet aan een Postgres FK
      gekoppeld) — kleine, lage-prioriteit nette-afronding voor later.
      Getest met tijdelijke wegwerp-accounts (test-garage, test-klant, test-admin via een
      tijdelijke toevoeging aan `ADMIN_EMAIL`): rapporteren → reden zichtbaar → filter →
      verwijderen, schorsen → 404 op publieke pagina + e-mailcode crasht niet, verwijderen →
      e-mailcode crasht niet, blokkeren → kan niet meer inloggen — alle end-to-end bevestigd op
      een lokale productie-build, daarna volledig opgeruimd
- [x] Garages bekijken vanuit admin — "Bekijk dashboard"-link per garage in `/admin/garages` naar
      een nieuwe, alleen-lezen pagina (`/admin/garages/[id]`): profiel, profielweergaven, reviews
      incl. reacties van de garage, geclaimd/niet-geclaimd-status. Bewust **niet** echte
      impersonatie (inloggen als de garage) — een apart admin-only endpoint dat dezelfde data
      teruggeeft, geen sessie-wissel, dus geen risico dat een admin per ongeluk iets verstuurt of
      wijzigt namens de garage. Getest met een geclaimde testgarage (reviews + reactie correct
      zichtbaar) én een niet-geclaimde garage zonder `user_id` (toont terecht "Niet geclaimd")
- [ ] Garages bulk importeren zonder eigenaar (`user_id = null`) — voor het zelf invoeren van
      Maastrichtse garages vóór ze geclaimd zijn. Wacht op de brongegevens van de opdrachtgever;
      dan een eenmalig importscript (zelfde patroon als de geocoding-inhaalslag), inclusief
      automatisch geocoderen voor de kaartweergave
- [x] "Ik ben de eigenaar"-claimflow — op een ongeclaimde garagepagina (subtiele tekstlink onder de
      contactkaart, NL+EN) kan een klant via "Ik ben de eigenaar" een account aanmaken/inloggen
      (gewoon het bestaande klant-account werkt ook) en telefoon + KVK-nummer opgeven. Komt in een
      nieuwe wachtrij (`/admin/claims`, zelfde "geen publieke RLS-policy"-patroon als
      review_invitations/appointment_requests/review_reports). Daar staat het opgegeven
      telefoon/KVK-nummer naast wat al op het profiel stond, zodat je in één oogopslag kan
      vergelijken vóór je goedkeurt. Pas bij goedkeuring wordt `garages.user_id` echt gekoppeld
      (en eventuele andere openstaande aanvragen voor diezelfde garage automatisch afgewezen) +
      bevestigingsmail; bij afwijzen blijft de garage ongeclaimd + afwijsmail.
      Bewust geen `?redirect=`-mechanisme na inloggen (bestaat nergens in de app) — klant klikt na
      inloggen gewoon opnieuw op de garagepagina op "Ik ben de eigenaar". Toont "in behandeling"
      i.p.v. de knop als er al een openstaande aanvraag van diezelfde klant is.
      **Bijvangst, mogelijk belangrijke vondst**: tijdens het testen ontdekt dat de garagepagina
      (`app/garage/[slug]/page.tsx`, en de Engelse variant) na een server-side update soms
      verouderde data bleef tonen, zelfs met `force-dynamic` — root cause: de losse
      `createClient()`-aanroepen voor de garage- en reviews-query gaven geen expliciete
      `cache: 'no-store'` mee aan hun onderliggende `fetch()`. Toegevoegd via Supabase se
      `global.fetch`-optie aan `fetchGarageBySlug`/`fetchGarages` (`lib/garages.ts`) en de
      reviews-query in beide taalvarianten. Dit is zeer waarschijnlijk dezelfde onderliggende
      oorzaak als het eerder gedocumenteerde, nooit-volledig-opgeloste "nieuwe review verschijnt
      niet direct"-probleem (zie sectie hierboven) — de bestaande 300ms-retry daar laten staan als
      extra vangnet, maar dit zou de echte fix kunnen zijn. Nog niet gecontroleerd of dit patroon
      ook elders in de codebase voorkomt (andere server-side `createClient()`-aanroepen) — waard
      om bij een volgende staleness-melding als eerste te checken.
      Getest end-to-end met wegwerp-accounts (testklant + tijdelijke testadmin via `ADMIN_EMAIL`):
      claimen → "in behandeling" → admin ziet vergelijking → goedkeuren → garage direct gekoppeld
      (knop direct weg, geen verouderde weergave meer) → klant kan inloggen op het dashboard. Apart
      ook het afwijs-pad getest: garage blijft ongeclaimd, claim-status wordt 'rejected'
- [x] Engelstalige versie van de website — bewust beperkt tot de publieke, klantgerichte
      pagina's (homepage, zoeken, garageprofiel, voor-garages, tarieven, over-ons); dashboard/account/admin
      en de aanmeldwizard blijven Nederlands, want die gebruiken alleen Nederlandse garage-
      eigenaren en jijzelf. Geen i18n-framework (next-intl) — gewoon losse pagina's onder
      `/en/...` die dezelfde data/componenten herbruiken, met een `locale`-prop die doorgegeven
      wordt aan alle gedeelde componenten (inclusief de formulieren: review schrijven, afspraak
      aanvragen, rapporteren). Nederlands blijft de standaard zonder URL-prefix (`/zoeken`),
      Engels staat onder `/en/...` (`/en/zoeken`) — geen bestaande URL’s gewijzigd, dus geen
      impact op de huidige SEO-indexering. Taalschakelaar (NL|EN, geselecteerde taal vetgedrukt)
      rechtsboven in de Navbar, alleen zichtbaar op pagina's die een vertaling hebben; detecteert
      zelf via het pad, geen prop nodig op bestaande paginas. `hreflang`-alternates toegevoegd op
      alle vertaalde paginas, en `/en/...`-varianten toegevoegd aan `sitemap.ts`.
      Dienst-/taalnamen (APK, Onderhoud, Banden, ...) zijn losse opgeslagen databasewaarden
      waarop gefilterd wordt — vertaald alleen het getoonde label (`SERVICE_LABELS_EN`/
      `LANGUAGE_LABELS_EN` in `lib/mock-data.ts`), de onderliggende waarde blijft Nederlands zodat
      filteren correct blijft werken. Door garages/klanten geschreven tekst (omschrijvingen,
      reviews) wordt nergens automatisch vertaald.
      Bekende, bewust geaccepteerde beperking: de `<html lang="...">`-tag op alle pagina's staat
      vast op `"nl"` (wordt door de root layout gezet, kan niet per-pagina variëren zonder een
      service Next.js-aanpak) — heeft geen invloed op `hreflang`-gebaseerde taalherkenning door
      Google, wel een klein gemis voor screenreaders op de Engelse pagina's.
      Getest: alle 5 Engelse pagina's, taalschakelaar in beide richtingen (inclusief afwezig op
      niet-vertaalde pagina's zoals `/tarieven`), reviewformulier + afspraakformulier + cookie-
      banner volledig Engels, en een regressiecheck dat alle Nederlandse pagina's ongewijzigd
      blijven werken
- [x] Hardcoded "Maastricht"-teksten gegeneraliseerd voor SEO (`app/layout.tsx`'s keywords,
      `app/page.tsx`'s "Aanbevolen garages in ..."-kop, `components/layout/Footer.tsx`'s
      zoeklink) — geen van deze kwam overeen met een echte stadsfilter, puur tekst. Bewust
      ongewijzigd gelaten: `app/over-ons/page.tsx`'s "In 2024 zijn we gestart in de regio
      Maastricht" (klopt nog steeds, is oprichtingsgeschiedenis, geen scope-claim) en
      `lib/mock-data.ts`'s voorbeeldgarages (nergens geïmporteerd/gerenderd, dus geen SEO-impact)
- [x] Drie extra functies vóór v1.0-lancering, op verzoek:
      - **"Nu open"-toggle** op `/zoeken` + `/en/zoeken` — filtert op `isGarageOpen()`, dezelfde
        check die de Open/Gesloten-badge al gebruikte
      - **Afstand-schuifbalk** — vraagt eenmalig browserlocatie (`navigator.geolocation`, met een
        nette melding bij weigeren/niet-beschikbaar), berekent afstand via een haversine-formule
        (`calculateDistanceKm` in `lib/utils.ts`) tegen de bestaande `latitude`/`longitude` op elke
        garage. Garages die nog niet gegeocodeerd zijn vallen automatisch buiten een actief
        afstandsfilter. Maakt de al langer bestaande maar nooit werkende "Dichtsbij"-sorteeroptie
        voor het eerst functioneel
      - **Garages vergelijken** — selectievakje ("Vergelijken") op elke garage in de
        zoekresultaten (max. 3), vaste balk onderin bij 1+ selectie, nieuwe pagina's
        `/vergelijken` en `/en/compare` (`?ids=a,b,c`) met beoordeling/KVK/open-status/diensten/
        talen naast elkaar. Let op: de vergelijk-balk kreeg een hogere z-index dan de cookiebanner
        — die overlapten elkaar onderin het scherm en blokkeerden anders de klik
      - **Concurrentie-inzicht** (`/dashboard/inzichten`, **Business-only** met upsell-kaart voor
        Free/Premium): vergelijkt eigen gemiddelde beoordeling, aantal reviews en reactiesnelheid
        met het gemiddelde van andere niet-geschorste garages in dezelfde stad (zichzelf
        uitgesloten van dat gemiddelde). Nieuwe route `/api/dashboard/insights`, in-app
        geaggregeerd net als elders in dit project (geen SQL-aggregatiefuncties)
      Getest met wegwerp-testaccounts: open-nu-filter (0 resultaten correct buiten openingstijden),
      afstandsfilter (sluit niet-gegeocodeerde garages correct uit), vergelijken end-to-end in
      beide talen, en Business- vs. Free-weergave van Inzichten met handmatig ingevoerde
      review-/reactiedata om de berekening te verifiëren
- [ ] Meer steden toevoegen buiten Maastricht
