-- TrustGarage.nl — Seed data
-- Uitvoeren in: Supabase Dashboard → SQL Editor → New query → Run

-- ============================================
-- GARAGES
-- ============================================

INSERT INTO public.garages (id, name, slug, address, city, kvk_number, kvk_verified, description, phone, email, website, plan) VALUES
(
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Garage Van den Berg',
  'garage-van-den-berg-maastricht',
  'Stationsstraat 12',
  'Maastricht',
  '12345678',
  true,
  'Al meer dan 25 jaar dé betrouwbare garage in Maastricht. Wij zijn gespecialiseerd in alle merken en bieden eerlijke prijzen. Onze monteurs zijn RDW-gecertificeerd en werken nauwkeurig en efficiënt. U kunt bij ons terecht voor APK, onderhoud, reparaties en bandenservice.',
  '043-123 4567',
  'info@garagevandenBerg.nl',
  'https://www.garagevandenBerg.nl',
  'premium'
),
(
  'a1b2c3d4-0002-0002-0002-000000000002',
  'AutoService Janssen',
  'autoservice-janssen-maastricht',
  'Wilhelminasingel 88',
  'Maastricht',
  '23456789',
  true,
  'AutoService Janssen staat voor kwaliteit en transparantie. Wij werken uitsluitend met originele onderdelen en geven altijd een duidelijke prijsopgave vooraf. Perfecte keuze voor Nederlanders én expats — onze monteurs spreken vloeiend Engels.',
  '043-234 5678',
  'info@autoservicejanssen.nl',
  NULL,
  'premium'
),
(
  'a1b2c3d4-0003-0003-0003-000000000003',
  'Peters Autospecialisten',
  'peters-autospecialisten-maastricht',
  'Bosscherweg 45',
  'Maastricht',
  '34567890',
  true,
  'Peters Autospecialisten is uw specialist voor Europese merken. Met meer dan 15 jaar ervaring in Volkswagen, Audi, BMW en Mercedes bieden wij dealerkwaliteit tegen eerlijke prijzen. Wij investeren continu in de nieuwste diagnosetechnieken.',
  '043-345 6789',
  'contact@petersauto.nl',
  'https://www.petersauto.nl',
  'free'
),
(
  'a1b2c3d4-0004-0004-0004-000000000004',
  'Maastricht Autocentrum',
  'maastricht-autocentrum',
  'Scharnerweg 120',
  'Maastricht',
  '45678901',
  false,
  'Maastricht Autocentrum biedt een volledig pakket aan autodiensten onder één dak. Van APK en onderhoud tot schadeherstel en klimaatbeheersing. Kom langs voor een vrijblijvende inspectie.',
  '043-456 7890',
  'info@maastrichtautocentrum.nl',
  NULL,
  'free'
),
(
  'a1b2c3d4-0005-0005-0005-000000000005',
  'Smeets Garage',
  'smeets-garage-maastricht',
  'Tongerseweg 67',
  'Maastricht',
  '56789012',
  true,
  'Familiebedrijf sinds 1978. Smeets Garage combineert jarenlange ervaring met moderne technieken. Wij zijn trots op onze persoonlijke aanpak en vaste klanten die ons al generaties lang vertrouwen.',
  '043-567 8901',
  'smeets@smeetsgarage.nl',
  'https://www.smeetsgarage.nl',
  'premium'
),
(
  'a1b2c3d4-0006-0006-0006-000000000006',
  'Lindelauff Autoschade',
  'lindelauff-autoschade-maastricht',
  'Beatrixhaven 8',
  'Maastricht',
  '67890123',
  true,
  'Specialist in schadeherstel en spuitwerk. Wij werken samen met alle grote verzekeraars en garanderen perfecte kleurmatching. Vervangend vervoer beschikbaar tijdens reparatie.',
  '043-678 9012',
  'info@lindelauff.nl',
  'https://www.lindelauff.nl',
  'free'
),
(
  'a1b2c3d4-0007-0007-0007-000000000007',
  'Garage Hendrix',
  'garage-hendrix-maastricht',
  'Heerderweg 23',
  'Maastricht',
  '78901234',
  false,
  'Kleine garage met grote expertise. Garage Hendrix is ideaal voor snelle reparaties en regulier onderhoud. Geen wachttijden, eerlijke tarieven en altijd een eerlijk advies.',
  '043-789 0123',
  'hendrix.garage@gmail.com',
  NULL,
  'free'
),
(
  'a1b2c3d4-0008-0008-0008-000000000008',
  'Auto Repair Masters',
  'auto-repair-masters-maastricht',
  'Industrieweg 55',
  'Maastricht',
  '89012345',
  true,
  'English-speaking garage serving the international community of Maastricht. We specialize in all makes and models, offering transparent pricing and high-quality repairs. Our team has experience with both European and international vehicles.',
  '043-890 1234',
  'info@autorepairmaster.nl',
  'https://www.autorepairmaster.nl',
  'premium'
);

