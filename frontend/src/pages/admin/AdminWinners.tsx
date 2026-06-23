import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Gift, CheckCircle, XCircle, DollarSign, Clock, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { winnersApi } from '../../features/draws/drawsApi';
import { formatCurrency, formatDate, formatDrawMonth, getMatchLevelLabel } from '../../utils/formatters';
import type { WinnerClaim } from '../../types';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const claimBadge: Record<string, string> = {
  pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger',
};
const payBadge: Record<string, string> = {
  pending: 'badge-warning', paid: 'badge-success',
};

export default function AdminWinners() {
  const [statusFilter, setStatusFilter] = useState('');
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const qc = useQueryClient();

  const { data: res, isLoading } = useQuery({
    queryKey: ['admin-winners', statusFilter],
    queryFn: () => winnersApi.getAll({ status: statusFilter || undefined }),
  });
  const claims: WinnerClaim[] = res?.data ?? [];

  const reviewMut = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: 'approved' | 'rejected'; notes?: string }) =>
      winnersApi.review(id, status, notes),
    onSuccess: (_, vars) => {
      toast.success(`Claim ${vars.status}`);
      qc.invalidateQueries({ queryKey: ['admin-winners'] });
      qc.invalidateQueries({ queryKey: ['admin-analytics'] });
    },
    onError: () => toast.error('Action failed'),
  });

  const payMut = useMutation({
    mutationFn: winnersApi.markPaid,
    onSuccess: () => { toast.success('Marked as paid!'); qc.invalidateQueries({ queryKey: ['admin-winners'] }); },
    onError: () => toast.error('Failed to mark paid'),
  });

  const totalPending = claims.filter(c => c.claim_status === 'pending').length;
  const totalApproved = claims.filter(c => c.claim_status === 'approved').length;
  const totalPaid = claims.filter(c => c.payment_status === 'paid').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Winner Claims</h1>
        <p className="text-ink-muted text-sm mt-1">Review and process prize winner claims</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pending Review', value: totalPending, color: 'text-amber-500' },
          { label: 'Approved', value: totalApproved, color: 'text-success' },
          { label: 'Paid Out', value: totalPaid, color: 'text-brand' },
        ].map(s => (
          <div key={s.label} className="card text-center p-4">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-ink-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === tab.value ? 'bg-brand text-white' : 'bg-white border border-border text-ink-muted hover:border-brand/40'
            }`}
          >
            {tab.label}
            {tab.value === 'pending' && totalPending > 0 && (
              <span className="ml-2 w-5 h-5 rounded-full bg-white/20 inline-flex items-center justify-center text-xs">{totalPending}</span>
            )}
          </button>
        ))}
      </div>

      {/* Claims list */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
      ) : claims.length === 0 ? (
        <div className="card text-center py-16">
          <Gift className="w-12 h-12 text-border mx-auto mb-4" />
          <p className="text-ink-muted">No claims found for this filter</p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim, i) => (
            <motion.div key={claim.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card hover:shadow-elevated transition-all duration-200">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Claim Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="font-bold text-ink">{claim.draw ? formatDrawMonth(claim.draw.draw_month) : 'Draw'}</span>
                    <span className="badge badge-gold">{getMatchLevelLabel(claim.match_level)}</span>
                    <span className={`badge ${claimBadge[claim.claim_status]}`}>{claim.claim_status}</span>
                    <span className={`badge ${payBadge[claim.payment_status]}`}>{claim.payment_status}</span>
                  </div>

                  {claim.user && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-brand">{claim.user.full_name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{claim.user.full_name}</p>
                        <p className="text-xs text-ink-muted">{claim.user.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1 font-bold text-brand">
                      <DollarSign className="w-4 h-4" />{formatCurrency(claim.prize_amount)}
                    </span>
                    <span className="flex items-center gap-1 text-ink-muted">
                      <Clock className="w-4 h-4" />Submitted {formatDate(claim.created_at)}
                    </span>
                    {claim.proof_url && (
                      <div className="mt-3">
                        <p className="text-xs text-ink-muted mb-1.5 uppercase tracking-wider font-medium">Proof</p>
                        <a href={claim.proof_url} target="_blank" rel="noreferrer" className="group relative inline-block">
                          <img
                            src={claim.proof_url}
                            alt="Winner proof"
                            className="h-20 w-32 object-cover rounded-xl border border-border group-hover:border-brand transition-colors"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                          <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </a>
                      </div>
                    )}
                  </div>

                  {claim.admin_notes && (
                    <div className="mt-3 p-2 rounded-lg bg-surface text-xs text-ink-muted">
                      Note: {claim.admin_notes}
                    </div>
                  )}

                  {/* Notes for rejection */}
                  {claim.claim_status === 'pending' && (
                    <input
                      value={notesMap[claim.id] ?? ''}
                      onChange={e => setNotesMap(m => ({ ...m, [claim.id]: e.target.value }))}
                      placeholder="Admin notes (required for rejection)..."
                      className="input text-sm mt-3"
                    />
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col gap-2 lg:items-end justify-start">
                  {claim.claim_status === 'pending' && (
                    <>
                      <button
                        onClick={() => reviewMut.mutate({ id: claim.id, status: 'approved', notes: notesMap[claim.id] })}
                        disabled={reviewMut.isPending}
                        className="btn-primary btn-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => {
                          if (!notesMap[claim.id]) { toast.error('Add a rejection note first'); return; }
                          reviewMut.mutate({ id: claim.id, status: 'rejected', notes: notesMap[claim.id] });
                        }}
                        disabled={reviewMut.isPending}
                        className="btn-danger btn-sm"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}
                  {claim.claim_status === 'approved' && claim.payment_status === 'pending' && (
                    <button
                      onClick={() => payMut.mutate(claim.id)}
                      disabled={payMut.isPending}
                      className="btn-md bg-success text-white hover:bg-green-600 btn text-sm px-4 py-2 rounded-xl"
                    >
                      <DollarSign className="w-3.5 h-3.5" /> Mark Paid
                    </button>
                  )}
                  {claim.payment_status === 'paid' && (
                    <span className="text-xs text-success font-semibold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Paid {claim.paid_at ? formatDate(claim.paid_at) : ''}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
