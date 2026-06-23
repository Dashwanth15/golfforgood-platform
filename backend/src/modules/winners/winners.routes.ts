import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../../config/database';
import { sendSuccess } from '../../shared/utils/response';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/role.middleware';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

const router = Router();

// ── Subscriber: my winnings ───────────────────────────────────────
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('winner_claims')
      .select('*, draw:draws(draw_month, winning_numbers)')
      .eq('user_id', req.user!.userId)
      .order('created_at', { ascending: false });
    sendSuccess(res, data ?? []);
  } catch (err) { next(err); }
});

// Upload proof
router.post('/:id/proof', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { proof_url } = req.body;
    const { data } = await supabase
      .from('winner_claims')
      .update({ proof_url, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .eq('user_id', req.user!.userId)
      .select()
      .single();
    sendSuccess(res, data, 'Proof submitted');
  } catch (err) { next(err); }
});

// ── Admin ─────────────────────────────────────────────────────────
router.get('/', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, payment } = req.query as any;
    let query = supabase
      .from('winner_claims')
      .select('*, user:users(id,full_name,email), draw:draws(draw_month,winning_numbers)')
      .order('created_at', { ascending: false });
    if (status) query = query.eq('claim_status', status);
    if (payment) query = query.eq('payment_status', payment);
    const { data } = await query;
    sendSuccess(res, data ?? []);
  } catch (err) { next(err); }
});

router.patch('/:id/review', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, notes } = req.body;
    const { data } = await supabase
      .from('winner_claims')
      .update({
        claim_status: status,
        admin_notes: notes,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select()
      .single();
    sendSuccess(res, data, `Claim ${status}`);
  } catch (err) { next(err); }
});

router.patch('/:id/payment', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = await supabase
      .from('winner_claims')
      .update({
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .eq('claim_status', 'approved')
      .select()
      .single();
    sendSuccess(res, data, 'Marked as paid');
  } catch (err) { next(err); }
});

export default router;
