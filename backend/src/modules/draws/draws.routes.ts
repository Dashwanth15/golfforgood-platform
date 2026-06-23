import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { drawsService } from './draws.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/role.middleware';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

const router = Router();

// Public / subscriber
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const draws = await drawsService.getPublishedDraws();
    sendSuccess(res, draws);
  } catch (err) { next(err); }
});

router.get('/upcoming', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await drawsService.getUpcomingDraw();
    sendSuccess(res, data);
  } catch (err) { next(err); }
});

router.get('/admin', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const draws = await drawsService.getAllDraws();
    sendSuccess(res, draws);
  } catch (err) { next(err); }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const draw = await drawsService.getDrawById(req.params.id as string);
    sendSuccess(res, draw);
  } catch (err) { next(err); }
});

// Admin
router.post('/', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { draw_month, total_revenue } = req.body;
    const draw = await drawsService.createDraw(req.user!.userId, draw_month, +total_revenue);
    sendCreated(res, draw, 'Draw created');
  } catch (err) { next(err); }
});

router.post('/:id/simulate', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await drawsService.simulateDraw(req.params.id as string);
    sendSuccess(res, result, 'Simulation complete');
  } catch (err) { next(err); }
});

router.post('/:id/generate', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const draw = await drawsService.generateDraw(req.params.id as string);
    sendSuccess(res, draw, 'Winning numbers generated');
  } catch (err) { next(err); }
});

router.post('/:id/publish', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const draw = await drawsService.publishDraw(req.params.id as string);
    sendSuccess(res, draw, 'Draw published successfully');
  } catch (err) { next(err); }
});

export default router;