-- ============================================
-- DIENSTEN PER GARAGE
-- ============================================

INSERT INTO public.garage_services (garage_id, service_name) VALUES
-- Van den Berg
('a1b2c3d4-0001-0001-0001-000000000001', 'APK'),
('a1b2c3d4-0001-0001-0001-000000000001', 'Onderhoud'),
('a1b2c3d4-0001-0001-0001-000000000001', 'Remmen'),
('a1b2c3d4-0001-0001-0001-000000000001', 'Banden'),
('a1b2c3d4-0001-0001-0001-000000000001', 'Uitlaat'),
('a1b2c3d4-0001-0001-0001-000000000001', 'Airco'),
-- AutoService Janssen
('a1b2c3d4-0002-0002-0002-000000000002', 'APK'),
('a1b2c3d4-0002-0002-0002-000000000002', 'Onderhoud'),
('a1b2c3d4-0002-0002-0002-000000000002', 'Diagnose'),
('a1b2c3d4-0002-0002-0002-000000000002', 'Elektrisch'),
('a1b2c3d4-0002-0002-0002-000000000002', 'Banden'),
-- Peters Autospecialisten
('a1b2c3d4-0003-0003-0003-000000000003', 'APK'),
('a1b2c3d4-0003-0003-0003-000000000003', 'Onderhoud'),
('a1b2c3d4-0003-0003-0003-000000000003', 'Diagnose'),
('a1b2c3d4-0003-0003-0003-000000000003', 'Remmen'),
('a1b2c3d4-0003-0003-0003-000000000003', 'Elektrisch'),
-- Maastricht Autocentrum
('a1b2c3d4-0004-0004-0004-000000000004', 'APK'),
('a1b2c3d4-0004-0004-0004-000000000004', 'Onderhoud'),
('a1b2c3d4-0004-0004-0004-000000000004', 'Schadeherstel'),
('a1b2c3d4-0004-0004-0004-000000000004', 'Airco'),
-- Smeets Garage
('a1b2c3d4-0005-0005-0005-000000000005', 'APK'),
('a1b2c3d4-0005-0005-0005-000000000005', 'Onderhoud'),
('a1b2c3d4-0005-0005-0005-000000000005', 'Remmen'),
('a1b2c3d4-0005-0005-0005-000000000005', 'Banden'),
('a1b2c3d4-0005-0005-0005-000000000005', 'Uitlaat'),
('a1b2c3d4-0005-0005-0005-000000000005', 'Diagnose'),
('a1b2c3d4-0005-0005-0005-000000000005', 'Elektrisch'),
-- Lindelauff
('a1b2c3d4-0006-0006-0006-000000000006', 'Schadeherstel'),
('a1b2c3d4-0006-0006-0006-000000000006', 'Spuitwerk'),
('a1b2c3d4-0006-0006-0006-000000000006', 'Onderhoud'),
-- Garage Hendrix
('a1b2c3d4-0007-0007-0007-000000000007', 'APK'),
('a1b2c3d4-0007-0007-0007-000000000007', 'Onderhoud'),
('a1b2c3d4-0007-0007-0007-000000000007', 'Remmen'),
('a1b2c3d4-0007-0007-0007-000000000007', 'Banden'),
-- Auto Repair Masters
('a1b2c3d4-0008-0008-0008-000000000008', 'APK'),
('a1b2c3d4-0008-0008-0008-000000000008', 'Onderhoud'),
('a1b2c3d4-0008-0008-0008-000000000008', 'Diagnose'),
('a1b2c3d4-0008-0008-0008-000000000008', 'Elektrisch'),
('a1b2c3d4-0008-0008-0008-000000000008', 'Remmen'),
('a1b2c3d4-0008-0008-0008-000000000008', 'Banden'),
('a1b2c3d4-0008-0008-0008-000000000008', 'Airco');

