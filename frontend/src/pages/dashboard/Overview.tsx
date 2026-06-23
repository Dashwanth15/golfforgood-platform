import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Heart, Ticket, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { subscriptionApi } from '../../features/subscription/subscriptionApi';
import { scoresApi } from '../../features/scores/scoresApi';
import { charitiesApi } from '../../features/charities/charitiesApi';
import { drawsApi } from '../../features/draws/drawsApi';
import { formatDate } from '../../utils/formatters';

function KPICard({ icon: Icon, label, value, sub, color, href }: any) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Link to={href} className="card flex items-start gap-4 hover:shadow-elevated transition-all duration-300 group block">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-ink-muted mb-1">{label}</p>
          <p className="text-2xl font-bold text-ink truncate">{value}</p>
          {sub && <p className="text-xs text-ink-muted mt-1">{sub}</p>}
        </div>
        <ArrowRight className="w-4 h-4 text-border group-hover:text-brand group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
      </Link>
    </motion.div>
  );
}

export default function DashboardOverview() {
  const { user } = useAuthStore();

  const { data: subRes } = useQuery({ queryKey: ['my-subscription'], queryFn: subscriptionApi.getMySubscription });
  const { data: scoresRes } = useQuery({ queryKey: ['my-scores'], queryFn: scoresApi.getMyScores });
  const { data: selectionRes } = useQuery({ queryKey: ['my-charity-selection'], queryFn: charitiesApi.getMySelection });
  const { data: upcomingRes } = useQuery({ queryKey: ['upcoming-draw'], queryFn: drawsApi.getUpcoming });

  const sub = subRes?.data;
  const scores = scoresRes?.data ?? [];
  const selection = selectionRes?.data;
  const upcoming = upcomingRes?.data;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">{greeting}, {user?.full_name?.split(' ')[0]}! 👋</h1>
        <p className="text-ink-muted mt-1">Here's your GolfForGood summary</p>
      </div>

      {/* Subscription Alert */}
      {(!sub || sub.status !== 'active') && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            {sub ? 'Your subscription is inactive. ' : "You don't have an active subscription. "}
            <Link to="/subscribe" className="font-semibold underline">Subscribe now</Link> to participate in draws and donate.
          </p>
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          icon={CheckCircle} label="Subscription" 
          color={!sub ? 'bg-border' : sub.status === 'active' ? 'bg-success' : sub.status === 'expired' ? 'bg-amber-500' : 'bg-danger'}
          value={sub ? sub.status.toUpperCase() : 'NONE'}
          sub={sub ? `${sub.status === 'active' ? 'Renews' : 'Ended'} ${formatDate(sub.renewal_date ?? sub.end_date)}` : 'No active plan'}
          href="/subscribe"
        />
        <KPICard
          icon={Target} label="Scores Logged" color="bg-brand"
          value={scores.length + ' / 5'}
          sub={scores[0] ? `Last: ${scores[0].score_value} pts on ${formatDate(scores[0].score_date)}` : 'No scores yet'}
          href="/dashboard/scores"
        />
        <KPICard
          icon={Heart} label="My Charity" color="bg-[#2563EB]"
          value={selection ? `${selection.contribution_pct}%` : 'None'}
          sub={selection?.charity?.name ?? 'Select a charity'}
          href="/dashboard/charity"
        />
        <KPICard
          icon={Ticket} label="Next Draw" color="bg-gold"
          value={upcoming ? `${upcoming.daysUntilDraw}d` : '—'}
          sub={upcoming ? `Draw: ${formatDate(upcoming.nextDrawDate)}` : 'Loading...'}
          href="/dashboard/draws"
        />
      </div>

      {/* Scores + Draw Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Latest Scores */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-ink">Your Score Window</h2>
              <p className="text-xs text-ink-muted mt-0.5">Latest 5 scores — your draw numbers</p>
            </div>
            <Link to="/dashboard/scores" className="text-xs text-brand font-semibold hover:underline">Manage</Link>
          </div>

          {scores.length > 0 ? (
            <div className="space-y-3">
              {scores.map((score, i) => (
                <motion.div
                  key={score.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center font-bold text-brand">
                    {score.score_value}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">{score.score_value} points</span>
                      {i === 0 && <span className="badge badge-success text-xs">Latest</span>}
                    </div>
                    <span className="text-xs text-ink-muted">{formatDate(score.score_date)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-10 h-10 text-border mx-auto mb-3" />
              <p className="text-sm text-ink-muted mb-4">No scores logged yet</p>
              <Link to="/dashboard/scores" className="btn-primary btn-sm">Add Your First Score</Link>
            </div>
          )}
        </div>

        {/* Draw Entry Preview */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-ink">Draw Entry Numbers</h2>
              <p className="text-xs text-ink-muted mt-0.5">Your scores become your lottery numbers</p>
            </div>
            <Link to="/dashboard/draws" className="text-xs text-brand font-semibold hover:underline">View Draws</Link>
          </div>

          {scores.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-3 mb-6">
                {scores.map((score, i) => (
                  <motion.div
                    key={score.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: i * 0.08 }}
                    className="draw-ball-gold"
                  >
                    {score.score_value}
                  </motion.div>
                ))}
                {Array.from({ length: Math.max(0, 5 - scores.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="draw-ball draw-ball-default border-dashed opacity-40">?</div>
                ))}
              </div>
              {upcoming && (
                <div className="p-3 rounded-xl bg-surface text-sm text-ink-muted flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand flex-shrink-0" />
                  Next draw in <span className="font-bold text-brand">{upcoming.daysUntilDraw} days</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Ticket className="w-10 h-10 text-border mx-auto mb-3" />
              <p className="text-sm text-ink-muted">Add scores to get your draw numbers</p>
            </div>
          )}
        </div>
      </div>

      {/* Charity Selection Prompt */}
      {!selection && (
        <div className="card border border-brand/20 bg-brand/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-ink">Choose Your Charity</h3>
              <p className="text-sm text-ink-muted mt-1">Select a charity to receive your 10%+ contribution from every subscription payment.</p>
            </div>
            <Link to="/dashboard/charity" className="btn-primary btn-md flex-shrink-0">Select <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      )}
    </div>
  );
}
