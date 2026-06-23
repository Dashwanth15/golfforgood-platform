import { Router } from 'express';
import { charitiesController } from './charities.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/role.middleware';

const router = Router();

// Public
router.get('/',          (req, res, next) => charitiesController.getAll(req, res, next));
router.get('/featured',  (req, res, next) => charitiesController.getFeatured(req, res, next));
router.get('/:id',       (req, res, next) => charitiesController.getById(req, res, next));

import { requireActiveSubscription } from '../../middleware/subscription.middleware';

// Subscriber
router.get('/user/my-selection',  authenticate, (req, res, next) => charitiesController.getMySelection(req as any, res, next));
router.post('/user/my-selection', authenticate, requireActiveSubscription, (req, res, next) => charitiesController.setMySelection(req as any, res, next));
router.get('/user/donations',     authenticate, (req, res, next) => charitiesController.getMyDonations(req as any, res, next));
router.post('/:id/donate',        authenticate, requireActiveSubscription, (req, res, next) => charitiesController.donate(req as any, res, next));

// Admin
router.post('/',        authenticate, requireAdmin, (req, res, next) => charitiesController.create(req, res, next));
router.patch('/:id',    authenticate, requireAdmin, (req, res, next) => charitiesController.update(req, res, next));
router.delete('/:id',   authenticate, requireAdmin, (req, res, next) => charitiesController.remove(req, res, next));

import multer from 'multer';
import { ValidationError } from '../../shared/errors/AppError';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('INVALID_FILE_TYPE'));
    }
  },
});

router.post(
  '/:id/media',
  authenticate,
  requireAdmin,
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return next(new ValidationError('File too large. Maximum size is 5 MB.'));
      }
      if (err && err.message === 'INVALID_FILE_TYPE') {
        return next(new ValidationError('Invalid file type. Only JPG, PNG, and WebP images are allowed.'));
      }
      if (err) return next(err);
      next();
    });
  },
  (req, res, next) => charitiesController.uploadMedia(req as any, res, next)
);

export default router;
