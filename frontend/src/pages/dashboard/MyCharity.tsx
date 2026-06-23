import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, CheckCircle, Loader2, Users, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { charitiesApi } from '../../features/charities/charitiesApi';
import { subscriptionApi } from '../../features/subscription/subscriptionApi';
import type { Charity } from '../../types';
import { formatCurrency } from '../../utils/formatters';

const CATEGORY_COLORS: Record<string, string> = {
  environment: 'badge-success',
  education:   'badge-blue',
  health:      'badge-danger',
  community:   'badge-brand',
  sports:      'badge-gold',
  other:       'badge-warning',
};

export default function MyCharity() {
  const [selected, setSelected] = useState<Charity | null>(null);
  const [pct, setPct] = useState<number>(10);
  const qc = useQueryClient();

  const { data: charitiesRes, isLoading } = useQuery({
    queryKey: ['charities'],
    queryFn: () => charitiesApi.getAll({ limit: 20 }),
  });
  const { data: selectionRes, isLoading: selLoading } = useQuery({
    queryKey: ['my-charity-selection'],
    queryFn: charitiesApi.getMySelection,
  });
  const { data: subRes } = useQuery({ queryKey: ['my-subscription'], queryFn: () => subscriptionApi.getMySubscription() });

  const charities = charitiesRes?.data ?? [];
  const currentSelection = selectionRes?.data;
  const sub = subRes?.data;
  const isInactive = !sub || sub.status !== 'active';

  const saveMut = useMutation({
    mutationFn: () => charitiesApi.setMySelection({ charity_id: selected!.id, contribution_pct: pct }),
    onSuccess: () => {
      toast.success('Charity selection saved!');
      qc.invalidateQueries({ queryKey: ['my-charity-selection'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Failed to save'),
  });

  const handleSave = () => {
    if (!selected) { toast.error('Please select a charity'); return; }
    saveMut.mutate();
  };

  if (isLoading || selLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">My Charity</h1>
        <p className="text-ink-muted text-sm mt-1">Choose the cause your subscription supports</p>
      </div>

      {isInactive && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            You need an active subscription to save your charity selection.
          </p>
        </div>
      )}

      {/* Current Selection */}
      {currentSelection && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="card border-2 border-brand/30 bg-brand/5 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-ink">{currentSelection.charity.name}</h3>
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              <p className="text-sm text-ink-muted">
                You contribute <span className="font-bold text-brand">{currentSelection.contribution_pct}%</span> of your subscription to this charity
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-brand">{currentSelection.contribution_pct}%</div>
              <div className="text-xs text-ink-muted">contribution</div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charity Grid */}
        <div className="lg:col-span-2">
          <h2 className="font-bold text-ink mb-4">Select a Charity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {charities.map((charity, i) => (
              <motion.button
                key={charity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(charity)}
                className={`card text-left transition-all duration-200 cursor-pointer relative ${
                  selected?.id === charity.id || currentSelection?.charity?.id === charity.id
                    ? 'border-2 border-brand shadow-brand/20 shadow-lg'
                    : 'border border-border hover:border-brand/40 hover:shadow-elevated'
                }`}
              >
                {(selected?.id === charity.id || (!selected && currentSelection?.charity?.id === charity.id)) && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-5 h-5 text-brand" />
                  </div>
                )}
                {charity.is_featured && (
                  <span className="badge badge-gold mb-3">⭐ Featured</span>
                )}
                {!charity.is_featured && (
                  <span className={`badge ${CATEGORY_COLORS[charity.category]} mb-3 capitalize`}>
                    {charity.category}
                  </span>
                )}
                <h3 className="font-bold text-ink mb-2 pr-6">{charity.name}</h3>
                <p className="text-xs text-ink-muted leading-relaxed mb-4 line-clamp-2">
                  {charity.short_bio || charity.description}
                </p>
                <div className="flex items-center justify-between text-xs text-ink-muted pt-3 border-t border-border">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-brand" />
                    {formatCurrency(charity.total_raised)} raised
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {charity.donor_count.toLocaleString()} donors
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Contribution Panel */}
        <div className="space-y-4">
          <div className="card sticky top-8">
            <h3 className="font-bold text-ink mb-6">Contribution Settings</h3>

            {selected ? (
              <>
                <div className="p-3 rounded-xl bg-surface mb-6">
                  <p className="text-xs text-ink-muted mb-1">Selected charity</p>
                  <p className="font-semibold text-ink">{selected.name}</p>
                  <span className={`badge ${CATEGORY_COLORS[selected.category]} mt-1 capitalize`}>
                    {selected.category}
                  </span>
                </div>
              </>
            ) : (
              <div className="p-4 rounded-xl bg-surface mb-6 text-center">
                <Heart className="w-8 h-8 text-border mx-auto mb-2" />
                <p className="text-sm text-ink-muted">Select a charity from the left</p>
              </div>
            )}

            <div className="mb-6">
              <label className="label">Contribution Rate</label>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-ink-muted">Minimum 10%</span>
                <span className="text-2xl font-black text-brand">{pct}%</span>
              </div>
              <input
                type="range" min={10} max={100} step={5} value={pct}
                onChange={e => setPct(Number(e.target.value))}
                className="w-full accent-brand h-2 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-ink-muted mt-1">
                <span>10%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Impact preview */}
            <div className="p-3 rounded-xl bg-brand/5 border border-brand/20 mb-6">
              <p className="text-xs font-semibold text-brand mb-2">Monthly Impact Preview</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-bold text-ink">£{(9.99 * pct / 100).toFixed(2)}</div>
                  <div className="text-xs text-ink-muted">to charity</div>
                </div>
                <div>
                  <div className="font-bold text-ink">£{(9.99 * (100 - pct) / 100).toFixed(2)}</div>
                  <div className="text-xs text-ink-muted">to prize pool</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!selected || saveMut.isPending || isInactive}
              className="btn-primary btn-md w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
              {currentSelection ? 'Update Selection' : 'Save Selection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
