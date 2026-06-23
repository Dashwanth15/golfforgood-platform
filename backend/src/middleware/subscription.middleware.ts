import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { ForbiddenError } from '../shared/errors/AppError';
import { subscriptionsService } from '../modules/subscriptions/subscriptions.service';

export const requireActiveSubscription = async (req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ForbiddenError('Not authenticated');
    }
    
    // Check for active subscription
    const sub = await subscriptionsService.getMySubscription(req.user.userId);
    if (!sub || sub.status !== 'active') {
      throw new ForbiddenError('An active subscription is required to perform this action. Please upgrade or renew your plan.');
    }
    
    next();
  } catch (err) {
    next(err);
  }
};
