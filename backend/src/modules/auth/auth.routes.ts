import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/role.middleware';

const router = Router();

// Public
router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/login',    (req, res, next) => authController.login(req, res, next));
router.post('/google',   (req, res, next) => authController.loginWithGoogle(req, res, next));

// Authenticated
router.get('/me', authenticate, (req, res, next) => authController.getMe(req as any, res, next));

// Admin
router.get('/admin/users',              authenticate, requireAdmin, (req, res, next) => authController.getAllUsers(req, res, next));
router.patch('/admin/users/:id/suspend', authenticate, requireAdmin, (req, res, next) => authController.suspendUser(req, res, next));

export default router;
