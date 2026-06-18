# TrustGarage.nl — TODO

> Platform voor het vinden van betrouwbare garages in Nederland.
> Tech stack: Next.js 14+ (App Router) + Tailwind CSS 3.x + Supabase + Stripe + Vercel
> Taal: Nederlands (v1), later ook Engels

---

## 0. Voorbereiding door opdrachtgever

- [x] Domeinnaam TrustGarage.nl + .be registreren (via TransIP)
- [x] Supabase account aanmaken
- [x] Vercel account aanmaken + GitHub repository koppelen
- [ ] Stripe account aanmaken (NL bedrijf)
- [ ] KVK API toegang aanvragen via developer.kvk.nl
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

### 6.2 KVK verificatie
- [x] `POST /api/kvk` — stub met mock data
- [ ] Echte KVK API activeren zodra `KVK_API_KEY` beschikbaar is

### 6.3 Stripe abonnement
- [x] `POST /api/stripe/create-checkout` — stub
- [x] `POST /api/stripe/webhook` — stub
- [ ] Stripe activeren zodra account beschikbaar is

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
- [x] Plan tonen + upgrade knop (UI gereed, stub)
- [ ] Stripe koppelen

---

## 8. Gebruikersaccount — P1

- [x] Mijn reviews (`/account/reviews`) — UI gereed
- [x] Mijn profiel (`/account/profiel`) — UI gereed
- [x] Favorieten (`/account/favorieten`) — UI gereed
- [ ] Supabase data koppelen voor alle accountpagina's

---

## 9. Review schrijven (modal) — P0

- [x] Modal UI: sterren, tekst, taal, subcategoriescores
- [x] Opslaan in Supabase `reviews` + `review_ratings` tabellen
- [x] Wordt direct zichtbaar op garageprofiel na opslaan
- [ ] Bevestigingsmail naar gebruiker sturen

---

## 10. Overige Publieke Pagina's

- [x] Voor garages (`/voor-garages`) — uitleg, prijsplannen, CTA
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
- [ ] `sitemap.xml` genereren
- [ ] `robots.txt` aanmaken
- [ ] Open Graph tags per pagina (preview bij delen op WhatsApp/social)
- [ ] Structured data / JSON-LD voor garages (LocalBusiness schema)
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

1. **Seed data** — 10–15 Maastricht garages invoeren in Supabase
2. **SEO** — sitemap.xml, robots.txt, Open Graph tags, JSON-LD structured data
3. **Google Analytics 4** — bezoekersdata bijhouden
4. **Smoke test** — registreer garage → schrijf review → check dashboard
5. **Stripe activeren** — zodra Stripe account beschikbaar is
6. **KVK API activeren** — zodra API key beschikbaar is

## Nice to have (post-lancering)

- Bevestigingsmail naar klant na review schrijven (Resend)
- Accountpagina's koppelen aan Supabase (mijn reviews, favorieten, profiel)
- Meer steden toevoegen buiten Maastricht
- Lazy loading foto strips + `next/image` optimaliseren met `sizes`

---

## Later (post-lancering) — P2

- [ ] Google Maps embed op garageprofiel
- [ ] Kaartweergave zoekresultaten
- [ ] E-mailnotificaties voor nieuwe reviews (Resend aanbevolen)
- [ ] Custom SMTP via Resend (vervangt Supabase free tier limiet van 4/uur)
- [ ] Admin dashboard voor moderatie
- [ ] Engelstalige versie van de website
- [ ] Meer steden toevoegen buiten Maastricht
- [ ] Afspraak maken functionaliteit
