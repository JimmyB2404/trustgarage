# TrustGarage.nl — TODO

> Platform voor het vinden van betrouwbare garages in Nederland.
> Tech stack: Next.js 14+ (App Router) + Tailwind CSS 3.x + Supabase + Stripe + Vercel
> Taal: Nederlands (v1), later ook Engels

---

## 0. Voorbereiding door opdrachtgever

- [ ] Domeinnaam TrustGarage.nl registreren
- [ ] Supabase account aanmaken
- [ ] Vercel account aanmaken + GitHub repository koppelen
- [ ] Stripe account aanmaken (NL bedrijf)
- [ ] KVK API toegang aanvragen via developer.kvk.nl
- [ ] Google Maps API key aanvragen (voor kaart embed op garageprofiel)
- [ ] Initieel garagemateriaal verzamelen (10–15 garages in Maastricht als seed data)

---

## 1. Project Setup

- [x] Next.js 14+ project initialiseren (App Router + TypeScript)
- [x] Tailwind CSS 3.x installeren en configureren
- [x] Design tokens toevoegen aan `tailwind.config.js`:
  - Kleuren: primary (`#0F6E56`), neutral, surface, amber, danger, info
  - Fonts: Georgia (serif), system-ui (sans), Courier New (mono)
  - Border radius: sm (4px), md (7px), lg (10px), xl (20px)
  - Max-width: site (1280px)
- [x] Tabler Icons installeren (`@tabler/icons-react`)
- [ ] Supabase client instellen (`@supabase/supabase-js`) — wacht op Supabase account
- [x] Stripe SDK installeren
- [x] `.env.local` aanmaken met variabelen (placeholders ingevuld)
- [x] Mappenstructuur aanmaken (`app/`, `components/`, `lib/`, `types/`)
- [ ] GitHub repository aanmaken en koppelen aan Vercel — wacht op opdrachtgever

---

## 2. Database (Supabase)

> ⏳ Wacht op Supabase account van opdrachtgever. Mock data in `lib/mock-data.ts` gebruikt.

- [ ] Tabellen aanmaken in Supabase:
  - `users` — id, email, name, created_at
  - `garages` — id, name, slug, address, city, kvk_number, kvk_verified, description, phone, email, website, plan (free/premium/business), created_at
  - `garage_services` — id, garage_id, service_name
  - `garage_languages` — id, garage_id, language
  - `garage_hours` — id, garage_id, day_of_week (0-6), open_time, close_time, is_closed
  - `garage_photos` — id, garage_id, url, order_index
  - `reviews` — id, garage_id, user_id, rating (1-5), text, language, verified, created_at
  - `review_ratings` — id, review_id, category (eerlijkheid/prijs/snelheid/communicatie/engels), score
  - `garage_replies` — id, review_id, garage_id, text, created_at
  - `subscriptions` — id, garage_id, plan, stripe_subscription_id, status, current_period_end
- [ ] Row Level Security (RLS) policies instellen per tabel
- [ ] Supabase Auth inschakelen (e-mail + wachtwoord)
- [ ] Storage bucket aanmaken voor garage foto's
- [ ] Seed data invoeren: 10–15 Maastricht garages

---

## 3. Design System & UI Componenten

- [x] **Knoppen** — 4 varianten: Primary, Secondary, Ghost, Danger
- [x] **Badges & tags** — KVK geverifieerd, Aanbevolen, Engels gesproken, Premium lid, Nu open, Expat, Service tag, Nieuw
- [x] **Formuliervelden** — states: Default, Hover, Focus, Filled, Error, Disabled
- [x] **Garage card (verticaal)** — voor homepage grid (3 kolommen)
- [x] **Garage card (horizontaal)** — voor zoekresultaten (full-width)
- [x] **Review kaart** — avatar, naam, expat badge, sterren, tekst, garage reactie
- [x] **Navigatie (Navbar)** — desktop + hamburger mobiel, sticky, backdrop blur
- [x] **Footer** — logo, links, copyright

---

## 4. Publieke Pagina's — P0

### 4.1 Homepage (`/`)
- [x] Navigatie: logo links, 3 links midden, Inloggen + Aanmelden rechts
- [x] Hero sectie: eyebrow, H1 (Georgia), subtitel, zoekbalk, 5 filterknoppen
- [x] Trustbar: 4 USP's met groene iconen (verborgen op mobiel < 768px)
- [x] Garage cards: 3 featured cards in grid + "Alle garages" knop
- [x] "Hoe het werkt": 3 stappen met groene genummerde cirkels
- [x] CTA blok: donkergroen, wit tekst, 2 knoppen
- [x] Footer
- [x] Responsive: zoekbalk 2 rijen op mobiel, 1 kolom cards

