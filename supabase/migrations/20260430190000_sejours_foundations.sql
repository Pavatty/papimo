-- LODGE Phase 8.1 — Séjours (Airbnb) — Foundations
-- Tables : bookings, availability_calendars, pricing_rules, reviews, verification_documents, booking_payments
-- Colonnes listings : rental_type + colonnes Séjours (instant_booking, min/max_nights, etc.)

-- =========================================================================
-- listings : rental_type (annual | short_term) + colonnes Séjours
-- =========================================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='rental_type') THEN
    ALTER TABLE public.listings ADD COLUMN rental_type TEXT CHECK (rental_type IN ('annual', 'short_term'));
  END IF;
END $$;

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS instant_booking BOOLEAN DEFAULT FALSE;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS min_nights INT DEFAULT 1;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS max_nights INT DEFAULT 365;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS check_in_time TEXT DEFAULT '15:00';
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS check_out_time TEXT DEFAULT '11:00';
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS house_rules TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS cancellation_policy TEXT CHECK (cancellation_policy IN ('flexible', 'moderate', 'strict')) DEFAULT 'moderate';
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS base_price_per_night DECIMAL(10,2);
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS max_guests INT DEFAULT 2;

-- =========================================================================
-- bookings : réservations Séjours
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  num_guests INT NOT NULL CHECK (num_guests > 0),
  status TEXT NOT NULL CHECK (status IN ('pending_payment', 'confirmed', 'cancelled_by_guest', 'cancelled_by_host', 'completed')) DEFAULT 'pending_payment',
  base_price DECIMAL(10,2) NOT NULL,
  service_fee DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TND',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  payment_intent_id TEXT,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT bookings_no_overlap_dates CHECK (check_out_date > check_in_date)
);

CREATE INDEX IF NOT EXISTS bookings_listing_idx ON public.bookings(listing_id);
CREATE INDEX IF NOT EXISTS bookings_guest_idx ON public.bookings(guest_id);
CREATE INDEX IF NOT EXISTS bookings_host_idx ON public.bookings(host_id);
CREATE INDEX IF NOT EXISTS bookings_dates_idx ON public.bookings(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON public.bookings(status);

-- =========================================================================
-- availability_calendars : disponibilités jour par jour
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.availability_calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  price_override DECIMAL(10,2),
  min_nights_override INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(listing_id, date)
);

CREATE INDEX IF NOT EXISTS availability_calendars_listing_date_idx ON public.availability_calendars(listing_id, date);

-- =========================================================================
-- pricing_rules : weekend / saison / discount durée
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('weekend', 'seasonal', 'length_discount')),
  start_date DATE,
  end_date DATE,
  discount_percent DECIMAL(5,2),
  price_increase_percent DECIMAL(5,2),
  min_nights INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pricing_rules_listing_idx ON public.pricing_rules(listing_id);

-- =========================================================================
-- reviews : avis bidirectionnels post-séjour
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  review_type TEXT NOT NULL CHECK (review_type IN ('guest_to_host', 'host_to_guest')),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  cleanliness_rating INT CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  communication_rating INT CHECK (communication_rating >= 1 AND communication_rating <= 5),
  accuracy_rating INT CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
  location_rating INT CHECK (location_rating >= 1 AND location_rating <= 5),
  value_rating INT CHECK (value_rating >= 1 AND value_rating <= 5),
  comment TEXT,
  private_feedback TEXT,
  response TEXT,
  response_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(booking_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS reviews_listing_idx ON public.reviews(listing_id);
CREATE INDEX IF NOT EXISTS reviews_reviewee_idx ON public.reviews(reviewee_id);

-- =========================================================================
-- verification_documents : KYC light
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('passport', 'id_card', 'drivers_license', 'selfie')),
  document_url TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS verification_documents_user_idx ON public.verification_documents(user_id);

-- profiles.is_verified : badge "Vérifié"
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- =========================================================================
-- booking_payments : trace des paiements (Konnect, Stripe, virement)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.booking_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TND',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('konnect', 'stripe', 'bank_transfer')),
  payment_intent_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')) DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS booking_payments_booking_idx ON public.booking_payments(booking_id);

-- =========================================================================
-- RLS
-- =========================================================================
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bookings_view_own" ON public.bookings;
CREATE POLICY "bookings_view_own" ON public.bookings FOR SELECT
  USING (auth.uid() = guest_id OR auth.uid() = host_id);

DROP POLICY IF EXISTS "bookings_create_self" ON public.bookings;
CREATE POLICY "bookings_create_self" ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = guest_id);

DROP POLICY IF EXISTS "bookings_update_party" ON public.bookings;
CREATE POLICY "bookings_update_party" ON public.bookings FOR UPDATE
  USING (auth.uid() = host_id OR auth.uid() = guest_id);

DROP POLICY IF EXISTS "availability_public_read" ON public.availability_calendars;
CREATE POLICY "availability_public_read" ON public.availability_calendars FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "availability_host_manage" ON public.availability_calendars;
CREATE POLICY "availability_host_manage" ON public.availability_calendars FOR ALL
  USING (EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND owner_id = auth.uid()));

DROP POLICY IF EXISTS "pricing_public_read" ON public.pricing_rules;
CREATE POLICY "pricing_public_read" ON public.pricing_rules FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "pricing_host_manage" ON public.pricing_rules;
CREATE POLICY "pricing_host_manage" ON public.pricing_rules FOR ALL
  USING (EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND owner_id = auth.uid()));

DROP POLICY IF EXISTS "reviews_public_read" ON public.reviews;
CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "reviews_create_self" ON public.reviews;
CREATE POLICY "reviews_create_self" ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "reviews_response_reviewee" ON public.reviews;
CREATE POLICY "reviews_response_reviewee" ON public.reviews FOR UPDATE
  USING (auth.uid() = reviewee_id);

DROP POLICY IF EXISTS "verification_view_self_or_admin" ON public.verification_documents;
CREATE POLICY "verification_view_self_or_admin" ON public.verification_documents FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "verification_upload_self" ON public.verification_documents;
CREATE POLICY "verification_upload_self" ON public.verification_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "verification_update_admin" ON public.verification_documents;
CREATE POLICY "verification_update_admin" ON public.verification_documents FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "booking_payments_view_party" ON public.booking_payments;
CREATE POLICY "booking_payments_view_party" ON public.booking_payments FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND (guest_id = auth.uid() OR host_id = auth.uid())));

-- =========================================================================
-- Grants
-- =========================================================================
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT SELECT ON public.availability_calendars TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.availability_calendars TO authenticated;
GRANT SELECT ON public.pricing_rules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pricing_rules TO authenticated;
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE ON public.reviews TO authenticated;
GRANT SELECT, INSERT ON public.verification_documents TO authenticated;
GRANT SELECT ON public.booking_payments TO authenticated;

-- =========================================================================
-- Feature flags + app_settings (commission)
-- =========================================================================
INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('sejours_enabled', true, 'Active la partie Séjours (Airbnb-like).'),
  ('instant_booking_enabled', true, 'Réservation instantanée sans validation host.'),
  ('reviews_enabled', true, 'Avis bidirectionnels post-séjour.'),
  ('verification_required', false, 'Vérification identité obligatoire pour réserver.')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.app_settings (key, value, description) VALUES
  ('sejours_commission_percent', '10'::jsonb, 'Commission LODGE sur réservations Séjours (%).'),
  ('sejours_host_fee_percent', '5'::jsonb, 'Frais host (% du prix de base).'),
  ('sejours_guest_fee_percent', '5'::jsonb, 'Frais guest (% du prix de base).')
ON CONFLICT (key) DO NOTHING;