-- ============================================
-- TALEN PER GARAGE
-- ============================================

INSERT INTO public.garage_languages (garage_id, language) VALUES
('a1b2c3d4-0001-0001-0001-000000000001', 'Nederlands'),
('a1b2c3d4-0002-0002-0002-000000000002', 'Nederlands'),
('a1b2c3d4-0002-0002-0002-000000000002', 'Engels'),
('a1b2c3d4-0003-0003-0003-000000000003', 'Nederlands'),
('a1b2c3d4-0004-0004-0004-000000000004', 'Nederlands'),
('a1b2c3d4-0005-0005-0005-000000000005', 'Nederlands'),
('a1b2c3d4-0005-0005-0005-000000000005', 'Duits'),
('a1b2c3d4-0006-0006-0006-000000000006', 'Nederlands'),
('a1b2c3d4-0007-0007-0007-000000000007', 'Nederlands'),
('a1b2c3d4-0008-0008-0008-000000000008', 'Nederlands'),
('a1b2c3d4-0008-0008-0008-000000000008', 'Engels'),
('a1b2c3d4-0008-0008-0008-000000000008', 'Duits');

-- ============================================
-- OPENINGSTIJDEN (0=Ma, 1=Di, 2=Wo, 3=Do, 4=Vr, 5=Za, 6=Zo)
-- ============================================

