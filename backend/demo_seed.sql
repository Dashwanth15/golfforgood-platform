-- ==============================================================================
-- GolfForGood — Realistic Demo Seed Data
-- Generates users, charities, plans, scores, draws, entries, and winners.
-- ==============================================================================

-- Disable triggers temporarily if needed (Optional, depending on Supabase config)
-- SET session_replication_role = 'replica';

-- 1. SUBSCRIPTION PLANS
INSERT INTO subscription_plans (id, name, plan_type, price_amount, currency, duration_days, features)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Monthly Standard', 'monthly', 9.99, 'GBP', 30, ARRAY['Track 5 scores/month', '1 draw entry']),
  ('b2222222-2222-2222-2222-222222222222', 'Yearly Pro', 'yearly', 99.99, 'GBP', 365, ARRAY['Unlimited scores', '12 draw entries', 'VIP Support']),
  ('b3333333-3333-3333-3333-333333333333', 'Monthly Starter', 'monthly', 4.99, 'GBP', 30, ARRAY['Track 3 scores/month', 'No draw entry'])
ON CONFLICT (id) DO NOTHING;

-- 2. CHARITIES
INSERT INTO charities (id, name, description, short_bio, category, is_featured, total_raised, donor_count)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Fairways for Youth', 'Providing golf equipment and coaching to underprivileged youth.', 'Empowering kids through golf.', 'sports', true, 12500.00, 45),
  ('c2222222-2222-2222-2222-222222222222', 'Green Greens Initiative', 'Working to make UK golf courses 100% carbon neutral by 2030.', 'Sustainable golfing for the future.', 'environment', true, 8400.00, 32),
  ('c3333333-3333-3333-3333-333333333333', 'Veterans on the Course', 'Rehabilitation through golf for military veterans.', 'Healing heroes on the fairway.', 'health', false, 15600.00, 89),
  ('c4444444-4444-4444-4444-444444444444', 'Local Links Community Fund', 'Supporting local community projects around historic golf clubs.', 'Building communities together.', 'community', false, 4200.00, 15)
ON CONFLICT (id) DO NOTHING;

-- 3. USERS
-- Password hash is "password123" for all demo users
INSERT INTO users (id, full_name, email, password_hash, role)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Liam Henderson', 'liam.h@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber'),
  ('a2222222-2222-2222-2222-222222222222', 'Sarah Jenkins', 'sarah.j@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber'),
  ('a3333333-3333-3333-3333-333333333333', 'Marcus Thorne', 'marcus.t@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber'),
  ('a4444444-4444-4444-4444-444444444444', 'Emily Davies', 'emily.d@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber'),
  ('a5555555-5555-5555-5555-555555555555', 'James Robertson', 'james.r@example.com', '$2a$12$O2/IvhwGp58XHv1UjxqaMucxhNQUzELtX4N/1vT9vT0bhc0U0X76u', 'subscriber')
ON CONFLICT (email) DO NOTHING;

