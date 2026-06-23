import { Request, Response, NextFunction } from 'express';
import { scoresService } from './scores.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class ScoresController {
  async getMyScores(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const scores = await scoresService.getMyScores(req.user!.userId);
      sendSuccess(res, scores);
    } catch (err) { next(err); }
  }

  async addScore(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { score_value, score_date } = req.body;
      const score = await scoresService.addScore(req.user!.userId, +score_value, score_date);
      sendCreated(res, score, 'Score added');
    } catch (err) { next(err); }
  }

  async updateScore(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const score = await scoresService.updateScore(req.user!.userId, req.params.id as string, req.body);
      sendSuccess(res, score, 'Score updated');
    } catch (err) { next(err); }
  }

  async deleteScore(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await scoresService.deleteScore(req.user!.userId, req.params.id as string);
      sendSuccess(res, result, 'Score deleted');
    } catch (err) { next(err); }
  }

  // --- ADMIN METHODS ---
  async adminGetUserScores(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const scores = await scoresService.adminGetUserScores(req.params.userId as string);
      sendSuccess(res, scores);
    } catch (err) { next(err); }
  }

  async adminUpdateScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const score = await scoresService.adminUpdateScore(req.params.scoreId as string, req.body);
      sendSuccess(res, score, 'Score updated successfully');
    } catch (err) { next(err); }
  }

  async adminDeleteScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await scoresService.adminDeleteScore(req.params.scoreId as string);
      sendSuccess(res, result, 'Score deleted successfully');
    } catch (err) { next(err); }
  }
}

export const scoresController = new ScoresController();
