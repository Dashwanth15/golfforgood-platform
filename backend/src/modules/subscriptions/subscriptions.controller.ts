import { Request, Response, NextFunction } from 'express';
import { subscriptionsService } from './subscriptions.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class SubscriptionsController {
  async getPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plans = await subscriptionsService.getPlans();
      sendSuccess(res, plans, 'Plans retrieved');
    } catch (err) { next(err); }
  }

  async getMySubscription(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const sub = await subscriptionsService.getMySubscription(req.user!.userId);
      sendSuccess(res, sub);
    } catch (err) { next(err); }
  }

  async purchase(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const sub = await subscriptionsService.purchaseSubscription(req.user!.userId, req.body.plan_id);
      sendCreated(res, sub, 'Subscription activated');
    } catch (err) { next(err); }
  }

  async cancel(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const sub = await subscriptionsService.cancelSubscription(req.user!.userId, req.params.id as string);
      sendSuccess(res, sub, 'Subscription cancelled');
    } catch (err) { next(err); }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = req.query as any;
      const result = await subscriptionsService.getAllSubscriptions(+page || 1, +limit || 20);
      sendSuccess(res, result.subscriptions, 'Subscriptions retrieved', 200, {
        page: +page || 1, limit: +limit || 20, total: result.total, totalPages: Math.ceil(result.total / (+limit || 20)),
      });
    } catch (err) { next(err); }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sub = await subscriptionsService.updateSubscriptionStatus(req.params.id as string, req.body.status);
      sendSuccess(res, sub, 'Status updated');
    } catch (err) { next(err); }
  }
}

export const subscriptionsController = new SubscriptionsController();
