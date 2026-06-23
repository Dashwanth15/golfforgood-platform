import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../../config/database';
import { sendSuccess } from '../../shared/utils/response';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/role.middleware';

const router = Router();

router.get('/analytics', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Auto-expire any subscriptions before fetching analytics
    await supabase
      .from('subscriptions')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('status', 'active')
      .lt('end_date', today);

    const [
      { count: totalUsers },
      { count: activeSubscriptions },
      { data: subs },
      { count: totalCharities },
      { count: pendingClaims },
      { data: draws },
      { count: totalDonations, data: donationsData },
      { count: expiredSubscriptions },
      { count: cancelledSubscriptions },
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).is('deleted_at', null),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('subscriptions').select('plan:subscription_plans(price_amount)').eq('status', 'active'),
      supabase.from('charities').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('winner_claims').select('*', { count: 'exact', head: true }).eq('claim_status', 'pending'),
      supabase.from('draws').select('total_revenue').eq('status', 'published'),
      supabase.from('donations').select('donation_amount', { count: 'exact' }),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'expired'),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
    ]);

    // Calculate MRR and prize pool
    const totalRevenue = (subs ?? []).reduce((sum, s: any) => sum + Number(s.plan?.price_amount ?? 0), 0);
    const totalPrizePool = (draws ?? []).reduce((sum, d: any) => sum + Number(d.total_revenue ?? 0) * 0.5, 0);
    const totalDonatedAmount = (donationsData ?? []).reduce((sum, d: any) => sum + Number(d.donation_amount ?? 0), 0);

    sendSuccess(res, {
      totalUsers,
      activeSubscriptions,
      expiredSubscriptions,
      cancelledSubscriptions,
      totalRevenue: totalRevenue.toFixed(2),
      totalCharities,
      pendingClaims,
      totalPrizePool: totalPrizePool.toFixed(2),
      totalDonations,
      totalDonatedAmount: totalDonatedAmount.toFixed(2),
    });
  } catch (err) { next(err); }
});

export default router;
