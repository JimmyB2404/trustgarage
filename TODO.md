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
- [x] Design tokens toevoegen aan `tailwind.config.js`:
  - Kleuren: primary (`#0F6E56`), neutral, surface, amber, danger, info
  - Fonts: Georgia (serif), system-ui (sans), Courier New (mono)
  - Border radius: sm (4px), md (7px), lg (10px), xl (20px)
  - Max-width: site (1280px)
- [x] Tabler Icons installeren (`@tabler/icons-react`)
- [x] Supabase client instellen (`@supabase/supabase-js`) + credentials in `.env.local`
- [x] Stripe SDK installeren
- [x] `.env.local` aanmaken met variabelen
- [x] Mappenstructuur aanmaken (`app/`, `components/`, `lib/`, `types/`)
- [x] GitHub repository aanmaken en koppelen aan Vercel

---

## 2. Database (Supabase)

- [x] Alle tabellen aanmaken via `supabase/migration.sql`:
  - `profiles`, `garages`, `garage_services`, `garage_languages`
  - `garage_hours`, `garage_photos`, `reviews`, `review_ratings`
  - `garage_replies`, `subscriptions`
- [x] Row Level Security (RLS) policies instellen per tabel
- [x] Supabase Auth inschakelen (e-mail + wachtwoord)
- [x] Storage bucket aanmaken voor garage foto's (`garage-photos`)
- [ ] Seed data invoeren: 10–15 Maastricht garages (nu nog mock data)

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
- [x] Supabase Auth gekoppeld — echte login actief
- [x] Rol-gebaseerde redirect: garage-eigenaar → `/dashboard`, gebruiker → `/account/reviews`

### 5.2 Registreren gebruiker (`/registreren`)
- [x] Naam, e-mail, wachtwoord formulier
- [x] Supabase Auth gekoppeld — registratie actief
- [x] E-mailbevestiging via Supabase

### 5.3 Registreren garage — 4-staps wizard (`/garage/aanmelden`)
- [x] Voortgangsbalk: 4 stappen
- [x] Stap 1 — Account: e-mail + wachtwoord
- [x] Stap 2 — Bedrijfsgegevens: naam, adres, diensten, talen
- [x] Stap 3 — KVK verificatie: invoerveld + API-check (mock)
- [x] Stap 4 — Profiel afwerken: foto's, beschrijving, openingstijden
- [ ] **Supabase Auth koppelen — garage aanmelding nog niet actief**

### 5.4 Wachtwoord reset (`/wachtwoord-reset`)
- [x] E-mailadres invoeren formulier
- [x] Supabase gekoppeld — reset mail actief

---

## 6. API Routes — P0

### 6.1 KVK verificatie
- [x] `POST /api/kvk` — stub met mock data
- [ ] Echte KVK API activeren zodra `KVK_API_KEY` beschikbaar is

### 6.2 Stripe abonnement
- [x] `POST /api/stripe/create-checkout` — stub
- [x] `POST /api/stripe/webhook` — stub
- [ ] **Stripe activeren zodra account beschikbaar is**
- [ ] Database updaten na betaling (Supabase koppeling)

---

## 7. Garage Dashboard — P0

### 7.1 Dashboard overzicht (`/dashboard`)
- [x] Layout: sidebar + main content, responsive
- [x] 4 metric cards, staafgrafiek, compleetheid balk, upgrade card (UI gereed, mock data)
- [x] Afgeschermd voor niet-ingelogde gebruikers (middleware)
- [ ] Echte data ophalen uit Supabase

### 7.2 Profiel beheren (`/dashboard/profiel`)
- [x] Alle formuliervelden (UI gereed, mock data)
- [ ] **Opslaan naar Supabase (koppeling volgt)**

### 7.3 Reviews beheren (`/dashboard/reviews`)
- [x] Reviewlijst + reageren (UI gereed, mock data)
- [ ] **Echte reviews ophalen + reacties opslaan in Supabase**

### 7.4 Abonnement (`/dashboard/abonnement`)
- [x] Plan tonen + upgrade knop (UI gereed, stub)
- [ ] **Stripe koppelen**

---

## 8. Gebruikersaccount — P1

- [x] Mijn reviews (`/account/reviews`) — UI gereed, mock data
- [x] Mijn profiel (`/account/profiel`) — UI gereed
- [x] Favorieten (`/account/favorieten`) — UI gereed
- [ ] **Supabase Auth + data koppelen voor alle accountpagina's**

---

## 9. Review schrijven (modal) — P0

- [x] Modal UI: sterren, tekst, taal, subcategoriescores (gereed)
- [ ] **Opslaan in Supabase reviews tabel**
- [ ] Bevestigingsmail naar gebruiker sturen

---

## 10. Overige Publieke Pagina's

- [x] Voor garages (`/voor-garages`) — uitleg, prijsplannen, CTA
- [x] Over ons (`/over-ons`) — verhaal, missie, team

---

## 11. Responsive & Mobiel

- [x] Navbar hamburger menu
- [x] Homepage hero zoekbalk mobiel
- [x] Trustbar verborgen op mobiel
- [x] Garage grid responsive
- [x] Zoekresultaten sidebar → bottom sheet
- [x] Garageprofiel aside → tabs
- [x] Dashboard sidebar → overlay drawer
- [x] Account sidebar → dropdown

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

- [x] Vercel project aanmaakt + GitHub gekoppeld (auto-deploy actief)
- [x] Domeinen toegevoegd in Vercel: trustgarage.nl + trustgarage.be
- [x] DNS ingesteld in TransIP voor .nl en .be
- [x] trustgarage.be live + redirect naar trustgarage.nl
- [ ] trustgarage.nl live (DNS propagatie nog bezig)
- [ ] Omgevingsvariabelen instellen in Vercel dashboard (Supabase URL/key, Stripe keys)
- [ ] Stripe webhook endpoint registreren in Stripe dashboard
- [ ] Smoke test: registreer garage → schrijf review → upgrade abonnement

---

## Prioriteiten voor volgende sessie

1. **Garage aanmelden koppelen aan Supabase** — wizard slaat garage op in database
2. **Seed data invoeren** — 10–15 Maastricht garages in Supabase
3. **Stripe activeren** — zodra Stripe account beschikbaar is
4. **SEO** — sitemap.xml, robots.txt, Open Graph

---

## Later (post-lancering) — P2

- [ ] Google Analytics 4 integreren (bezoekers, populaire pagina's, conversies)
- [ ] Kaartweergave zoekresultaten (Google Maps)
- [ ] Engelstalige versie van de website
- [ ] E-mailnotificaties voor nieuwe reviews (Resend of Supabase email)
- [ ] Admin dashboard voor moderatie
- [ ] Meer steden toevoegen buiten Maastricht
