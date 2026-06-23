import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Ticket, Clock } from 'lucide-react';
import { drawsApi } from '../../features/draws/drawsApi';
import { scoresApi } from '../../features/scores/scoresApi';
import { formatDrawMonth, formatDate, getMatchLevelLabel } from '../../utils/formatters';
import type { Draw } from '../../types';

function DrawBall({ n, highlight }: { n: number; highlight?: boolean }) {
  return (
    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border-2 shadow-sm
      ${highlight ? 'bg-gold border-gold-hover text-white shadow-gold' : 'bg-surface border-border text-ink'}`}>
      {n}
    </div>
  );
}

function DrawCard({ draw, userNumbers }: { draw: Draw; userNumbers: number[] }) {
  const winning = draw.winning_numbers ?? [];
  const matches = userNumbers.filter(n => winning.includes(n));

  const matchLabel =
    matches.length === 5 ? '🏆 5-Match Jackpot!' :
    matches.length === 4 ? '🎯 4-Match Winner!' :
    matches.length === 3 ? '✅ 3-Match Winner!' : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${matchLabel ? 'border-2 border-gold shadow-gold/20' : ''}`}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-bold text-ink">{formatDrawMonth(draw.draw_month)}</h3>
          <span className={`badge mt-1 ${draw.status === 'published' ? 'badge-success' : 'badge-blue'}`}>
            {draw.status}
          </span>
        </div>
        {matchLabel && (
          <span className="badge badge-gold text-xs px-3 py-1">{matchLabel}</span>
        )}
      </div>

      {/* Winning numbers */}
      <div className="mb-5">
        <p className="text-xs text-ink-muted mb-3 font-medium uppercase tracking-wider">Winning Numbers</p>
        <div className="flex flex-wrap gap-2">
          {winning.length > 0
            ? winning.map(n => <DrawBall key={n} n={n} highlight={userNumbers.includes(n)} />)
            : Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-11 h-11 rounded-full border-2 border-dashed border-border flex items-center justify-center text-ink-subtle text-sm">?</div>
              ))
          }
        </div>
      </div>

      {/* Your entries */}
      {userNumbers.length > 0 && (
        <div className="p-3 rounded-xl bg-surface">
          <p className="text-xs text-ink-muted mb-2 font-medium">Your Entry Numbers</p>
          <div className="flex flex-wrap gap-2">
            {userNumbers.map(n => (
              <div key={n} className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border ${
                winning.includes(n) ? 'bg-gold/20 border-gold text-gold-hover' : 'bg-white border-border text-ink'
              }`}>{n}</div>
            ))}
          </div>
          {matches.length > 0 && (
            <p className="text-xs text-brand font-semibold mt-2">
              {matches.length} match{matches.length > 1 ? 'es' : ''}: {matches.join(', ')}
            </p>
          )}
        </div>
      )}

      {/* Prize pools */}
      {draw.prize_pools && draw.prize_pools.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium text-ink-muted mb-3 uppercase tracking-wider">Prize Pools</p>
          <div className="space-y-2">
            {draw.prize_pools.map(pool => (
              <div key={pool.id} className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">{getMatchLevelLabel(pool.match_level)}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand">£{Number(pool.pool_amount).toFixed(2)}</span>
                  {pool.per_winner_amount && (
                    <span className="text-xs text-ink-muted">(£{Number(pool.per_winner_amount).toFixed(2)}/winner)</span>
                  )}
                  {pool.rolled_over && <span className="badge badge-warning text-xs">Rolled Over</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function Draws() {
  const { data: drawsRes, isLoading: drawsLoading } = useQuery({
    queryKey: ['published-draws'],
    queryFn: drawsApi.getPublished,
  });
  const { data: scoresRes } = useQuery({
    queryKey: ['my-scores'],
    queryFn: scoresApi.getMyScores,
  });
  const { data: upcomingRes } = useQuery({
    queryKey: ['upcoming-draw'],
    queryFn: drawsApi.getUpcoming,
  });

  const draws = drawsRes?.data ?? [];
  const userNumbers = (scoresRes?.data ?? []).map(s => s.score_value);
  const upcoming = upcomingRes?.data;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Monthly Draws</h1>
        <p className="text-ink-muted text-sm mt-1">Your draw history and upcoming results</p>
      </div>

      {/* Upcoming Draw Banner */}
      {upcoming && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="card bg-hero-gradient text-white mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Next Draw</p>
                <p className="text-2xl font-black">{upcoming.daysUntilDraw} days away</p>
                <p className="text-white/60 text-sm">{formatDate(upcoming.nextDrawDate)}</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-white/70 text-xs mb-1">Your entry numbers</p>
              <div className="flex gap-2">
                {userNumbers.length > 0
                  ? userNumbers.map(n => (
                      <div key={n} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{n}</div>
                    ))
                  : <span className="text-white/50 text-sm">Add scores for entry</span>
                }
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Draws List */}
      {drawsLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
      ) : draws.length === 0 ? (
        <div className="card text-center py-16">
          <Ticket className="w-12 h-12 text-border mx-auto mb-4" />
          <h3 className="font-bold text-ink mb-2">No draws published yet</h3>
          <p className="text-sm text-ink-muted">Check back after the next draw date</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {draws.map(draw => (
            <DrawCard key={draw.id} draw={draw} userNumbers={userNumbers} />
          ))}
        </div>
      )}
    </div>
  );
}
