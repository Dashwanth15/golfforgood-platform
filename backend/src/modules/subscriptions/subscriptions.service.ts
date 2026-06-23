import { supabase } from '../../config/database';
import { NotFoundError } from '../../shared/errors/AppError';
import { APP_CONSTANTS } from '../../config/constants';

export class SubscriptionsService {
  async getPlans() {
    const { data } = await supabase
      .from('subscription_plans')
      .select('id, name, plan_type, price_amount, currency, duration_days')
      .eq('is_active', true);
    return data ?? [];
  }

  async getMySubscription(userId: string) {
    const { data } = await supabase
      .from('subscriptions')
      .select('*, plan:subscription_plans(name, plan_type, price_amount, currency)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    return data;
  }

  async purchaseSubscription(userId: string, planId: string) {
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();

    if (!plan) throw new NotFoundError('Subscription plan');

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration_days);

    // Cancel any existing active subscription
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('status', 'active');

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        renewal_date: endDate.toISOString().split('T')[0],
      })
      .select('*, plan:subscription_plans(name, plan_type, price_amount)')
      .single();

    if (error) throw new Error('Failed to create subscription');
    return data;
  }

  async cancelSubscription(userId: string, subscriptionId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('id', subscriptionId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) throw new NotFoundError('Subscription');
    return data;
  }

  async getAllSubscriptions(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const { data, count } = await supabase
      .from('subscriptions')
      .select('*, user:users(full_name, email), plan:subscription_plans(name, plan_type)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);
    return { subscriptions: data ?? [], total: count ?? 0 };
  }

  async updateSubscriptionStatus(id: string, status: string) {
    const { data } = await supabase
      .from('subscriptions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return data;
  }
}

export const subscriptionsService = new SubscriptionsService();
