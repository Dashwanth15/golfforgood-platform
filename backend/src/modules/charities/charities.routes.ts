import { Router } from 'express';
import { charitiesController } from './charities.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/role.middleware';

const router = Router();

// Public
router.get('/',          (req, res, next) => charitiesController.getAll(req, res, next));
router.get('/featured',  (req, res, next) => charitiesController.getFeatured(req, res, next));
router.get('/:id',       (req, res, next) => charitiesController.getById(req, res, next));

// Subscriber
router.get('/user/my-selection',  authenticate, (req, res, next) => charitiesController.getMySelection(req as any, res, next));
router.post('/user/my-selection', authenticate, (req, res, next) => charitiesController.setMySelection(req as any, res, next));
router.get('/user/donations',     authenticate, (req, res, next) => charitiesController.getMyDonations(req as any, res, next));
router.post('/:id/donate',        authenticate, (req, res, next) => charitiesController.donate(req as any, res, next));

// Admin
router.post('/',        authenticate, requireAdmin, (req, res, next) => charitiesController.create(req, res, next));
router.patch('/:id',    authenticate, requireAdmin, (req, res, next) => charitiesController.update(req, res, next));
router.delete('/:id',   authenticate, requireAdmin, (req, res, next) => charitiesController.remove(req, res, next));

export default router;
