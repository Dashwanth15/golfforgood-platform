import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../../config/database';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/role.middleware';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

const router = Router();

// Get subscription plans
router.get('/plans', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_amount', { ascending: true });
    sendSuccess(res, data ?? []);
  } catch (err) { next(err); }
});

// My subscription
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('subscriptions')
      .select('*, plan:subscription_plans(*)')
      .eq('user_id', req.user!.userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    sendSuccess(res, data);
  } catch (err) { next(err); }
});

// Purchase (mock payment — subscription created immediately)
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { plan_id } = req.body;

    const { data: plan } = await supabase
      .from('subscription_plans').select('*').eq('id', plan_id).single();
    if (!plan) { res.status(404).json({ success: false, message: 'Plan not found' }); return; }

    const startDate = new Date();
    const endDate = new Date(startDate);
    if (plan.plan_type === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
    else endDate.setFullYear(endDate.getFullYear() + 1);

    // Cancel any existing active subscriptions
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('user_id', req.user!.userId)
      .eq('status', 'active');

    const { data: sub } = await supabase
      .from('subscriptions')
      .insert({
        user_id: req.user!.userId,
        plan_id,
        status: 'active',
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        renewal_date: endDate.toISOString().split('T')[0],
      })
      .select('*, plan:subscription_plans(*)')
      .single();

    sendCreated(res, sub, 'Subscription activated');
  } catch (err) { next(err); }
});

// Cancel
router.patch('/:id/cancel', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .eq('user_id', req.user!.userId)
      .select()
      .single();
    sendSuccess(res, data, 'Subscription cancelled');
  } catch (err) { next(err); }
});

// Admin: get all subscriptions
router.get('/', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 15 } = req.query as any;
    const from = (+page - 1) * +limit;
    const { data, count } = await supabase
      .from('subscriptions')
      .select('*, user:users(id,full_name,email), plan:subscription_plans(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + +limit - 1);
    sendSuccess(res, data ?? [], 'Subscriptions retrieved', 200, {
      page: +page, limit: +limit, total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / +limit),
    });
  } catch (err) { next(err); }
});

// Admin: update status
router.patch('/:id/status', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const { data } = await supabase
      .from('subscriptions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();
    sendSuccess(res, data, 'Status updated');
  } catch (err) { next(err); }
});

export default router;
