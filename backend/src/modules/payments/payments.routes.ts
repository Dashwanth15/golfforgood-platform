import { Router } from 'express';
import express from 'express';
import { paymentsController } from './payments.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/create-checkout-session', authenticate, paymentsController.createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentsController.webhook);

export default router;
