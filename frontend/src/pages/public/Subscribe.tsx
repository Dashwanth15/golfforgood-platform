import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, CreditCard, Lock, Trophy, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { subscriptionApi } from '../../features/subscription/subscriptionApi';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { SubscriptionPlan } from '../../types';

export default function Subscribe() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [step, setStep] = useState<'plan' | 'payment' | 'success'>('plan');
  const navigate = useNavigate();

  const { data: plansRes, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: subscriptionApi.getPlans,
  });
  const plans = plansRes?.data ?? [];

  const { data: subRes } = useQuery({
    queryKey: ['my-subscription'],
    queryFn: subscriptionApi.getMySubscription,
  });
  const currentSub = subRes?.data;
  const isActive = currentSub?.status === 'active';

  const purchaseMut = useMutation({
    mutationFn: (planId: string) => subscriptionApi.purchase(planId),
    onSuccess: () => {
      setStep('success');
      setTimeout(() => navigate('/dashboard'), 2500);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Purchase failed');
    },
  });

  const handleProceed = () => {
    if (!selectedPlan) { toast.error('Please select a plan'); return; }
    if (isActive && selectedPlan === currentSub.plan_id) {
      toast.error('You are already on this plan');
      return;
    }
    setStep('payment');
  };

  const getContinueText = () => {
    if (!isActive) return 'Continue to Payment';
    if (selectedPlan === currentSub.plan_id) return 'Current Plan Selected';
    const targetPlan = plans.find((p: SubscriptionPlan) => p.id === selectedPlan);
    if (!targetPlan) return 'Continue to Payment';
    if (currentSub.plan?.plan_type === 'monthly' && targetPlan.plan_type === 'yearly') return 'Upgrade to Yearly';
    if (currentSub.plan?.plan_type === 'yearly' && targetPlan.plan_type === 'monthly') return 'Switch to Monthly';
    return 'Change Plan';
  };

  const handleMockPayment = () => {
    if (!selectedPlan) return;
    purchaseMut.mutate(selectedPlan);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center p-12"
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-success" />
          </motion.div>
          <h2 className="text-3xl font-bold text-ink mb-3">You're All Set! 🎉</h2>
          <p className="text-ink-muted">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-20">
      <div className="container-app py-12 max-w-4xl">
        <div className="text-center mb-12">
          <Trophy className="w-10 h-10 text-brand mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-ink mb-3">
            {step === 'plan' ? (isActive ? 'Manage Subscription' : 'Choose Your Plan') : 'Complete Your Subscription'}
          </h1>
          <p className="text-ink-muted">
            {step === 'plan' ? (isActive ? 'View your current plan or upgrade' : 'Start playing for good today') : 'Mock payment — no real charge'}
          </p>
        </div>

        {step === 'plan' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {isLoading ? (
              <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
            ) : (
              <>
                {isActive && currentSub.plan && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-ink mb-4">Current Plan</h2>
                    <div className="card border-2 border-brand/20 bg-brand/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4">
                        <span className="badge badge-success flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Active Subscription
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <div>
                          <p className="text-sm text-ink-muted font-medium mb-1">Status</p>
                          <p className="font-bold text-ink capitalize">{currentSub.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-ink-muted font-medium mb-1">Plan</p>
                          <p className="font-bold text-ink">{currentSub.plan.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-ink-muted font-medium mb-1">Start Date</p>
                          <p className="font-bold text-ink">{formatDate(currentSub.start_date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-ink-muted font-medium mb-1">Renewal Date</p>
                          <p className="font-bold text-ink">{formatDate(currentSub.renewal_date || currentSub.end_date)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {isActive && <h2 className="text-xl font-bold text-ink mb-4">Upgrade Plan</h2>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {plans.map((plan: SubscriptionPlan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`card text-left transition-all duration-200 cursor-pointer ${
                      selectedPlan === plan.id
                        ? 'border-2 border-brand shadow-brand'
                        : 'border border-border hover:border-brand/40 hover:shadow-elevated'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-ink">{plan.name}</h3>
                        <span className="badge badge-brand">{plan.plan_type}</span>
                      </div>
                      {selectedPlan === plan.id && (
                        <CheckCircle className="w-6 h-6 text-brand" />
                      )}
                    </div>
                    <div className="text-3xl font-black text-ink mb-1">
                      {formatCurrency(plan.price_amount, plan.currency)}
                      <span className="text-sm font-normal text-ink-muted">
                        /{plan.plan_type === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>
                    {plan.plan_type === 'yearly' && (
                      <p className="text-xs text-success font-semibold mb-3">Save £19.89 vs monthly</p>
                    )}
                    <ul className="space-y-2 mt-4">
                      {(plan.features ?? []).map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm text-ink-muted">
                          <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
              <button 
                onClick={handleProceed} 
                className={`btn-lg w-full max-w-sm mx-auto flex justify-center ${isActive && selectedPlan === currentSub?.plan_id ? 'bg-border text-ink-muted cursor-not-allowed' : 'btn-primary'}`}
                disabled={isActive && selectedPlan === currentSub?.plan_id}
              >
                {getContinueText()}
              </button>
              </>
            )}
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-md mx-auto">
            <div className="card mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Mock Payment</h3>
                  <p className="text-xs text-ink-muted">Demo environment — no real charge</p>
                </div>
                <Lock className="w-4 h-4 text-ink-muted ml-auto" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Card Number</label>
                  <input className="input" value="4242 4242 4242 4242" readOnly />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Expiry</label>
                    <input className="input" value="12/28" readOnly />
                  </div>
                  <div>
                    <label className="label">CVC</label>
                    <input className="input" value="424" readOnly />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 bg-surface rounded-xl text-xs text-ink-muted flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-brand" />
                This is a demo. Architecture supports real Stripe integration.
              </div>
            </div>

            <button
              onClick={handleMockPayment}
              disabled={purchaseMut.isPending}
              className="btn-primary btn-lg w-full"
            >
              {purchaseMut.isPending
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                : 'Activate Subscription'
              }
            </button>
            <button onClick={() => setStep('plan')} className="btn-ghost btn-md w-full mt-3">
              ← Back to Plans
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