-- 4. SUBSCRIPTIONS
INSERT INTO subscriptions (user_id, plan_id, status, start_date, end_date)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'active', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE + INTERVAL '15 days'),
  ('a2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'active', CURRENT_DATE - INTERVAL '120 days', CURRENT_DATE + INTERVAL '245 days'),
  ('a3333333-3333-3333-3333-333333333333', 'b1111111-1111-1111-1111-111111111111', 'active', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days'),
  ('a4444444-4444-4444-4444-444444444444', 'b3333333-3333-3333-3333-333333333333', 'cancelled', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '30 days'),
  ('a5555555-5555-5555-5555-555555555555', 'b2222222-2222-2222-2222-222222222222', 'active', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '360 days');

-- 5. USER CHARITY SELECTIONS
INSERT INTO user_charity_selections (user_id, charity_id, contribution_pct)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 15),
  ('a2222222-2222-2222-2222-222222222222', 'c3333333-3333-3333-3333-333333333333', 20),
  ('a3333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222', 10),
  ('a5555555-5555-5555-5555-555555555555', 'c4444444-4444-4444-4444-444444444444', 50)
ON CONFLICT (user_id) DO NOTHING;

-- 6. GOLF SCORES (20 records, spread over last 60 days)
INSERT INTO user_scores (user_id, score_value, score_date)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 34, CURRENT_DATE - INTERVAL '40 days'),
  ('a1111111-1111-1111-1111-111111111111', 36, CURRENT_DATE - INTERVAL '35 days'),
  ('a1111111-1111-1111-1111-111111111111', 32, CURRENT_DATE - INTERVAL '20 days'),
  ('a1111111-1111-1111-1111-111111111111', 38, CURRENT_DATE - INTERVAL '5 days'),
  ('a2222222-2222-2222-2222-222222222222', 40, CURRENT_DATE - INTERVAL '50 days'),
  ('a2222222-2222-2222-2222-222222222222', 42, CURRENT_DATE - INTERVAL '45 days'),
  ('a2222222-2222-2222-2222-222222222222', 39, CURRENT_DATE - INTERVAL '25 days'),
  ('a2222222-2222-2222-2222-222222222222', 41, CURRENT_DATE - INTERVAL '15 days'),
  ('a2222222-2222-2222-2222-222222222222', 44, CURRENT_DATE - INTERVAL '2 days'),
  ('a3333333-3333-3333-3333-333333333333', 28, CURRENT_DATE - INTERVAL '12 days'),
  ('a3333333-3333-3333-3333-333333333333', 30, CURRENT_DATE - INTERVAL '8 days'),
  ('a3333333-3333-3333-3333-333333333333', 31, CURRENT_DATE - INTERVAL '1 day'),
  ('a4444444-4444-4444-4444-444444444444', 22, CURRENT_DATE - INTERVAL '58 days'),
  ('a4444444-4444-4444-4444-444444444444', 25, CURRENT_DATE - INTERVAL '50 days'),
  ('a4444444-4444-4444-4444-444444444444', 24, CURRENT_DATE - INTERVAL '40 days'),
  ('a4444444-4444-4444-4444-444444444444', 27, CURRENT_DATE - INTERVAL '31 days'),
  ('a5555555-5555-5555-5555-555555555555', 38, CURRENT_DATE - INTERVAL '4 days'),
  ('a5555555-5555-5555-5555-555555555555', 35, CURRENT_DATE - INTERVAL '3 days'),
  ('a5555555-5555-5555-5555-555555555555', 39, CURRENT_DATE - INTERVAL '2 days'),
  ('a5555555-5555-5555-5555-555555555555', 41, CURRENT_DATE - INTERVAL '1 day')
ON CONFLICT (user_id, score_date) DO NOTHING;

-- 7. DRAWS
-- Clean up any existing manual draws for these months to prevent foreign key errors with our specific seed UUIDs.
DELETE FROM draws WHERE draw_month IN (
  DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 months')::date,
  DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::date,
  DATE_TRUNC('month', CURRENT_DATE)::date
);