### 4.2 Zoekresultaten (`/zoeken`)
- [x] Persistente zoekbalk bovenaan met lijst/kaart toggle + sorteren
- [x] Filterbar: resultaattelling, actieve chips met ×, "Wis alles"
- [x] Sidebar filters (sticky, 210px): dienst / taal / rating / afstand / verificatie
- [x] Resultaatkaarten: horizontaal layout, featured = groene left border
- [x] Kaartinhoud: badge, naam, locatie + afstand, tags, openingstijd
- [x] Kaart footer: KVK badge, Bellen knop, Profiel knop
- [x] Paginering: pijlen + nummers
- [x] Responsive: sidebar verborgen → bottom sheet via filterknop op mobiel

### 4.3 Garageprofiel (`/garage/{slug}`)
- [x] Breadcrumb: Home › Stad › Garage naam
- [x] Hero: avatar, badges, naam, locatie, rating, open-status, CTA knoppen
- [x] Foto strip: max 5 foto's, laatste = "+N foto's" knop, horizontaal scrollbaar
- [x] Sticky bar: verschijnt na scrollen voorbij hero (naam + rating + CTA)
- [x] "Over de garage": beschrijvingstekst
- [x] Beoordelingen: totaalcijfer + 5 subcategoriebarren
- [x] Diensten: 3-koloms grid met checkmark-iconen
- [x] Openingstijden: 2-koloms grid, vandaag groen
- [x] Reviews: filter tabs, reviewkaarten, "Meer laden" knop
- [x] Aside (desktop, 280px sticky): contact card, CTA knoppen, kaart, vergelijkbare garages
- [x] Mobiel: tabs (Info / Reviews / Contact) + sticky footer CTA

---

## 5. Auth Pagina's — P0

### 5.1 Inloggen (`/inloggen`)
- [x] E-mail + wachtwoord formulier
- [x] "Wachtwoord vergeten?" link
- [x] Redirect naar `/dashboard` (garage) of `/account/reviews` (gebruiker) na login
- [ ] Supabase Auth koppeling — wacht op Supabase account

### 5.2 Registreren gebruiker (`/registreren`)
- [x] Naam, e-mail, wachtwoord formulier
- [ ] E-mailbevestiging via Supabase — wacht op Supabase account
- [x] Redirect naar `/account/reviews` na registratie

### 5.3 Registreren garage — 4-staps wizard (`/garage/aanmelden`)
- [x] Voortgangsbalk: 4 stappen, hoogte 4px, groen (gedaan) / grijs (nog niet)
- [x] Stap 1 — Account: e-mail + wachtwoord
- [x] Stap 2 — Bedrijfsgegevens: naam, adres, diensten (multi-select chips), talen
- [x] Stap 3 — KVK verificatie: invoerveld + API-check → bevestiging met bedrijfsnaam
- [x] Stap 4 — Profiel afwerken: foto's uploaden, beschrijving, openingstijden
- [x] Sidebar: stap-lijst (groen = gedaan/actief, grijs = pending) + plan preview card
- [x] Na voltooiing: redirect naar `/dashboard` + upgrade-prompt

### 5.4 Wachtwoord reset (`/wachtwoord-reset`) — P1
- [x] E-mailadres invoeren → Supabase reset mail sturen

---

## 6. API Routes — P0

### 6.1 KVK verificatie
- [x] `POST /api/kvk` — KVK-nummer valideren (stub met mock data; echte API klaar zodra KVK_API_KEY beschikbaar)
- [x] Geeft terug: `verified`, `naam`, `kvkNummer`

### 6.2 Stripe abonnement
- [x] `POST /api/stripe/create-checkout` — stub (echte implementatie klaar zodra Stripe geconfigureerd)
- [x] `POST /api/stripe/webhook` — stub voor `checkout.session.completed` en `customer.subscription.deleted`
- [ ] Database updaten na betaling — wacht op Supabase

---

## 7. Garage Dashboard — P0

