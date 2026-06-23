import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../../config/database';
import { sendSuccess } from '../../shared/utils/response';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/role.middleware';

const router = Router();

router.get('/analytics', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      { count: totalUsers },
      { count: activeSubscriptions },
      { data: subs },
      { count: totalCharities },
      { count: pendingClaims },
      { data: draws },
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).is('deleted_at', null),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active').gte('end_date', today),
      supabase.from('subscriptions').select('plan:subscription_plans(price_amount)').eq('status', 'active').gte('end_date', today),
      supabase.from('charities').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('winner_claims').select('*', { count: 'exact', head: true }).eq('claim_status', 'pending'),
      supabase.from('draws').select('total_revenue').eq('status', 'published'),
    ]);

    // Calculate MRR and prize pool
    const totalRevenue = (subs ?? []).reduce((sum, s: any) => sum + Number(s.plan?.price_amount ?? 0), 0);
    const totalPrizePool = (draws ?? []).reduce((sum, d: any) => sum + Number(d.total_revenue ?? 0) * 0.5, 0);

    sendSuccess(res, {
      totalUsers,
      activeSubscriptions,
      totalRevenue: totalRevenue.toFixed(2),
      totalCharities,
      pendingClaims,
      totalPrizePool: totalPrizePool.toFixed(2),
    });
  } catch (err) { next(err); }
});

export default router;
