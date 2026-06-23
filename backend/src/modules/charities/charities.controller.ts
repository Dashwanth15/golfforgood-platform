import { Request, Response, NextFunction } from 'express';
import { charitiesService } from './charities.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class CharitiesController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, category, page, limit } = req.query as any;
      const result = await charitiesService.getAll({ search, category, page: +page || 1, limit: +limit || 20 });
      sendSuccess(res, result.charities, 'Charities retrieved', 200, {
        page: +page || 1, limit: +limit || 20, total: result.total,
        totalPages: Math.ceil(result.total / (+limit || 20)),
      });
    } catch (err) { next(err); }
  }

  async getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const charity = await charitiesService.getFeatured();
      sendSuccess(res, charity);
    } catch (err) { next(err); }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const charity = await charitiesService.getById(req.params.id as string);
      sendSuccess(res, charity);
    } catch (err) { next(err); }
  }

  async getMySelection(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const selection = await charitiesService.getMySelection(req.user!.userId);
      sendSuccess(res, selection);
    } catch (err) { next(err); }
  }

  async setMySelection(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { charity_id, contribution_pct } = req.body;
      const selection = await charitiesService.setMySelection(req.user!.userId, charity_id, +contribution_pct);
      sendSuccess(res, selection, 'Charity selection saved');
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const charity = await charitiesService.create(req.body);
      sendCreated(res, charity, 'Charity created');
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const charity = await charitiesService.update(req.params.id as string, req.body);
      sendSuccess(res, charity, 'Charity updated');
    } catch (err) { next(err); }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await charitiesService.remove(req.params.id as string);
      sendSuccess(res, result, 'Charity removed');
    } catch (err) { next(err); }
  }

  async getMyDonations(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const donations = await charitiesService.getMyDonations(req.user!.userId);
      sendSuccess(res, donations);
    } catch (err) { next(err); }
  }

  async donate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { amount } = req.body;
      const donation = await charitiesService.makeDonation(req.user!.userId, req.params.id as string, +amount);
      sendSuccess(res, donation, 'Donation successful');
    } catch (err) { next(err); }
  }

  async uploadMedia(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new Error('No file uploaded. Please attach an image file.');
      }
      const charityId = req.params.id as string;
      // Use existing service logic instead of importing supabase in controller if possible, 
      // but winners.routes.ts used supabase directly. I will use charitiesService.
      const url = await charitiesService.uploadMedia(charityId, req.file.buffer, req.file.mimetype);
      sendSuccess(res, { image_url: url }, 'Media uploaded successfully');
    } catch (err) { next(err); }
  }
}

export const charitiesController = new CharitiesController();
