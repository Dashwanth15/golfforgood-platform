import { Request, Response, NextFunction } from 'express';
import { drawsService } from './draws.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class DrawsController {
  async getPublished(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const draws = await drawsService.getPublishedDraws();
      sendSuccess(res, draws);
    } catch (err) { next(err); }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const draw = await drawsService.getDrawById(req.params.id as string);
      sendSuccess(res, draw);
    } catch (err) { next(err); }
  }

  async getUpcoming(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const info = await drawsService.getUpcomingDraw();
      sendSuccess(res, info);
    } catch (err) { next(err); }
  }

  async createDraw(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { draw_month, total_revenue } = req.body;
      const draw = await drawsService.createDraw(req.user!.userId, draw_month, total_revenue);
      sendCreated(res, draw, 'Draw created');
    } catch (err) { next(err); }
  }

  async simulate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await drawsService.simulateDraw(req.params.id as string);
      sendSuccess(res, result, 'Simulation complete (not published)');
    } catch (err) { next(err); }
  }

  async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await drawsService.generateDraw(req.params.id as string);
      sendSuccess(res, result, 'Winning numbers generated');
    } catch (err) { next(err); }
  }

  async publish(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await drawsService.publishDraw(req.params.id as string);
      sendSuccess(res, result, 'Draw published successfully');
    } catch (err) { next(err); }
  }
}

export const drawsController = new DrawsController();
