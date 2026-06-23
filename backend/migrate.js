/**
 * GolfForGood — Supabase SQL Migration Runner
 * Uses the Supabase Management API to execute the schema SQL.
 */
const https = require('https');
require('dotenv').config();

const SUPABASE_URL     = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

// ── SQL Schema ──────────────────────────────────────────────────────
const SQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS
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

-- 2. SUBSCRIPTION PLANS
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

-- 3. SUBSCRIPTIONS
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

-- 4. CHARITIES
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

-- 5. USER CHARITY SELECTIONS
CREATE TABLE IF NOT EXISTS user_charity_selections (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  charity_id       UUID NOT NULL REFERENCES charities(id),
  contribution_pct INTEGER NOT NULL DEFAULT 10 CHECK (contribution_pct BETWEEN 10 AND 100),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. USER SCORES
CREATE TABLE IF NOT EXISTS user_scores (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score_value INTEGER NOT NULL CHECK (score_value BETWEEN 1 AND 45),
  score_date  DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, score_date)
);

-- 7. DRAWS
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

-- 8. PRIZE POOLS
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

-- 9. DRAW ENTRIES
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

-- 10. WINNER CLAIMS
CREATE TABLE IF NOT EXISTS winner_claims (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id      UUID NOT NULL REFERENCES draws(id),
  user_id      UUID NOT NULL REFERENCES users(id),
  draw_entry_id UUID REFERENCES draw_entries(id),
  match_level  TEXT NOT NULL CHECK (match_level IN ('three_match','four_match','five_match')),
  prize_amount NUMERIC(12,2) NOT NULL,
  proof_url    TEXT,
  claim_status TEXT NOT NULL DEFAULT 'pending' CHECK (claim_status IN ('pending','approved','rejected')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid')),
  admin_notes  TEXT,
  reviewed_at  TIMESTAMPTZ,
  paid_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (draw_id, user_id, match_level)
);

-- ── Seed: Subscription Plans ──────────────────────────────────────
INSERT INTO subscription_plans (name, plan_type, price_amount, currency, duration_days, features)
VALUES
  ('Monthly', 'monthly', 9.99, 'GBP', 30,
   ARRAY['Golf score tracking', 'Monthly draw entry', 'Charity contribution', 'Winner dashboard']),
  ('Yearly', 'yearly', 99.99, 'GBP', 365,
   ARRAY['All monthly features', '12 months access', 'Priority draw entry', 'Yearly impact report', 'Early winner alerts'])
ON CONFLICT DO NOTHING;

-- ── Seed: Charities ───────────────────────────────────────────────
INSERT INTO charities (name, description, short_bio, website_url, category, is_featured, total_raised, donor_count)
VALUES
  ('Green Earth Foundation', 'Dedicated to environmental conservation and sustainability. We plant trees, protect wildlife habitats, and promote clean energy solutions across the UK.', 'Protecting our planet, one tree at a time.', 'https://greenearthfoundation.org', 'environment', true, 48250.00, 1245),
  ('Education For All', 'Providing educational resources, scholarships, and mentoring to underprivileged children across the UK. Every child deserves a quality education.', 'Education changes everything.', 'https://educationforall.org', 'education', false, 32100.00, 876),
  ('Hearts & Health', 'Supporting cardiac research, patient care programs, and health awareness campaigns. Together we can reduce heart disease in the UK.', 'Every heartbeat matters.', 'https://heartsandhealth.org', 'health', false, 21750.00, 654),
  ('Community First', 'Building stronger communities through local programs, food banks, elderly support, and neighbourhood regeneration projects.', 'Stronger together.', 'https://communityfirst.org', 'community', false, 15800.00, 423),
  ('Youth Sports Trust', 'Getting young people active through grassroots sports programs, free equipment drives, and mentoring by professional athletes.', 'Sport for every child.', 'https://youthsportstrust.org', 'sports', false, 9400.00, 287)
ON CONFLICT DO NOTHING;

-- ── Seed: Admin User ──────────────────────────────────────────────
INSERT INTO users (full_name, email, password_hash, role)
VALUES (
  'Admin User',
  'admin@golfforgood.com',
  '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u',
  'admin'
)
ON CONFLICT (email) DO NOTHING;
`;

// ── Execute via Supabase pg REST API ────────────────────────────────
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];
const statements = SQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 5);

console.log(`\n🚀 Running migration against Supabase project: ${projectRef}`);
console.log(`📝 Executing ${statements.length} SQL statements...\n`);

async function runSQL(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify([{ query: sql + ';' }]);
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);

    // Use the Supabase PostgREST endpoint to run raw SQL via service role
    const opts = {
      hostname: url.hostname,
      path: `/rest/v1/`,
      method: 'GET',
    };

    // Actually use the pg connection via REST
    const req = https.request({
      hostname: SUPABASE_URL.replace('https://', ''),
      port: 443,
      path: '/rest/v1/',
      method: 'GET',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      }
    }, res => {
      resolve({ status: res.statusCode });
    });
    req.on('error', reject);
    req.end();
  });
}

// Better approach: use supabase-js with rpc
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function migrate() {
  let success = 0;
  let failed = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.substring(0, 60).replace(/\n/g, ' ');
    try {
      // Use rpc to execute SQL
      const { error } = await supabase.rpc('exec', { sql: stmt });
      if (error && !error.message.includes('already exists') && !error.message.includes('duplicate')) {
        console.warn(`⚠️  [${i+1}] ${preview}...`);
        console.warn(`   Error: ${error.message}`);
        failed++;
      } else {
        console.log(`✅ [${i+1}] ${preview}...`);
        success++;
      }
    } catch (e) {
      console.warn(`❌ [${i+1}] ${preview}... — ${e.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Migration complete: ${success} succeeded, ${failed} skipped/failed`);
  console.log('\n💡 If tables already exist, errors above are safe to ignore.');
  console.log('🎉 Please run the SQL manually in Supabase SQL Editor if needed.\n');
  console.log('SQL file location:');
  console.log('  backend/src/database/migrations/001_initial_schema.sql\n');
}

migrate().catch(console.error);
