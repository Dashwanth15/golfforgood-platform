// ── User ─────────────────────────────────────────────────────────
export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'subscriber' | 'admin';
  avatar_url: string | null;
  is_suspended: boolean;
  created_at: string;
}

// ── Auth ──────────────────────────────────────────────────────────
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ── Subscription ──────────────────────────────────────────────────
export interface SubscriptionPlan {
  id: string;
  name: string;
  plan_type: 'monthly' | 'yearly';
  price_amount: number;
  currency: string;
  duration_days: number;
  features: string[];
  is_active: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'expired' | 'cancelled';
  start_date: string;
  end_date: string;
  renewal_date: string | null;
  plan?: SubscriptionPlan;
  user?: User;
}

// ── Charity ───────────────────────────────────────────────────────
export type CharityCategory = 'education' | 'health' | 'environment' | 'community' | 'sports' | 'other';

export interface Charity {
  id: string;
  name: string;
  description: string;
  short_bio: string | null;
  image_url: string | null;
  website_url: string | null;
  category: CharityCategory;
  is_featured: boolean;
  is_active: boolean;
  total_raised: number;
  donor_count: number;
}

export interface CharitySelection {
  id: string;
  contribution_pct: number;
  charity: Charity;
}

// ── Score ─────────────────────────────────────────────────────────
export interface Score {
  id: string;
  score_value: number;
  score_date: string;
  created_at: string;
  updated_at: string;
}

// ── Draw ──────────────────────────────────────────────────────────
export type DrawStatus = 'draft' | 'simulated' | 'published';
export type MatchLevel = 'three_match' | 'four_match' | 'five_match';

export interface Draw {
  id: string;
  draw_month: string;
  status: DrawStatus;
  winning_numbers: number[];
  total_revenue: number;
  jackpot_rollover: number;
  published_at: string | null;
  created_at?: string;
  prize_pools?: PrizePool[];
  draw_entries?: { count: number }[];
}

export interface DrawEntry {
  id: string;
  draw_id: string;
  user_id: string;
  entry_numbers: number[];
  match_level: MatchLevel | null;
  match_count: number | null;
}

// ── Prize Pool ────────────────────────────────────────────────────
export interface PrizePool {
  id: string;
  draw_id: string;
  match_level: MatchLevel;
  allocation_pct: number;
  pool_amount: number;
  winner_count: number;
  per_winner_amount: number | null;
  rolled_over: boolean;
}

// ── Winner Claims ─────────────────────────────────────────────────
export type ClaimStatus = 'pending' | 'approved' | 'rejected';
export type PaymentStatus = 'pending' | 'paid';

export interface WinnerClaim {
  id: string;
  draw_id: string;
  user_id: string;
  match_level: MatchLevel;
  prize_amount: number;
  proof_url: string | null;
  claim_status: ClaimStatus;
  payment_status: PaymentStatus;
  admin_notes: string | null;
  reviewed_at: string | null;
  paid_at: string | null;
  created_at: string;
  draw?: Pick<Draw, 'draw_month' | 'winning_numbers'>;
  user?: Pick<User, 'full_name' | 'email'>;
}

// ── API Response ──────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── Admin Analytics ───────────────────────────────────────────────
export interface Analytics {
  totalUsers: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  cancelledSubscriptions: number;
  totalRevenue: string;
  totalCharities: number;
  pendingClaims: number;
  totalPrizePool: string;
  totalDonations: number;
  totalDonatedAmount: string;
}

// ── Donations ─────────────────────────────────────────────────────
export interface Donation {
  id: string;
  user_id: string;
  charity_id: string;
  donation_amount: number;
  donation_type: string;
  created_at: string;
  charity?: Pick<Charity, 'name' | 'image_url' | 'category'>;
}