-- Draw 1: Completed 2 months ago
-- Draw 2: Completed 1 month ago
-- Draw 3: Upcoming (Current month)
INSERT INTO draws (id, draw_month, status, winning_numbers, total_revenue, jackpot_rollover, published_at)
VALUES
  ('d1111111-1111-1111-1111-111111111111', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 months')::date, 'published', ARRAY[12, 24, 32, 41, 5], 15400.00, 0, CURRENT_DATE - INTERVAL '2 months'),
  ('d2222222-2222-2222-2222-222222222222', DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::date, 'published', ARRAY[8, 15, 22, 34, 45], 18200.00, 2500.00, CURRENT_DATE - INTERVAL '1 month'),
  ('d3333333-3333-3333-3333-333333333333', DATE_TRUNC('month', CURRENT_DATE)::date, 'draft', NULL, 6400.00, 1500.00, NULL)
ON CONFLICT (draw_month) DO NOTHING;

-- 8. PRIZE POOLS
-- For Draw 1
INSERT INTO prize_pools (draw_id, match_level, allocation_pct, pool_amount, winner_count, per_winner_amount, rolled_over)
VALUES
  ('d1111111-1111-1111-1111-111111111111', 'three_match', 20, 3080.00, 154, 20.00, false),
  ('d1111111-1111-1111-1111-111111111111', 'four_match', 30, 4620.00, 12, 385.00, false),
  ('d1111111-1111-1111-1111-111111111111', 'five_match', 50, 7700.00, 1, 7700.00, false)
ON CONFLICT (draw_id, match_level) DO NOTHING;

-- For Draw 2 (Jackpot rolled over because 0 winners)
INSERT INTO prize_pools (draw_id, match_level, allocation_pct, pool_amount, winner_count, per_winner_amount, rolled_over)
VALUES
  ('d2222222-2222-2222-2222-222222222222', 'three_match', 20, 3640.00, 182, 20.00, false),
  ('d2222222-2222-2222-2222-222222222222', 'four_match', 30, 5460.00, 8, 682.50, false),
  ('d2222222-2222-2222-2222-222222222222', 'five_match', 50, 9100.00, 0, 0.00, true)
ON CONFLICT (draw_id, match_level) DO NOTHING;

-- For Draw 3 (Upcoming)
INSERT INTO prize_pools (draw_id, match_level, allocation_pct, pool_amount, winner_count, rolled_over)
VALUES
  ('d3333333-3333-3333-3333-333333333333', 'three_match', 20, 1280.00, 0, false),
  ('d3333333-3333-3333-3333-333333333333', 'four_match', 30, 1920.00, 0, false),
  ('d3333333-3333-3333-3333-333333333333', 'five_match', 50, 3200.00, 0, false)
ON CONFLICT (draw_id, match_level) DO NOTHING;

-- 9. DRAW ENTRIES (10 entries across the 3 draws)
INSERT INTO draw_entries (id, draw_id, user_id, entry_numbers, match_level, match_count)
VALUES
  -- Draw 1 entries
  ('e1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', ARRAY[12, 24, 32, 41, 5], 'five_match', 5), -- JACKPOT WINNER
  ('e2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', ARRAY[12, 24, 32, 9, 10], 'three_match', 3),
  ('e3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444', ARRAY[1, 2, 3, 4, 5], NULL, 1),
  
  -- Draw 2 entries
  ('e4444444-4444-4444-4444-444444444444', 'd2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', ARRAY[8, 15, 22, 34, 1], 'four_match', 4), -- 4 MATCH WINNER
  ('e5555555-5555-5555-5555-555555555555', 'd2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', ARRAY[8, 15, 22, 2, 3], 'three_match', 3),
  ('e6666666-6666-6666-6666-666666666666', 'd2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', ARRAY[10, 20, 30, 40, 45], NULL, 1),
  
  -- Draw 3 entries (Upcoming, no matches yet)
  ('e7777777-7777-7777-7777-777777777777', 'd3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', ARRAY[5, 12, 19, 26, 33], NULL, 0),
  ('e8888888-8888-8888-8888-888888888888', 'd3333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', ARRAY[7, 14, 21, 28, 35], NULL, 0),
  ('e9999999-9999-9999-9999-999999999999', 'd3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', ARRAY[2, 4, 6, 8, 10], NULL, 0),
  ('e0000000-0000-0000-0000-000000000000', 'd3333333-3333-3333-3333-333333333333', 'a5555555-5555-5555-5555-555555555555', ARRAY[11, 22, 33, 44, 45], NULL, 0)
ON CONFLICT (draw_id, user_id) DO NOTHING;

-- 10. WINNER CLAIMS
INSERT INTO winner_claims (draw_id, user_id, draw_entry_id, match_level, prize_amount, claim_status, payment_status, paid_at)
VALUES
  ('d1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'five_match', 7700.00, 'approved', 'paid', CURRENT_DATE - INTERVAL '40 days'),
  ('d1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', 'three_match', 20.00, 'approved', 'paid', CURRENT_DATE - INTERVAL '45 days'),
  ('d2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'e4444444-4444-4444-4444-444444444444', 'four_match', 682.50, 'pending', 'pending', NULL),
  ('d2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'e5555555-5555-5555-5555-555555555555', 'three_match', 50.00, 'rejected', 'pending', NULL)
ON CONFLICT (draw_id, user_id, match_level) DO NOTHING;

-- 11. DONATIONS
INSERT INTO donations (id, user_id, charity_id, donation_amount, donation_type, created_at)
VALUES
  (uuid_generate_v4(), 'a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 50.00, 'one_time', CURRENT_DATE - INTERVAL '15 days'),
  (uuid_generate_v4(), 'a2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 25.00, 'one_time', CURRENT_DATE - INTERVAL '5 days'),
  (uuid_generate_v4(), 'a3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', 100.00, 'one_time', CURRENT_DATE - INTERVAL '2 days'),
  (uuid_generate_v4(), 'a1111111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444', 10.00, 'one_time', CURRENT_DATE)
ON CONFLICT DO NOTHING;


-- ==============================================================================
-- End of Seed Data
-- ==============================================================================
