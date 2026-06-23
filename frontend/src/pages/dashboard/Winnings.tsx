import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, Loader2, Upload, CheckCircle, Clock, XCircle, Trophy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { winnersApi } from '../../features/draws/drawsApi';
import { formatCurrency, formatDate, formatDrawMonth, getMatchLevelLabel } from '../../utils/formatters';
import type { WinnerClaim } from '../../types';

const claimIcons: Record<string, any> = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};
const claimColors: Record<string, string> = {
  pending: 'text-amber-500 bg-amber-50',
  approved: 'text-success bg-green-50',
  rejected: 'text-danger bg-red-50',
};

function ClaimCard({ claim }: { claim: WinnerClaim }) {
  const [proofUrl, setProofUrl] = useState('');
  const [showProof, setShowProof] = useState(false);
  const qc = useQueryClient();

  const uploadMut = useMutation({
    mutationFn: () => winnersApi.uploadProof(claim.id, proofUrl),
    onSuccess: () => {
      toast.success('Proof submitted!');
      qc.invalidateQueries({ queryKey: ['my-winnings'] });
      setShowProof(false);
    },
    onError: () => toast.error('Failed to submit proof'),
  });

  const StatusIcon = claimIcons[claim.claim_status] ?? Clock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-elevated transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-bold text-ink text-lg">
            {claim.draw ? formatDrawMonth(claim.draw.draw_month) : 'Draw'}
          </h3>
          <span className="badge badge-gold mt-1">{getMatchLevelLabel(claim.match_level)}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${claimColors[claim.claim_status]}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {claim.claim_status.charAt(0).toUpperCase() + claim.claim_status.slice(1)}
        </div>
      </div>

      {/* Prize amount */}
      <div className="p-4 rounded-2xl bg-gold-light border border-gold/30 mb-5">
        <p className="text-xs text-ink-muted mb-1">Prize Amount</p>
        <p className="text-3xl font-black text-gold-hover">{formatCurrency(claim.prize_amount)}</p>
      </div>

      {/* Draw numbers */}
      {claim.draw?.winning_numbers && (
        <div className="mb-4">
          <p className="text-xs text-ink-muted mb-2 uppercase tracking-wider font-medium">Winning Numbers</p>
          <div className="flex gap-2 flex-wrap">
            {claim.draw.winning_numbers.map(n => (
              <div key={n} className="w-10 h-10 rounded-full bg-gold/20 border-2 border-gold text-gold-hover flex items-center justify-center text-sm font-bold">
                {n}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status messages */}
      {claim.claim_status === 'approved' && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-800 mb-4">
          ✅ Claim approved. Payment status: <strong>{claim.payment_status}</strong>
          {claim.paid_at && ` — Paid on ${formatDate(claim.paid_at)}`}
        </div>
      )}
      {claim.claim_status === 'rejected' && claim.admin_notes && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800 mb-4">
          ❌ Rejected: {claim.admin_notes}
        </div>
      )}

      {/* Upload proof */}
      {claim.claim_status === 'pending' && (
        <div>
          {claim.proof_url ? (
            <a href={claim.proof_url} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm text-brand hover:underline">
              <ExternalLink className="w-4 h-4" /> View submitted proof
            </a>
          ) : (
            showProof ? (
              <div className="space-y-3">
                <input
                  value={proofUrl}
                  onChange={e => setProofUrl(e.target.value)}
                  placeholder="Enter proof URL (doc / image link)"
                  className="input text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => uploadMut.mutate()}
                    disabled={!proofUrl || uploadMut.isPending}
                    className="btn-primary btn-sm"
                  >
                    {uploadMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    Submit
                  </button>
                  <button onClick={() => setShowProof(false)} className="btn-ghost btn-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowProof(true)} className="btn-secondary btn-sm">
                <Upload className="w-3.5 h-3.5" /> Upload Proof
              </button>
            )
          )}
        </div>
      )}

      <p className="text-xs text-ink-muted mt-4">Won on {formatDate(claim.created_at)}</p>
    </motion.div>
  );
}

export default function Winnings() {
  const { data: res, isLoading } = useQuery({
    queryKey: ['my-winnings'],
    queryFn: winnersApi.getMyWinnings,
  });
  const claims = res?.data ?? [];

  const totalWon = claims
    .filter(c => c.claim_status === 'approved')
    .reduce((sum, c) => sum + Number(c.prize_amount), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">My Winnings</h1>
        <p className="text-ink-muted text-sm mt-1">Your prize claims and payment status</p>
      </div>

      {/* Total Won */}
      {totalWon > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="card bg-gold-gradient text-white mb-8"
        >
          <div className="flex items-center gap-4">
            <Trophy className="w-10 h-10 text-white" />
            <div>
              <p className="text-white/70 text-sm">Total Winnings (Approved)</p>
              <p className="text-3xl font-black">{formatCurrency(totalWon)}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats row */}
      {claims.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Claims', value: claims.length, color: 'text-ink' },
            { label: 'Approved', value: claims.filter(c => c.claim_status === 'approved').length, color: 'text-success' },
            { label: 'Pending', value: claims.filter(c => c.claim_status === 'pending').length, color: 'text-amber-500' },
          ].map(s => (
            <div key={s.label} className="card text-center">
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-ink-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Claims */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
      ) : claims.length === 0 ? (
        <div className="card text-center py-16">
          <Award className="w-12 h-12 text-border mx-auto mb-4" />
          <h3 className="font-bold text-ink mb-2">No winnings yet</h3>
          <p className="text-sm text-ink-muted">Keep entering draws — your next win could be this month!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {claims.map(c => <ClaimCard key={c.id} claim={c} />)}
        </div>
      )}
    </div>
  );
}
