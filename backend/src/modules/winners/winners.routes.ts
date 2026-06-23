import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { supabase } from '../../config/database';
import { sendSuccess } from '../../shared/utils/response';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/role.middleware';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { winnersService } from './winners.service';
import { ValidationError, ForbiddenError, NotFoundError } from '../../shared/errors/AppError';
import { EmailService } from '../../services/email.service';

const router = Router();

// ── Multer: memory storage for Supabase upload ────────────────────
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('INVALID_FILE_TYPE'));
    }
  },
});

// ── Subscriber: my winnings ───────────────────────────────────────
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await winnersService.getMyWinnings(req.user!.userId);
    sendSuccess(res, data);
  } catch (err) { next(err); }
});

import { requireActiveSubscription } from '../../middleware/subscription.middleware';

// ── Upload proof (real file upload to Supabase Storage) ──────────
router.post(
  '/:id/proof',
  authenticate,
  requireActiveSubscription,
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('proof')(req, res, (err) => {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return next(new ValidationError('File too large. Maximum size is 5 MB.'));
      }
      if (err && err.message === 'INVALID_FILE_TYPE') {
        return next(new ValidationError('Invalid file type. Only JPG, PNG, and WebP images are allowed.'));
      }
      if (err) return next(err);
      next();
    });
  },
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id: claimId } = req.params;
      const userId = req.user!.userId;

      if (!req.file) {
        throw new ValidationError('No file uploaded. Please attach an image file.');
      }

      // Verify ownership before processing the upload
      const { data: claim } = await supabase
        .from('winner_claims')
        .select('id, user_id, claim_status')
        .eq('id', claimId)
        .single();

      if (!claim) throw new NotFoundError('Claim');
      if (claim.user_id !== userId) throw new ForbiddenError('You can only upload proof for your own claims');
      if (claim.claim_status !== 'pending') throw new ValidationError('This claim has already been reviewed');

      // Build a unique storage path: winner-proofs/<userId>/<claimId>/<timestamp>.<ext>
      const ext = req.file.mimetype.split('/')[1].replace('jpeg', 'jpg');
      const storagePath = `${userId}/${claimId}/${Date.now()}.${ext}`;

      // Upload to Supabase Storage bucket "winner-proofs"
      const { error: uploadError } = await supabase.storage
        .from('winner-proofs')
        .upload(storagePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        console.error('Supabase Storage upload error:', uploadError);
        throw new Error('Failed to upload file. Please try again.');
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('winner-proofs')
        .getPublicUrl(storagePath);

      const publicUrl = urlData.publicUrl;

      // Save the public URL to the winner_claims table
      const { data, error } = await supabase
        .from('winner_claims')
        .update({ proof_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', claimId)
        .select()
        .single();

      if (error) throw new Error('Failed to save proof URL');

      sendSuccess(res, data, 'Proof submitted successfully');
    } catch (err) { next(err); }
  }
);

// ── Admin: list all claims ────────────────────────────────────────
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

// ── Admin: review claim (approve or reject) ───────────────────────
router.patch('/:id/review', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, notes } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      throw new ValidationError('Status must be "approved" or "rejected"');
    }
    const { data } = await supabase
      .from('winner_claims')
      .update({
        claim_status: status,
        admin_notes: notes ?? null,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select('*, user:users(full_name, email)')
      .single();

    if (data) {
      const u = Array.isArray(data.user) ? data.user[0] : data.user;
      if (u && u.email) {
        if (status === 'approved') {
          EmailService.sendClaimApproved(
            { email: u.email, name: u.full_name.split(' ')[0] },
            `£${Number(data.prize_amount).toFixed(2)}`,
            data.payment_status
          ).catch(e => console.error(e));
        } else if (status === 'rejected') {
          EmailService.sendClaimRejected(
            { email: u.email, name: u.full_name.split(' ')[0] },
            data.admin_notes || 'Failed identity verification'
          ).catch(e => console.error(e));
        }
      }
    }

    sendSuccess(res, data, `Claim ${status}`);
  } catch (err) { next(err); }
});

// ── Admin: mark claim as paid ─────────────────────────────────────
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
