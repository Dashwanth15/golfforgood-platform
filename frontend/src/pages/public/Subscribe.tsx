import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Loader2, CreditCard, Lock, Trophy, Zap,
  XCircle, RefreshCw, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../../features/subscription/subscriptionApi';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { SubscriptionPlan } from '../../types';

// ── Helpers ───────────────────────────────────────────────────────────────
function daysUntil(dateStr: string | null | undefined): number {
  if (!dateStr) return Infinity;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function Subscribe() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [step, setStep] = useState<'plan' | 'payment' | 'success'>('plan');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── Data fetching ─────────────────────────────────────────────────────
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
  const isActive   = currentSub?.status === 'active';
  const isExpired  = currentSub?.status === 'expired';
  const isCancelled = currentSub?.status === 'cancelled';

  // Days until renewal (expiry warning)
  const renewalDays = daysUntil(currentSub?.renewal_date || currentSub?.end_date);
  const isExpiringSoon = isActive && renewalDays <= 7 && renewalDays > 0;

  // ── Mutations ─────────────────────────────────────────────────────────
  const purchaseMut = useMutation({
    mutationFn: (planId: string) => subscriptionApi.createCheckoutSession(planId),
    onSuccess: (data) => {
      if (data.stripeEnabled && data.url) {
        window.location.href = data.url;
      } else {
        subscriptionApi.purchase(selectedPlan!)
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
            setStep('success');
            setTimeout(() => navigate('/dashboard'), 2500);
          })
          .catch((err) => {
            toast.error(err.response?.data?.message || 'Purchase failed');
          });
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Payment initiation failed');
    },
  });

  const cancelMut = useMutation({
    mutationFn: () => subscriptionApi.cancel(currentSub!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
      setShowCancelConfirm(false);
      toast.success('Subscription cancelled successfully.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to cancel subscription');
    },
  });

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleProceed = () => {
    if (!selectedPlan) { toast.error('Please select a plan'); return; }
    if (isActive && selectedPlan === currentSub?.plan_id) {
      toast.error('You are already on this plan');
      return;
    }
    setStep('payment');
  };

  const handlePayment = () => {
    if (!selectedPlan) return;
    purchaseMut.mutate(selectedPlan);
  };

  const getContinueText = () => {
    if (!isActive && !isExpired && !isCancelled) return 'Continue to Payment';
    if (isExpired || isCancelled) return 'Renew Subscription';
    if (selectedPlan === currentSub?.plan_id) return 'Current Plan Selected';
    const targetPlan = plans.find((p: SubscriptionPlan) => p.id === selectedPlan);
    if (!targetPlan) return 'Continue to Payment';
    if (currentSub?.plan?.plan_type === 'monthly' && targetPlan.plan_type === 'yearly') return 'Upgrade to Yearly';
    if (currentSub?.plan?.plan_type === 'yearly'  && targetPlan.plan_type === 'monthly') return 'Switch to Monthly';
    return 'Change Plan';
  };

  // ── Success Screen ────────────────────────────────────────────────────
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

        {/* ── Page Header ──────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <Trophy className="w-10 h-10 text-brand mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-ink mb-3">
            {step === 'plan'
              ? (isActive ? 'Manage Subscription' : (isExpired || isCancelled) ? 'Renew Your Subscription' : 'Choose Your Plan')
              : 'Complete Your Subscription'}
          </h1>
          <p className="text-ink-muted">
            {step === 'plan'
              ? (isActive ? 'View your current plan or upgrade' : (isExpired || isCancelled) ? 'Pick a plan to get back in the game' : 'Start playing for good today')
              : 'Mock payment — no real charge'}
          </p>
        </div>

        {/* ── Expiry Warning Banner (active, ≤7 days) ──────────────── */}
        <AnimatePresence>
          {isExpiringSoon && step === 'plan' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3"
            >
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">
                  Your subscription expires in {renewalDays} day{renewalDays !== 1 ? 's' : ''}
                </p>
                <p className="text-amber-700 text-xs mt-0.5">
                  Renew now to keep your draw entries and charity contributions active without interruption.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Expired / Cancelled Banner ───────────────────────────── */}
        <AnimatePresence>
          {(isExpired || isCancelled) && step === 'plan' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-8 p-5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3"
            >
              <XCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-800 text-sm">
                  {isExpired ? 'Your subscription has expired' : 'Your subscription was cancelled'}
                </p>
                <p className="text-red-700 text-xs mt-0.5">
                  {isExpired
                    ? `Expired on ${formatDate(currentSub?.end_date)}. Select a plan below to renew and regain access.`
                    : `Cancelled on ${formatDate(currentSub?.end_date)}. Select a plan below to reactivate.`}
                </p>
              </div>
              <RefreshCw className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Plan Step ─────────────────────────────────────────────── */}
        {step === 'plan' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {isLoading ? (
              <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
            ) : (
              <>
                {/* Current Plan Card (active only) */}
                {isActive && currentSub?.plan && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-ink mb-4">Current Plan</h2>
                    <div className="card border-2 border-brand/20 bg-brand/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4">
                        <span className="badge badge-success flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Active Subscription
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6 flex-wrap">
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

                      {/* Cancel Subscription button */}
                      <div className="mt-5 pt-5 border-t border-brand/10">
                        {!showCancelConfirm ? (
                          <button
                            onClick={() => setShowCancelConfirm(true)}
                            className="text-sm text-danger hover:text-red-700 font-medium flex items-center gap-1.5 transition-colors"
                          >
                            <XCircle className="w-4 h-4" /> Cancel Subscription
                          </button>
                        ) : (
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                              className="p-4 rounded-xl bg-red-50 border border-red-200"
                            >
                              <p className="text-sm font-semibold text-red-800 mb-1">Are you sure?</p>
                              <p className="text-xs text-red-600 mb-3">
                                You will lose access to draws and charity contributions at the end of your current period ({formatDate(currentSub.end_date)}).
                              </p>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => cancelMut.mutate()}
                                  disabled={cancelMut.isPending}
                                  className="btn-danger btn-sm flex items-center gap-1.5"
                                >
                                  {cancelMut.isPending
                                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Cancelling...</>
                                    : 'Yes, Cancel'}
                                </button>
                                <button
                                  onClick={() => setShowCancelConfirm(false)}
                                  className="btn-ghost btn-sm"
                                >
                                  Keep Subscription
                                </button>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section heading */}
                {isActive && <h2 className="text-xl font-bold text-ink mb-4">Upgrade Plan</h2>}
                {(isExpired || isCancelled) && <h2 className="text-xl font-bold text-ink mb-4">Select a Plan to Renew</h2>}

                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {plans.map((plan: SubscriptionPlan) => {
                    const isCurrent = isActive && plan.id === currentSub?.plan_id;
                    return (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`card text-left transition-all duration-200 cursor-pointer relative ${
                          selectedPlan === plan.id
                            ? 'border-2 border-brand shadow-brand'
                            : 'border border-border hover:border-brand/40 hover:shadow-elevated'
                        }`}
                      >
                        {isCurrent && (
                          <span className="absolute top-3 right-3 badge badge-brand text-xs">Current</span>
                        )}
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
                    );
                  })}
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleProceed}
                  className={`btn-lg w-full max-w-sm mx-auto flex justify-center ${
                    isActive && selectedPlan === currentSub?.plan_id
                      ? 'bg-border text-ink-muted cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                  disabled={isActive && selectedPlan === currentSub?.plan_id}
                >
                  {getContinueText()}
                </button>
              </>
            )}
          </motion.div>
        )}

        {/* ── Payment Step ──────────────────────────────────────────── */}
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
              onClick={handlePayment}
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
