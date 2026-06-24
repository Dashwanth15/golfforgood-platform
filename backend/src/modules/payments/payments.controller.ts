import { Request, Response, NextFunction } from 'express';
import { supabase } from '../../config/database';
import { envConfig } from '../../config/env';
import Stripe from 'stripe';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { subscriptionsService } from '../subscriptions/subscriptions.service';
import { EmailService } from '../../services/email.service';

let stripe: Stripe | null = null;
if (envConfig.STRIPE_ENABLED === 'true' && envConfig.STRIPE_SECRET_KEY) {
  stripe = new Stripe(envConfig.STRIPE_SECRET_KEY);
}

export class PaymentsController {
  async createCheckoutSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (envConfig.STRIPE_ENABLED !== 'true' || !stripe) {
        res.json({ success: true, stripeEnabled: false });
        return;
      }

      const { plan_id } = req.body;
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', plan_id)
        .single();

      if (!plan) {
        res.status(404).json({ success: false, message: 'Plan not found' });
        return;
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: plan.currency || 'gbp',
              product_data: {
                name: plan.name,
                description: `GolfForGood ${plan.name} Plan`,
              },
              unit_amount: Math.round(plan.price_amount * 100),
            },
            quantity: 1,
          },
        ],
        client_reference_id: req.user!.userId,
        metadata: {
          plan_id: plan.id,
          user_id: req.user!.userId,
        },
        success_url: `${envConfig.FRONTEND_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${envConfig.FRONTEND_URL}/subscribe/cancel`,
      });

      res.json({ success: true, stripeEnabled: true, url: session.url });
    } catch (err) {
      next(err);
    }
  }

  async webhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (envConfig.STRIPE_ENABLED !== 'true' || !stripe) {
        res.status(400).send('Stripe not enabled');
        return;
      }

      const sig = req.headers['stripe-signature'];
      if (!sig || !envConfig.STRIPE_WEBHOOK_SECRET) {
        res.status(400).send('Webhook Error: Missing signature or secret');
        return;
      }

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, envConfig.STRIPE_WEBHOOK_SECRET);
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === 'paid') {
          const user_id = session.metadata?.user_id || session.client_reference_id;
          const plan_id = session.metadata?.plan_id;

          if (!user_id || !plan_id) {
            console.error('Webhook Error: Missing user_id or plan_id in metadata');
            res.status(400).send('Webhook Error: Missing metadata');
            return;
          }

          const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
          const { data: existingSub } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', user_id)
            .eq('plan_id', plan_id)
            .eq('status', 'active')
            .gte('created_at', fifteenMinsAgo)
            .maybeSingle();

          if (existingSub) {
            console.log(`Webhook: Subscription already processed for user ${user_id}`);
            res.json({ received: true });
            return;
          }

          const sub = await subscriptionsService.purchaseSubscription(user_id, plan_id);

          if (sub) {
            const { data: user } = await supabase.from('users').select('full_name, email').eq('id', user_id).single();
            const { data: plan } = await supabase.from('subscription_plans').select('name').eq('id', plan_id).single();
            if (user && user.email && plan) {
              EmailService.sendSubscriptionActivated(
                { email: user.email, name: user.full_name.split(' ')[0] },
                plan.name,
                sub.start_date,
                sub.end_date,
                sub.renewal_date
              ).catch(e => console.error('Failed to send activation email:', e));
            }
          }
          console.log(`Webhook: Successfully processed payment for user ${user_id}`);
        }
      }

      res.json({ received: true });
    } catch (err) {
      next(err);
    }
  }
}

export const paymentsController = new PaymentsController();
