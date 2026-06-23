import { Response, NextFunction } from 'express';
import { winnersService } from './winners.service';
import { sendSuccess } from '../../shared/utils/response';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class WinnersController {
  async getMyWinnings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const claims = await winnersService.getMyWinnings(req.user!.userId);
      sendSuccess(res, claims);
    } catch (err) { next(err); }
  }

  async uploadProof(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const proofUrl = req.body.proof_url;
      const claim = await winnersService.uploadProof(req.user!.userId, req.params.id as string, proofUrl);
      sendSuccess(res, claim, 'Proof uploaded');
    } catch (err) { next(err); }
  }

  async getAllClaims(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const claims = await winnersService.getAllClaims(req.query as any);
      sendSuccess(res, claims);
    } catch (err) { next(err); }
  }

  async reviewClaim(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, notes } = req.body;
      const claim = await winnersService.reviewClaim(req.user!.userId, req.params.id as string, status, notes);
      sendSuccess(res, claim, 'Claim reviewed');
    } catch (err) { next(err); }
  }

  async markPaid(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const claim = await winnersService.markPaid(req.params.id as string);
      sendSuccess(res, claim, 'Payment marked as paid');
    } catch (err) { next(err); }
  }
}

export const winnersController = new WinnersController();
