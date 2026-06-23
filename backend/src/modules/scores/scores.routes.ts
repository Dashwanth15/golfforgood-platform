import { Router } from 'express';
import { scoresController } from './scores.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { addScoreSchema, updateScoreSchema } from './scores.schema';

import { requireActiveSubscription } from '../../middleware/subscription.middleware';

const router = Router();

router.get('/my', authenticate, (req, res, next) => scoresController.getMyScores(req as any, res, next));
router.post('/',  authenticate, requireActiveSubscription, validate(addScoreSchema), (req, res, next) => scoresController.addScore(req as any, res, next));
router.patch('/:id', authenticate, requireActiveSubscription, validate(updateScoreSchema), (req, res, next) => scoresController.updateScore(req as any, res, next));
router.delete('/:id', authenticate, requireActiveSubscription, (req, res, next) => scoresController.deleteScore(req as any, res, next));

export default router;