### 7.1 Dashboard overzicht (`/dashboard`)
- [x] Layout: sidebar 200px links, main content rechts, min-height 100vh
- [x] Sidebar navigatie: actief item groen (#0F6E56), hover lichtgrijs
- [x] Reviews badge in sidebar: rood (#E24B4A) bij onbeantwoorde reviews
- [x] 4 metric cards: profielweergaven, reviews, rating, reacties
- [x] Staafgrafiek: 7 dagen weergaven, vandaag groen
- [x] Compleetheid balk: 5px hoogte, groen fill
- [x] Upgrade card: groene border, groene knop

### 7.2 Profiel beheren (`/dashboard/profiel`)
- [x] Naam, adres, beschrijving, telefoon, e-mail, website bewerken
- [x] Diensten beheren (multi-select chips)
- [x] Openingstijden per dag instellen
- [x] Foto's uploaden/verwijderen (UI gereed, Supabase Storage koppeling volgt)
- [x] Opslaan met validatie

### 7.3 Reviews beheren (`/dashboard/reviews`)
- [x] Lijst van ontvangen reviews
- [x] Per review: reageren (garage reactie met groene left border)
- [x] Onbeantwoorde reviews markeren

### 7.4 Abonnement (`/dashboard/abonnement`) — P1
- [x] Huidige plan tonen (free / premium / business)
- [x] Upgrade knop → Stripe Checkout (stub)
- [x] Annuleren verwerken via webhook (stub)

---

## 8. Gebruikersaccount — P1

### 8.1 Mijn reviews (`/account/reviews`)
- [x] Layout: sidebar 220px links, main content rechts
- [x] Sidebar: avatar (42px, initialen, groen), actief menu item lichtgroen
- [x] 3 stat cards bovenaan: aantal reviews, gemiddeld cijfer, garages bezocht
- [x] Filter tabs (pill-vorm): Alle / Actief / Bewerkt
- [x] Reviewkaarten: garage avatar, naam, sterren, tekst, datum, bewerk/verwijder knoppen
- [x] Geverifieerde badge onderaan review

### 8.2 Mijn profiel (`/account/profiel`) — P1
- [x] Naam en e-mail bewerken
- [x] Wachtwoord wijzigen

### 8.3 Favorieten (`/account/favorieten`) — P2
- [x] Opgeslagen garages tonen als kaartgrid

---

## 9. Review schrijven (modal) — P0

- [x] Trigger: "Review schrijven" knop op garageprofiel
- [x] Auth-check: redirect naar `/inloggen` als niet ingelogd
- [x] Modal: 5-sterrenscore + tekst invoer + taal selector
- [x] Subcategorie scores: eerlijkheid, prijs, snelheid, communicatie, Engelstaligheid
- [x] Versturen → opslaan in `reviews` tabel (mock; Supabase koppeling volgt)
- [ ] Bevestigingsmail naar gebruiker sturen — wacht op Supabase/Resend

---

## 10. Overige Publieke Pagina's

### 10.1 Voor garages (`/voor-garages`) — P1
- [x] Uitleg platform + voordelen voor garages
- [x] Prijsplannen (free / premium / business)
- [x] "Gratis aanmelden" CTA → `/garage/aanmelden`

### 10.2 Over ons (`/over-ons`) — P2
- [x] Verhaal, missie, team

---

## 11. Responsive & Mobiel

- [x] Navbar: hamburger menu + full-screen overlay op mobiel
- [x] Homepage hero zoekbalk: 2 rijen op mobiel (input + knop)
- [x] Trustbar: verborgen op mobiel (< 768px)
- [x] Homepage garage grid: 1 kolom op mobiel, 2 kolommen tablet
- [x] Zoekresultaten sidebar: verborgen → bottom sheet via filterknop
- [x] Garageprofiel aside: verborgen → tabs (Info / Reviews / Contact)
- [x] Garageprofiel: sticky footer CTA op mobiel
- [x] Dashboard sidebar: hamburger toggle + overlay drawer op mobiel
- [x] Account sidebar: verborgen → dropdown bovenaan op mobiel
- [x] Aanmeldformulier sidebar: verborgen op stap 1-3, zichtbaar op stap 4

---

## 12. SEO & Performance

- [x] Meta titles en descriptions per pagina
- [ ] `sitemap.xml` genereren
- [ ] `robots.txt` aanmaken
- [ ] Open Graph tags per pagina
- [ ] Structured data / JSON-LD voor garages (LocalBusiness schema)
- [ ] `next/image` voor alle afbeeldingen met `sizes` attribuut
- [ ] Lazy loading voor foto strips en zware componenten

---

## 13. Deployment

- [ ] Vercel project aanmaken, GitHub koppelen (auto-deploy)
- [ ] Omgevingsvariabelen instellen in Vercel dashboard
- [ ] Domein TrustGarage.nl koppelen + SSL
- [ ] Stripe webhook endpoint registreren in Stripe dashboard
- [ ] Productie smoke test: registreer garage, schrijf review, upgrade abonnement

---

## Later (post-lancering) — P2

- [ ] Kaartweergave zoekresultaten (Google Maps)
- [ ] Reageren op reviews door garage
- [ ] Engelstalige versie van de website
- [ ] E-mailnotificaties voor nieuwe reviews (Resend of Supabase email)
- [ ] Admin dashboard voor moderatie
- [ ] Meer steden toevoegen buiten Maastricht
