-- ============================================================
-- GolfForGood Database Schema
-- Run this ONCE in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. USERS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name     TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'subscriber' CHECK (role IN ('subscriber','admin')),
  avatar_url    TEXT,
  is_suspended  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

-- ── 2. SUBSCRIPTION PLANS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscription_plans (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  plan_type     TEXT NOT NULL CHECK (plan_type IN ('monthly','yearly')),
  price_amount  NUMERIC(10,2) NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'GBP',
  duration_days INTEGER NOT NULL,
  features      TEXT[] DEFAULT '{}',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3. SUBSCRIPTIONS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id      UUID NOT NULL REFERENCES subscription_plans(id),
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','cancelled')),
  start_date   DATE NOT NULL,
  end_date     DATE NOT NULL,
  renewal_date DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 4. CHARITIES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS charities (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  description  TEXT NOT NULL,
  short_bio    TEXT,
  image_url    TEXT,
  website_url  TEXT,
  category     TEXT NOT NULL DEFAULT 'other' CHECK (category IN ('education','health','environment','community','sports','other')),
  is_featured  BOOLEAN NOT NULL DEFAULT false,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  total_raised NUMERIC(12,2) NOT NULL DEFAULT 0,
  donor_count  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 5. USER CHARITY SELECTIONS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_charity_selections (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  charity_id       UUID NOT NULL REFERENCES charities(id),
  contribution_pct INTEGER NOT NULL DEFAULT 10 CHECK (contribution_pct BETWEEN 10 AND 100),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 6. USER SCORES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_scores (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score_value INTEGER NOT NULL CHECK (score_value BETWEEN 1 AND 45),
  score_date  DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, score_date)
);

-- ── 7. DRAWS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS draws (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_month       DATE NOT NULL UNIQUE,
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','simulated','published')),
  winning_numbers  INTEGER[],
  total_revenue    NUMERIC(12,2) NOT NULL DEFAULT 0,
  jackpot_rollover NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_by       UUID REFERENCES users(id),
  simulated_at     TIMESTAMPTZ,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 8. PRIZE POOLS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prize_pools (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id           UUID NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
  match_level       TEXT NOT NULL CHECK (match_level IN ('three_match','four_match','five_match')),
  allocation_pct    INTEGER NOT NULL,
  pool_amount       NUMERIC(12,2) NOT NULL DEFAULT 0,
  winner_count      INTEGER NOT NULL DEFAULT 0,
  per_winner_amount NUMERIC(12,2),
  rolled_over       BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (draw_id, match_level)
);

-- ── 9. DRAW ENTRIES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS draw_entries (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id        UUID NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_numbers  INTEGER[] NOT NULL,
  match_level    TEXT CHECK (match_level IN ('three_match','four_match','five_match')),
  match_count    INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (draw_id, user_id)
);

-- ── 10. WINNER CLAIMS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS winner_claims (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id        UUID NOT NULL REFERENCES draws(id),
  user_id        UUID NOT NULL REFERENCES users(id),
  draw_entry_id  UUID REFERENCES draw_entries(id),
  match_level    TEXT NOT NULL CHECK (match_level IN ('three_match','four_match','five_match')),
  prize_amount   NUMERIC(12,2) NOT NULL,
  proof_url      TEXT,
  claim_status   TEXT NOT NULL DEFAULT 'pending' CHECK (claim_status IN ('pending','approved','rejected')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid')),
  admin_notes    TEXT,
  reviewed_at    TIMESTAMPTZ,
  paid_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (draw_id, user_id, match_level)
);

-- ── 11. DONATIONS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  charity_id      UUID NOT NULL REFERENCES charities(id) ON DELETE CASCADE,
  donation_amount NUMERIC(12,2) NOT NULL CHECK (donation_amount >= 1.00),
  donation_type   TEXT NOT NULL DEFAULT 'one_time',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_charity_id ON donations(charity_id);

-- ── SEED: Subscription Plans ──────────────────────────────────────
INSERT INTO subscription_plans (name, plan_type, price_amount, currency, duration_days, features)
VALUES
  ('Monthly', 'monthly', 9.99, 'GBP', 30,
   ARRAY['Golf score tracking','Monthly draw entry','Charity contribution','Winner dashboard']),
  ('Yearly', 'yearly', 99.99, 'GBP', 365,
   ARRAY['All monthly features','12 months access','Priority draw entry','Yearly impact report','Early winner alerts'])
ON CONFLICT DO NOTHING;

-- ── SEED: Charities ───────────────────────────────────────────────
INSERT INTO charities (name, description, short_bio, website_url, category, is_featured, total_raised, donor_count)
VALUES
  ('Green Earth Foundation','Dedicated to environmental conservation and sustainability. We plant trees, protect wildlife habitats, and promote clean energy solutions across the UK.','Protecting our planet, one tree at a time.','https://greenearthfoundation.org','environment',true,48250.00,1245),
  ('Education For All','Providing educational resources, scholarships, and mentoring to underprivileged children across the UK. Every child deserves a quality education.','Education changes everything.','https://educationforall.org','education',false,32100.00,876),
  ('Hearts & Health','Supporting cardiac research, patient care programs, and health awareness campaigns. Together we can reduce heart disease in the UK.','Every heartbeat matters.','https://heartsandhealth.org','health',false,21750.00,654),
  ('Community First','Building stronger communities through local programs, food banks, elderly support, and neighbourhood regeneration projects.','Stronger together.','https://communityfirst.org','community',false,15800.00,423),
  ('Youth Sports Trust','Getting young people active through grassroots sports programs, free equipment drives, and mentoring by professional athletes.','Sport for every child.','https://youthsportstrust.org','sports',false,9400.00,287)
ON CONFLICT DO NOTHING;

-- ── SEED: Admin User (password: Admin@GolfForGood2026) ───────────
-- bcrypt hash of "Admin@GolfForGood2026"
INSERT INTO users (full_name, email, password_hash, role)
VALUES (
  'Admin User',
  'admin@golfforgood.com',
  '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- ── Indexes for performance ────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email           ON users(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user    ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_scores_user           ON user_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_draws_status          ON draws(status);
CREATE INDEX IF NOT EXISTS idx_winner_claims_user    ON winner_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_winner_claims_status  ON winner_claims(claim_status);

-- ============================================================
-- SUPABASE STORAGE — Winner Proof Upload
-- ============================================================
-- The winner_claims.proof_url column (defined above) stores the
-- public URL of the uploaded image.  The actual binary file is
-- stored in Supabase Storage under the bucket "winner-proofs".
--
-- DATABASE CHANGES REQUIRED: NONE
--   winner_claims.proof_url TEXT already exists and is reused.
--   No new columns or tables are needed.
--
-- INFRASTRUCTURE SETUP REQUIRED (run once in Supabase dashboard):
-- ============================================================

-- ── Step 1: Create the storage bucket ────────────────────────────
-- Run this in Supabase Dashboard → Storage → New Bucket
-- OR via the Management API / CLI.
--
-- Bucket name  : winner-proofs
-- Public       : true   (so generated URLs are directly accessible
--                        in the browser without signed tokens)
-- File size limit : 5242880 bytes (5 MB)
-- Allowed MIME types: image/jpeg, image/png, image/webp
--
-- Supabase CLI equivalent:
--   supabase storage create winner-proofs --public
--
-- NOTE: The backend uses the Service Role key which bypasses RLS
-- for all write operations. The policies below govern direct
-- browser/client access to storage objects.

-- ── Step 2: Storage RLS Policies ─────────────────────────────────
-- Paste these into Supabase Dashboard → Storage → winner-proofs
-- → Policies → New Policy → "For full customization"
--
-- Policy 1 — Authenticated users can upload their own proof files.
-- This ensures a logged-in user can only write to a path prefixed
-- with their own user_id, preventing users from overwriting each
-- other's proof images.
--
-- CREATE POLICY "Users can upload their own proof"
-- ON storage.objects
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'winner-proofs'
--   AND (storage.foldername(name))[1] = auth.uid()::text
-- );
--
-- Policy 2 — Public read access so proof images can be displayed
-- in the browser (admin dashboard thumbnail, user's winnings page).
-- Without this, the stored URLs return 403 to unauthenticated GET
-- requests, breaking image previews.
--
-- CREATE POLICY "Anyone can view proof images"
-- ON storage.objects
-- FOR SELECT
-- TO public
-- USING (bucket_id = 'winner-proofs');
--
-- Policy 3 — Users can replace (update) their own proof if they need
-- to re-upload.  Scoped to their own folder so they cannot overwrite
-- other users' files.
--
-- CREATE POLICY "Users can update their own proof"
-- ON storage.objects
-- FOR UPDATE
-- TO authenticated
-- USING (
--   bucket_id = 'winner-proofs'
--   AND (storage.foldername(name))[1] = auth.uid()::text
-- )
-- WITH CHECK (
--   bucket_id = 'winner-proofs'
--   AND (storage.foldername(name))[1] = auth.uid()::text
-- );
--
-- Policy 4 — Admins can delete proof objects (e.g., when a claim is
-- rejected and the file must be purged for compliance).
-- The backend's Service Role key already bypasses this for server-
-- side deletions, but this policy allows admin users operating
-- directly through the Supabase dashboard.
--
-- CREATE POLICY "Admins can delete any proof"
-- ON storage.objects
-- FOR DELETE
-- TO authenticated
-- USING (
--   bucket_id = 'winner-proofs'
--   AND EXISTS (
--     SELECT 1 FROM public.users
--     WHERE id = auth.uid()
--     AND role = 'admin'
--   )
-- );

-- ── Step 3: Storage path convention ──────────────────────────────
-- All files are uploaded by the backend using the path pattern:
--
--   winner-proofs/<user_id>/<claim_id>/<timestamp>.<ext>
--
-- Example:
--   winner-proofs/a1111111-1111-1111-1111-111111111111/
--                 e1111111-1111-1111-1111-111111111111/
--                 1719000000000.jpg
--
-- This path structure:
--   • Scopes per-user uploads so Policy 1 & 3 work correctly.
--   • Scopes per-claim so a user with multiple claims keeps files
--     separated and a re-upload for claim B never touches claim A.
--   • Uses a timestamp suffix to prevent browser caching of a
--     previously rejected proof image.

-- ── Summary ───────────────────────────────────────────────────────
-- Table changes  : 0  (proof_url TEXT already present in schema)
-- New columns    : 0
-- New tables     : 0
-- Storage bucket : winner-proofs  (create manually — see Step 1)
-- RLS policies   : 4  (see Step 2 — paste into Supabase dashboard)
-- ============================================================