INSERT INTO public.garage_hours (garage_id, day_of_week, open_time, close_time, is_closed) VALUES
-- Van den Berg (ma-vr 08-17:30, za 09-13, zo dicht)
('a1b2c3d4-0001-0001-0001-000000000001', 0, '08:00', '17:30', false),
('a1b2c3d4-0001-0001-0001-000000000001', 1, '08:00', '17:30', false),
('a1b2c3d4-0001-0001-0001-000000000001', 2, '08:00', '17:30', false),
('a1b2c3d4-0001-0001-0001-000000000001', 3, '08:00', '17:30', false),
('a1b2c3d4-0001-0001-0001-000000000001', 4, '08:00', '17:30', false),
('a1b2c3d4-0001-0001-0001-000000000001', 5, '09:00', '13:00', false),
('a1b2c3d4-0001-0001-0001-000000000001', 6, NULL, NULL, true),
-- AutoService Janssen (ma-vr 07:30-18, za 08-14, zo dicht)
('a1b2c3d4-0002-0002-0002-000000000002', 0, '07:30', '18:00', false),
('a1b2c3d4-0002-0002-0002-000000000002', 1, '07:30', '18:00', false),
('a1b2c3d4-0002-0002-0002-000000000002', 2, '07:30', '18:00', false),
('a1b2c3d4-0002-0002-0002-000000000002', 3, '07:30', '18:00', false),
('a1b2c3d4-0002-0002-0002-000000000002', 4, '07:30', '18:00', false),
('a1b2c3d4-0002-0002-0002-000000000002', 5, '08:00', '14:00', false),
('a1b2c3d4-0002-0002-0002-000000000002', 6, NULL, NULL, true),
-- Peters (ma-vr 08-17, za+zo dicht)
('a1b2c3d4-0003-0003-0003-000000000003', 0, '08:00', '17:00', false),
('a1b2c3d4-0003-0003-0003-000000000003', 1, '08:00', '17:00', false),
('a1b2c3d4-0003-0003-0003-000000000003', 2, '08:00', '17:00', false),
('a1b2c3d4-0003-0003-0003-000000000003', 3, '08:00', '17:00', false),
('a1b2c3d4-0003-0003-0003-000000000003', 4, '08:00', '17:00', false),
('a1b2c3d4-0003-0003-0003-000000000003', 5, NULL, NULL, true),
('a1b2c3d4-0003-0003-0003-000000000003', 6, NULL, NULL, true),
-- Maastricht Autocentrum (ma-za 08-17:30, zo dicht)
('a1b2c3d4-0004-0004-0004-000000000004', 0, '08:00', '17:30', false),
('a1b2c3d4-0004-0004-0004-000000000004', 1, '08:00', '17:30', false),
('a1b2c3d4-0004-0004-0004-000000000004', 2, '08:00', '17:30', false),
('a1b2c3d4-0004-0004-0004-000000000004', 3, '08:00', '17:30', false),
('a1b2c3d4-0004-0004-0004-000000000004', 4, '08:00', '17:30', false),
('a1b2c3d4-0004-0004-0004-000000000004', 5, '08:00', '17:30', false),
('a1b2c3d4-0004-0004-0004-000000000004', 6, NULL, NULL, true),
-- Smeets (ma-vr 08-17, za 09-12, zo dicht)
('a1b2c3d4-0005-0005-0005-000000000005', 0, '08:00', '17:00', false),
('a1b2c3d4-0005-0005-0005-000000000005', 1, '08:00', '17:00', false),
('a1b2c3d4-0005-0005-0005-000000000005', 2, '08:00', '17:00', false),
('a1b2c3d4-0005-0005-0005-000000000005', 3, '08:00', '17:00', false),
('a1b2c3d4-0005-0005-0005-000000000005', 4, '08:00', '17:00', false),
('a1b2c3d4-0005-0005-0005-000000000005', 5, '09:00', '12:00', false),
('a1b2c3d4-0005-0005-0005-000000000005', 6, NULL, NULL, true),
-- Lindelauff (ma-vr 08-17, za+zo dicht)
('a1b2c3d4-0006-0006-0006-000000000006', 0, '08:00', '17:00', false),
('a1b2c3d4-0006-0006-0006-000000000006', 1, '08:00', '17:00', false),
('a1b2c3d4-0006-0006-0006-000000000006', 2, '08:00', '17:00', false),
('a1b2c3d4-0006-0006-0006-000000000006', 3, '08:00', '17:00', false),
('a1b2c3d4-0006-0006-0006-000000000006', 4, '08:00', '17:00', false),
('a1b2c3d4-0006-0006-0006-000000000006', 5, NULL, NULL, true),
('a1b2c3d4-0006-0006-0006-000000000006', 6, NULL, NULL, true),
-- Garage Hendrix (ma-vr 08:30-17, za 09-13, zo dicht)
('a1b2c3d4-0007-0007-0007-000000000007', 0, '08:30', '17:00', false),
('a1b2c3d4-0007-0007-0007-000000000007', 1, '08:30', '17:00', false),
('a1b2c3d4-0007-0007-0007-000000000007', 2, '08:30', '17:00', false),
('a1b2c3d4-0007-0007-0007-000000000007', 3, '08:30', '17:00', false),
('a1b2c3d4-0007-0007-0007-000000000007', 4, '08:30', '17:00', false),
('a1b2c3d4-0007-0007-0007-000000000007', 5, '09:00', '13:00', false),
('a1b2c3d4-0007-0007-0007-000000000007', 6, NULL, NULL, true),
-- Auto Repair Masters (ma-vr 08-18, za 09-14, zo dicht)
('a1b2c3d4-0008-0008-0008-000000000008', 0, '08:00', '18:00', false),
('a1b2c3d4-0008-0008-0008-000000000008', 1, '08:00', '18:00', false),
('a1b2c3d4-0008-0008-0008-000000000008', 2, '08:00', '18:00', false),
('a1b2c3d4-0008-0008-0008-000000000008', 3, '08:00', '18:00', false),
('a1b2c3d4-0008-0008-0008-000000000008', 4, '08:00', '18:00', false),
('a1b2c3d4-0008-0008-0008-000000000008', 5, '09:00', '14:00', false),
('a1b2c3d4-0008-0008-0008-000000000008', 6, NULL, NULL, true);
