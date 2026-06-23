import { Router, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../../config/database';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { updateProfileSchema } from './profile.schema';
import { sendSuccess } from '../../shared/utils/response';
import { NotFoundError } from '../../shared/errors/AppError';

const router = Router();

// GET /api/profile
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { data: user, error } = await supabase
      .from('users')
      .select('id, full_name, email, role, avatar_url, is_suspended, created_at')
      .eq('id', userId)
      .single();

    if (error || !user) throw new NotFoundError('User');
    sendSuccess(res, user, 'Profile retrieved');
  } catch (err) { next(err); }
});

// PATCH /api/profile
router.patch('/', authenticate, validate(updateProfileSchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { full_name, avatar_url, password } = req.body;

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (full_name !== undefined) updates.full_name = full_name;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (password) {
      updates.password_hash = await bcrypt.hash(password, 12);
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select('id, full_name, email, role, avatar_url, is_suspended, created_at')
      .single();

    if (error || !user) throw new NotFoundError('User');
    sendSuccess(res, user, 'Profile updated successfully');
  } catch (err) { next(err); }
});

export default router;
