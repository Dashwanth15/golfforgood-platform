import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { ForbiddenError, UnauthorizedError } from '../shared/errors/AppError';
import { supabase } from '../config/database';

export const requireAdmin = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  if (!req.user) return next(new UnauthorizedError());
  if (req.user.role !== 'admin') return next(new ForbiddenError('Admin access required'));
  next();
};

export const requireActiveSubscription = async (
  req: AuthenticatedRequest, _res: Response, next: NextFunction
): Promise<void> => {
  if (!req.user) return next(new UnauthorizedError());

  // Admins bypass subscription check
  if (req.user.role === 'admin') return next();

  try {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', req.user.userId)
      .eq('status', 'active')
      .gte('end_date', today)
      .limit(1)
      .single();

    if (!data) return next(new ForbiddenError('Active subscription required'));
    next();
  } catch {
    next(new ForbiddenError('Subscription check failed'));
  }
};
