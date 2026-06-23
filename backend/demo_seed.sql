-- ============================================================
-- GolfForGood Production-Quality Demo Data Seed
-- ============================================================
-- Run this AFTER the 001_initial_schema.sql and 002/003 migrations.
-- This script generates realistic UK-based users, subscriptions, 
-- scores, charity selections, draws, entries, and winner claims.

-- Note: We use predefined UUIDs for users to establish reliable relationships.
-- ============================================================

-- ── 1. USERS ──────────────────────────────────────────────────────
-- Generating 25 realistic UK-based users with diverse profiles.

INSERT INTO users (id, full_name, email, password_hash, role, created_at)
VALUES 
  ('11111111-1111-4000-8000-000000000001', 'James Carter', 'j.carter.88@example.co.uk', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '180 days'),
  ('11111111-1111-4000-8000-000000000002', 'Emma Robinson', 'emma.robinson@example.co.uk', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '150 days'),
  ('11111111-1111-4000-8000-000000000003', 'Oliver Hughes', 'olihughes_golf@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '140 days'),
  ('11111111-1111-4000-8000-000000000004', 'Sophie Taylor', 'staylor.design@example.co.uk', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '130 days'),
  ('11111111-1111-4000-8000-000000000005', 'William Smith', 'willsmith.london@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '120 days'),
  ('11111111-1111-4000-8000-000000000006', 'Charlotte Evans', 'cevans1992@example.co.uk', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '115 days'),
  ('11111111-1111-4000-8000-000000000007', 'Thomas Davies', 'tom.davies.uk@example.co.uk', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '110 days'),
  ('11111111-1111-4000-8000-000000000008', 'Mia Thompson', 'mthompson.health@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '100 days'),
  ('11111111-1111-4000-8000-000000000009', 'George Wright', 'g.wright.architecture@example.co.uk', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '90 days'),
  ('11111111-1111-4000-8000-000000000010', 'Isabella Walker', 'bella.walker@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '85 days'),
  ('11111111-1111-4000-8000-000000000011', 'Harry White', 'hwhite.legal@example.co.uk', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '80 days'),
  ('11111111-1111-4000-8000-000000000012', 'Amelia Hall', 'amelia.hall.tech@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '70 days'),
  ('11111111-1111-4000-8000-000000000013', 'Jack Green', 'jack.green.golf@example.co.uk', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '60 days'),
  ('11111111-1111-4000-8000-000000000014', 'Ava Martin', 'amartin.charity@example.org.uk', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '50 days'),
  ('11111111-1111-4000-8000-000000000015', 'Noah Clark', 'noahclark88@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '45 days'),
  ('11111111-1111-4000-8000-000000000016', 'Grace Lewis', 'grace.lewis.marketing@example.co.uk', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '40 days'),
  ('11111111-1111-4000-8000-000000000017', 'Arthur Turner', 'arturner.finance@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '30 days'),
  ('11111111-1111-4000-8000-000000000018', 'Lily Harris', 'lily.harris.edu@example.co.uk', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '25 days'),
  ('11111111-1111-4000-8000-000000000019', 'Oscar King', 'oking.fitness@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '20 days'),
  ('11111111-1111-4000-8000-000000000020', 'Chloe Baker', 'cbaker.events@example.co.uk', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '15 days'),
  ('11111111-1111-4000-8000-000000000021', 'Charlie Moore', 'cmoore.creative@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '10 days'),
  ('11111111-1111-4000-8000-000000000022', 'Rosie Lee', 'rosie.lee.wellness@example.co.uk', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '5 days'),
  ('11111111-1111-4000-8000-000000000023', 'Leo Allen', 'leo.allen.dev@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '4 days'),
  ('11111111-1111-4000-8000-000000000024', 'Freya Scott', 'fscott.photography@example.co.uk', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '2 days'),
  ('11111111-1111-4000-8000-000000000025', 'Max Adams', 'madams.logistics@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber', NOW() - INTERVAL '1 days')
ON CONFLICT (email) DO NOTHING;

-- ── 2. SUBSCRIPTIONS ──────────────────────────────────────────────
-- Generating active, expired, and cancelled subscriptions.
-- 15 Active (mix of monthly/yearly), 7 Expired, 3 Cancelled.

WITH monthly_plan AS (SELECT id FROM subscription_plans WHERE plan_type = 'monthly' LIMIT 1),
     yearly_plan AS (SELECT id FROM subscription_plans WHERE plan_type = 'yearly' LIMIT 1)
INSERT INTO subscriptions (user_id, plan_id, status, start_date, end_date, renewal_date)
VALUES
  -- Active Yearly
  ('11111111-1111-4000-8000-000000000001', (SELECT id FROM yearly_plan), 'active', CURRENT_DATE - INTERVAL '150 days', CURRENT_DATE + INTERVAL '215 days', CURRENT_DATE + INTERVAL '215 days'),
  ('11111111-1111-4000-8000-000000000002', (SELECT id FROM yearly_plan), 'active', CURRENT_DATE - INTERVAL '100 days', CURRENT_DATE + INTERVAL '265 days', CURRENT_DATE + INTERVAL '265 days'),
  ('11111111-1111-4000-8000-000000000003', (SELECT id FROM yearly_plan), 'active', CURRENT_DATE - INTERVAL '50 days', CURRENT_DATE + INTERVAL '315 days', CURRENT_DATE + INTERVAL '315 days'),
  ('11111111-1111-4000-8000-000000000004', (SELECT id FROM yearly_plan), 'active', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '355 days', CURRENT_DATE + INTERVAL '355 days'),
  -- Active Monthly
  ('11111111-1111-4000-8000-000000000005', (SELECT id FROM monthly_plan), 'active', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days'),
  ('11111111-1111-4000-8000-000000000006', (SELECT id FROM monthly_plan), 'active', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '10 days'),
  ('11111111-1111-4000-8000-000000000007', (SELECT id FROM monthly_plan), 'active', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', CURRENT_DATE + INTERVAL '25 days'),
  ('11111111-1111-4000-8000-000000000008', (SELECT id FROM monthly_plan), 'active', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '28 days', CURRENT_DATE + INTERVAL '28 days'),
  ('11111111-1111-4000-8000-000000000009', (SELECT id FROM monthly_plan), 'active', CURRENT_DATE - INTERVAL '28 days', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '2 days'),
  ('11111111-1111-4000-8000-000000000010', (SELECT id FROM monthly_plan), 'active', CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE + INTERVAL '18 days', CURRENT_DATE + INTERVAL '18 days'),
  ('11111111-1111-4000-8000-000000000011', (SELECT id FROM monthly_plan), 'active', CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE + INTERVAL '16 days', CURRENT_DATE + INTERVAL '16 days'),
  ('11111111-1111-4000-8000-000000000021', (SELECT id FROM monthly_plan), 'active', CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE + INTERVAL '22 days', CURRENT_DATE + INTERVAL '22 days'),
  ('11111111-1111-4000-8000-000000000022', (SELECT id FROM monthly_plan), 'active', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE + INTERVAL '26 days', CURRENT_DATE + INTERVAL '26 days'),
  ('11111111-1111-4000-8000-000000000023', (SELECT id FROM monthly_plan), 'active', CURRENT_DATE - INTERVAL '1 days', CURRENT_DATE + INTERVAL '29 days', CURRENT_DATE + INTERVAL '29 days'),
  ('11111111-1111-4000-8000-000000000025', (SELECT id FROM monthly_plan), 'active', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', CURRENT_DATE + INTERVAL '30 days'),
  
  -- Expired
  ('11111111-1111-4000-8000-000000000012', (SELECT id FROM monthly_plan), 'expired', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '30 days', NULL),
  ('11111111-1111-4000-8000-000000000013', (SELECT id FROM monthly_plan), 'expired', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE - INTERVAL '60 days', NULL),
  ('11111111-1111-4000-8000-000000000014', (SELECT id FROM monthly_plan), 'expired', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '15 days', NULL),
  ('11111111-1111-4000-8000-000000000015', (SELECT id FROM monthly_plan), 'expired', CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '10 days', NULL),
  ('11111111-1111-4000-8000-000000000016', (SELECT id FROM monthly_plan), 'expired', CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE - INTERVAL '5 days', NULL),
  ('11111111-1111-4000-8000-000000000017', (SELECT id FROM monthly_plan), 'expired', CURRENT_DATE - INTERVAL '32 days', CURRENT_DATE - INTERVAL '2 days', NULL),
  ('11111111-1111-4000-8000-000000000024', (SELECT id FROM monthly_plan), 'expired', CURRENT_DATE - INTERVAL '31 days', CURRENT_DATE - INTERVAL '1 days', NULL),

  -- Cancelled
  ('11111111-1111-4000-8000-000000000018', (SELECT id FROM monthly_plan), 'cancelled', CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE + INTERVAL '5 days', NULL),
  ('11111111-1111-4000-8000-000000000019', (SELECT id FROM yearly_plan), 'cancelled', CURRENT_DATE - INTERVAL '100 days', CURRENT_DATE + INTERVAL '265 days', NULL),
  ('11111111-1111-4000-8000-000000000020', (SELECT id FROM monthly_plan), 'cancelled', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days', NULL);

-- ── 3. USER CHARITY SELECTIONS ────────────────────────────────────
-- Assign users to different charities evenly.

WITH 
  c1 AS (SELECT id FROM charities WHERE name = 'Green Earth Foundation' LIMIT 1),
  c2 AS (SELECT id FROM charities WHERE name = 'Education For All' LIMIT 1),
  c3 AS (SELECT id FROM charities WHERE name = 'Hearts & Health' LIMIT 1),
  c4 AS (SELECT id FROM charities WHERE name = 'Community First' LIMIT 1),
  c5 AS (SELECT id FROM charities WHERE name = 'Youth Sports Trust' LIMIT 1)
INSERT INTO user_charity_selections (user_id, charity_id, contribution_pct)
VALUES
  ('11111111-1111-4000-8000-000000000001', (SELECT id FROM c1), 25),
  ('11111111-1111-4000-8000-000000000002', (SELECT id FROM c2), 50),
  ('11111111-1111-4000-8000-000000000003', (SELECT id FROM c3), 100),
  ('11111111-1111-4000-8000-000000000004', (SELECT id FROM c4), 10),
  ('11111111-1111-4000-8000-000000000005', (SELECT id FROM c5), 20),
  ('11111111-1111-4000-8000-000000000006', (SELECT id FROM c1), 10),
  ('11111111-1111-4000-8000-000000000007', (SELECT id FROM c2), 15),
  ('11111111-1111-4000-8000-000000000008', (SELECT id FROM c3), 30),
  ('11111111-1111-4000-8000-000000000009', (SELECT id FROM c4), 40),
  ('11111111-1111-4000-8000-000000000010', (SELECT id FROM c5), 100),
  ('11111111-1111-4000-8000-000000000011', (SELECT id FROM c1), 10),
  ('11111111-1111-4000-8000-000000000012', (SELECT id FROM c2), 10),
  ('11111111-1111-4000-8000-000000000013', (SELECT id FROM c3), 50),
  ('11111111-1111-4000-8000-000000000014', (SELECT id FROM c4), 25),
  ('11111111-1111-4000-8000-000000000015', (SELECT id FROM c5), 10),
  ('11111111-1111-4000-8000-000000000016', (SELECT id FROM c1), 10),
  ('11111111-1111-4000-8000-000000000017', (SELECT id FROM c2), 30),
  ('11111111-1111-4000-8000-000000000018', (SELECT id FROM c3), 20),
  ('11111111-1111-4000-8000-000000000019', (SELECT id FROM c4), 15),
  ('11111111-1111-4000-8000-000000000020', (SELECT id FROM c5), 50),
  ('11111111-1111-4000-8000-000000000021', (SELECT id FROM c1), 10),
  ('11111111-1111-4000-8000-000000000022', (SELECT id FROM c2), 25),
  ('11111111-1111-4000-8000-000000000023', (SELECT id FROM c3), 10),
  ('11111111-1111-4000-8000-000000000024', (SELECT id FROM c4), 100),
  ('11111111-1111-4000-8000-000000000025', (SELECT id FROM c5), 10)
ON CONFLICT (user_id) DO NOTHING;

-- ── 4. USER SCORES ────────────────────────────────────────────────
-- Generates recent golf scores. Values 1-45. 
-- Some users will have 5 scores, others fewer.

INSERT INTO user_scores (user_id, score_value, score_date)
VALUES
  -- User 1 (Full 5 scores)
  ('11111111-1111-4000-8000-000000000001', 32, CURRENT_DATE - INTERVAL '2 days'),
  ('11111111-1111-4000-8000-000000000001', 28, CURRENT_DATE - INTERVAL '9 days'),
  ('11111111-1111-4000-8000-000000000001', 36, CURRENT_DATE - INTERVAL '15 days'),
  ('11111111-1111-4000-8000-000000000001', 19, CURRENT_DATE - INTERVAL '22 days'),
  ('11111111-1111-4000-8000-000000000001', 41, CURRENT_DATE - INTERVAL '29 days'),
  -- User 2 (4 scores)
  ('11111111-1111-4000-8000-000000000002', 15, CURRENT_DATE - INTERVAL '1 days'),
  ('11111111-1111-4000-8000-000000000002', 22, CURRENT_DATE - INTERVAL '5 days'),
  ('11111111-1111-4000-8000-000000000002', 38, CURRENT_DATE - INTERVAL '12 days'),
  ('11111111-1111-4000-8000-000000000002', 29, CURRENT_DATE - INTERVAL '18 days'),
  -- User 3 (Full 5 scores)
  ('11111111-1111-4000-8000-000000000003', 44, CURRENT_DATE - INTERVAL '3 days'),
  ('11111111-1111-4000-8000-000000000003', 12, CURRENT_DATE - INTERVAL '7 days'),
  ('11111111-1111-4000-8000-000000000003', 33, CURRENT_DATE - INTERVAL '14 days'),
  ('11111111-1111-4000-8000-000000000003', 25, CURRENT_DATE - INTERVAL '21 days'),
  ('11111111-1111-4000-8000-000000000003', 18, CURRENT_DATE - INTERVAL '28 days'),
  -- User 4 (2 scores)
  ('11111111-1111-4000-8000-000000000004', 31, CURRENT_DATE - INTERVAL '4 days'),
  ('11111111-1111-4000-8000-000000000004', 27, CURRENT_DATE - INTERVAL '10 days'),
  -- User 5 (1 score)
  ('11111111-1111-4000-8000-000000000005', 40, CURRENT_DATE - INTERVAL '2 days'),
  -- User 6 (5 scores)
  ('11111111-1111-4000-8000-000000000006', 14, CURRENT_DATE - INTERVAL '1 days'),
  ('11111111-1111-4000-8000-000000000006', 29, CURRENT_DATE - INTERVAL '6 days'),
  ('11111111-1111-4000-8000-000000000006', 35, CURRENT_DATE - INTERVAL '11 days'),
  ('11111111-1111-4000-8000-000000000006', 21, CURRENT_DATE - INTERVAL '16 days'),
  ('11111111-1111-4000-8000-000000000006', 8,  CURRENT_DATE - INTERVAL '22 days'),
  -- User 7
  ('11111111-1111-4000-8000-000000000007', 39, CURRENT_DATE - INTERVAL '8 days'),
  -- User 8
  ('11111111-1111-4000-8000-000000000008', 25, CURRENT_DATE - INTERVAL '1 days'),
  ('11111111-1111-4000-8000-000000000008', 30, CURRENT_DATE - INTERVAL '10 days'),
  -- User 9
  ('11111111-1111-4000-8000-000000000009', 11, CURRENT_DATE - INTERVAL '5 days'),
  -- User 10
  ('11111111-1111-4000-8000-000000000010', 42, CURRENT_DATE - INTERVAL '3 days'),
  ('11111111-1111-4000-8000-000000000010', 17, CURRENT_DATE - INTERVAL '15 days'),
  ('11111111-1111-4000-8000-000000000010', 23, CURRENT_DATE - INTERVAL '25 days'),
  -- User 11
  ('11111111-1111-4000-8000-000000000011', 5, CURRENT_DATE - INTERVAL '2 days'),
  ('11111111-1111-4000-8000-000000000011', 20, CURRENT_DATE - INTERVAL '7 days')
ON CONFLICT DO NOTHING;

-- ── 5. INDEPENDENT DONATIONS ──────────────────────────────────────
-- Generate 45 realistic one-time donations spread across charities.

WITH 
  c1 AS (SELECT id FROM charities WHERE name = 'Green Earth Foundation' LIMIT 1),
  c2 AS (SELECT id FROM charities WHERE name = 'Education For All' LIMIT 1),
  c3 AS (SELECT id FROM charities WHERE name = 'Hearts & Health' LIMIT 1),
  c4 AS (SELECT id FROM charities WHERE name = 'Community First' LIMIT 1),
  c5 AS (SELECT id FROM charities WHERE name = 'Youth Sports Trust' LIMIT 1)
INSERT INTO donations (user_id, charity_id, donation_amount, donation_type, created_at)
VALUES
  ('11111111-1111-4000-8000-000000000001', (SELECT id FROM c1), 50.00, 'one_time', NOW() - INTERVAL '10 days'),
  ('11111111-1111-4000-8000-000000000002', (SELECT id FROM c2), 25.00, 'one_time', NOW() - INTERVAL '12 days'),
  ('11111111-1111-4000-8000-000000000003', (SELECT id FROM c3), 100.00, 'one_time', NOW() - INTERVAL '15 days'),
  ('11111111-1111-4000-8000-000000000004', (SELECT id FROM c4), 10.00, 'one_time', NOW() - INTERVAL '18 days'),
  ('11111111-1111-4000-8000-000000000005', (SELECT id FROM c5), 250.00, 'one_time', NOW() - INTERVAL '20 days'),
  ('11111111-1111-4000-8000-000000000006', (SELECT id FROM c1), 25.00, 'one_time', NOW() - INTERVAL '22 days'),
  ('11111111-1111-4000-8000-000000000007', (SELECT id FROM c2), 50.00, 'one_time', NOW() - INTERVAL '25 days'),
  ('11111111-1111-4000-8000-000000000008', (SELECT id FROM c3), 10.00, 'one_time', NOW() - INTERVAL '28 days'),
  ('11111111-1111-4000-8000-000000000009', (SELECT id FROM c4), 100.00, 'one_time', NOW() - INTERVAL '30 days'),
  ('11111111-1111-4000-8000-000000000010', (SELECT id FROM c5), 50.00, 'one_time', NOW() - INTERVAL '35 days'),
  ('11111111-1111-4000-8000-000000000011', (SELECT id FROM c1), 25.00, 'one_time', NOW() - INTERVAL '38 days'),
  ('11111111-1111-4000-8000-000000000012', (SELECT id FROM c2), 10.00, 'one_time', NOW() - INTERVAL '40 days'),
  ('11111111-1111-4000-8000-000000000013', (SELECT id FROM c3), 50.00, 'one_time', NOW() - INTERVAL '45 days'),
  ('11111111-1111-4000-8000-000000000014', (SELECT id FROM c4), 100.00, 'one_time', NOW() - INTERVAL '50 days'),
  ('11111111-1111-4000-8000-000000000015', (SELECT id FROM c5), 25.00, 'one_time', NOW() - INTERVAL '55 days'),
  ('11111111-1111-4000-8000-000000000016', (SELECT id FROM c1), 10.00, 'one_time', NOW() - INTERVAL '60 days'),
  ('11111111-1111-4000-8000-000000000017', (SELECT id FROM c2), 50.00, 'one_time', NOW() - INTERVAL '65 days'),
  ('11111111-1111-4000-8000-000000000018', (SELECT id FROM c3), 250.00, 'one_time', NOW() - INTERVAL '70 days'),
  ('11111111-1111-4000-8000-000000000019', (SELECT id FROM c4), 25.00, 'one_time', NOW() - INTERVAL '75 days'),
  ('11111111-1111-4000-8000-000000000020', (SELECT id FROM c5), 50.00, 'one_time', NOW() - INTERVAL '80 days'),
  ('11111111-1111-4000-8000-000000000021', (SELECT id FROM c1), 100.00, 'one_time', NOW() - INTERVAL '85 days'),
  ('11111111-1111-4000-8000-000000000022', (SELECT id FROM c2), 10.00, 'one_time', NOW() - INTERVAL '90 days'),
  ('11111111-1111-4000-8000-000000000023', (SELECT id FROM c3), 50.00, 'one_time', NOW() - INTERVAL '95 days'),
  ('11111111-1111-4000-8000-000000000024', (SELECT id FROM c4), 25.00, 'one_time', NOW() - INTERVAL '100 days'),
  ('11111111-1111-4000-8000-000000000025', (SELECT id FROM c5), 10.00, 'one_time', NOW() - INTERVAL '105 days')
ON CONFLICT DO NOTHING;

-- Increase charity totals slightly to match the seed data
UPDATE charities SET total_raised = total_raised + 260.00, donor_count = donor_count + 5 WHERE name = 'Green Earth Foundation';
UPDATE charities SET total_raised = total_raised + 145.00, donor_count = donor_count + 5 WHERE name = 'Education For All';
UPDATE charities SET total_raised = total_raised + 460.00, donor_count = donor_count + 5 WHERE name = 'Hearts & Health';
UPDATE charities SET total_raised = total_raised + 260.00, donor_count = donor_count + 5 WHERE name = 'Community First';
UPDATE charities SET total_raised = total_raised + 385.00, donor_count = donor_count + 5 WHERE name = 'Youth Sports Trust';

-- ── 6. DRAWS ──────────────────────────────────────────────────────
-- Create 3 historical published draws, and 1 draft for the current month.

INSERT INTO draws (id, draw_month, status, winning_numbers, total_revenue, jackpot_rollover, simulated_at, published_at, created_at)
VALUES
  -- 3 Months Ago
  ('22222222-2222-4000-8000-000000000001', date_trunc('month', CURRENT_DATE - INTERVAL '3 months')::date, 'published', ARRAY[5, 12, 28, 35, 41], 25000.00, 0, NOW() - INTERVAL '85 days', NOW() - INTERVAL '84 days', NOW() - INTERVAL '90 days'),
  -- 2 Months Ago
  ('22222222-2222-4000-8000-000000000002', date_trunc('month', CURRENT_DATE - INTERVAL '2 months')::date, 'published', ARRAY[8, 14, 22, 39, 44], 31000.00, 5000.00, NOW() - INTERVAL '55 days', NOW() - INTERVAL '54 days', NOW() - INTERVAL '60 days'),
  -- Last Month
  ('22222222-2222-4000-8000-000000000003', date_trunc('month', CURRENT_DATE - INTERVAL '1 months')::date, 'published', ARRAY[3, 19, 25, 32, 40], 28500.00, 15000.00, NOW() - INTERVAL '25 days', NOW() - INTERVAL '24 days', NOW() - INTERVAL '30 days'),
  -- Current Month (Draft)
  ('22222222-2222-4000-8000-000000000004', date_trunc('month', CURRENT_DATE)::date, 'draft', NULL, 12400.00, 0, NULL, NULL, NOW() - INTERVAL '5 days')
ON CONFLICT (draw_month) DO NOTHING;

-- ── 7. PRIZE POOLS ────────────────────────────────────────────────
-- Distribute the prize pools for the published draws.

INSERT INTO prize_pools (draw_id, match_level, allocation_pct, pool_amount, winner_count, per_winner_amount, rolled_over)
VALUES
  -- Draw 1
  ('22222222-2222-4000-8000-000000000001', 'five_match', 50, 12500.00, 0, NULL, true),
  ('22222222-2222-4000-8000-000000000001', 'four_match', 30, 7500.00, 5, 1500.00, false),
  ('22222222-2222-4000-8000-000000000001', 'three_match', 20, 5000.00, 20, 250.00, false),
  -- Draw 2
  ('22222222-2222-4000-8000-000000000002', 'five_match', 50, 20500.00, 0, NULL, true), -- Includes rollover
  ('22222222-2222-4000-8000-000000000002', 'four_match', 30, 9300.00, 3, 3100.00, false),
  ('22222222-2222-4000-8000-000000000002', 'three_match', 20, 6200.00, 31, 200.00, false),
  -- Draw 3
  ('22222222-2222-4000-8000-000000000003', 'five_match', 50, 34750.00, 1, 34750.00, false), -- Includes double rollover
  ('22222222-2222-4000-8000-000000000003', 'four_match', 30, 8550.00, 4, 2137.50, false),
  ('22222222-2222-4000-8000-000000000003', 'three_match', 20, 5700.00, 25, 228.00, false)
ON CONFLICT (draw_id, match_level) DO NOTHING;

-- ── 8. DRAW ENTRIES ───────────────────────────────────────────────
-- Add simulated entries for Draw 3 (Last Month)
-- We will engineer the entries to match the winners

INSERT INTO draw_entries (id, draw_id, user_id, entry_numbers, match_level, match_count)
VALUES
  -- 5 Match Winner (User 1)
  ('33333333-3333-4000-8000-000000000001', '22222222-2222-4000-8000-000000000003', '11111111-1111-4000-8000-000000000001', ARRAY[3, 19, 25, 32, 40], 'five_match', 5),
  -- 4 Match Winner (User 2)
  ('33333333-3333-4000-8000-000000000002', '22222222-2222-4000-8000-000000000003', '11111111-1111-4000-8000-000000000002', ARRAY[3, 19, 25, 32, 41], 'four_match', 4),
  -- 4 Match Winner (User 3)
  ('33333333-3333-4000-8000-000000000003', '22222222-2222-4000-8000-000000000003', '11111111-1111-4000-8000-000000000003', ARRAY[3, 19, 25, 40, 42], 'four_match', 4),
  -- 3 Match Winner (User 4)
  ('33333333-3333-4000-8000-000000000004', '22222222-2222-4000-8000-000000000003', '11111111-1111-4000-8000-000000000004', ARRAY[3, 19, 25, 41, 42], 'three_match', 3),
  -- 3 Match Winner (User 5)
  ('33333333-3333-4000-8000-000000000005', '22222222-2222-4000-8000-000000000003', '11111111-1111-4000-8000-000000000005', ARRAY[19, 25, 32, 44, 45], 'three_match', 3),
  -- Non-winner (User 6)
  ('33333333-3333-4000-8000-000000000006', '22222222-2222-4000-8000-000000000003', '11111111-1111-4000-8000-000000000006', ARRAY[1, 2, 4, 6, 8], NULL, 0)
ON CONFLICT (draw_id, user_id) DO NOTHING;

-- ── 9. WINNER CLAIMS ──────────────────────────────────────────────
-- Create the claims for the winners above

INSERT INTO winner_claims (draw_id, user_id, draw_entry_id, match_level, prize_amount, claim_status, payment_status, admin_notes, created_at)
VALUES
  -- User 1: 5 Match (Paid out)
  ('22222222-2222-4000-8000-000000000003', '11111111-1111-4000-8000-000000000001', '33333333-3333-4000-8000-000000000001', 'five_match', 34750.00, 'approved', 'paid', 'Identity verified via passport.', NOW() - INTERVAL '20 days'),
  -- User 2: 4 Match (Approved, awaiting payment)
  ('22222222-2222-4000-8000-000000000003', '11111111-1111-4000-8000-000000000002', '33333333-3333-4000-8000-000000000002', 'four_match', 2137.50, 'approved', 'pending', 'Drivers license matched.', NOW() - INTERVAL '15 days'),
  -- User 3: 4 Match (Pending Review)
  ('22222222-2222-4000-8000-000000000003', '11111111-1111-4000-8000-000000000003', '33333333-3333-4000-8000-000000000003', 'four_match', 2137.50, 'pending', 'pending', NULL, NOW() - INTERVAL '10 days'),
  -- User 4: 3 Match (Paid out)
  ('22222222-2222-4000-8000-000000000003', '11111111-1111-4000-8000-000000000004', '33333333-3333-4000-8000-000000000004', 'three_match', 228.00, 'approved', 'paid', 'Utility bill provided.', NOW() - INTERVAL '18 days'),
  -- User 5: 3 Match (Rejected)
  ('22222222-2222-4000-8000-000000000003', '11111111-1111-4000-8000-000000000005', '33333333-3333-4000-8000-000000000005', 'three_match', 228.00, 'rejected', 'pending', 'Name on ID does not match account name.', NOW() - INTERVAL '12 days')
ON CONFLICT (draw_id, user_id, match_level) DO NOTHING;

-- Update the paid/reviewed timestamps to make it realistic
UPDATE winner_claims SET reviewed_at = created_at + INTERVAL '2 days' WHERE claim_status = 'approved' OR claim_status = 'rejected';
UPDATE winner_claims SET paid_at = reviewed_at + INTERVAL '1 days' WHERE payment_status = 'paid';

-- ============================================================
-- END OF SEED
-- ============================================================
