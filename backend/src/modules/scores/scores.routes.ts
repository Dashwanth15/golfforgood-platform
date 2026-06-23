import { Router } from 'express';
import { scoresController } from './scores.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { addScoreSchema, updateScoreSchema } from './scores.schema';

import { requireActiveSubscription } from '../../middleware/subscription.middleware';

import { requireAdmin } from '../../middleware/role.middleware';

const router = Router();

// User routes
router.get('/my', authenticate, (req, res, next) => scoresController.getMyScores(req as any, res, next));
router.post('/',  authenticate, requireActiveSubscription, validate(addScoreSchema), (req, res, next) => scoresController.addScore(req as any, res, next));
router.patch('/:id', authenticate, requireActiveSubscription, validate(updateScoreSchema), (req, res, next) => scoresController.updateScore(req as any, res, next));
router.delete('/:id', authenticate, requireActiveSubscription, (req, res, next) => scoresController.deleteScore(req as any, res, next));

// Admin routes
router.get('/admin/users/:userId', authenticate, requireAdmin, (req, res, next) => scoresController.adminGetUserScores(req, res, next));
router.patch('/admin/:scoreId', authenticate, requireAdmin, validate(updateScoreSchema), (req, res, next) => scoresController.adminUpdateScore(req, res, next));
router.delete('/admin/:scoreId', authenticate, requireAdmin, (req, res, next) => scoresController.adminDeleteScore(req, res, next));

export default router;
