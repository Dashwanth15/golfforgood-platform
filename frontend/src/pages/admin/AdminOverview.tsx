import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, CreditCard, Heart, Ticket, Gift, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../features/draws/drawsApi';


function StatCard({ icon: Icon, label, value, sub, color, href }: any) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Link to={href} className="card flex items-center gap-4 hover:shadow-elevated transition-all duration-300 group block">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-black text-ink">{value}</p>
          {sub && <p className="text-xs text-ink-muted mt-0.5">{sub}</p>}
        </div>
        <ArrowRight className="w-4 h-4 text-border group-hover:text-brand group-hover:translate-x-1 transition-all flex-shrink-0" />
      </Link>
    </motion.div>
  );
}

export default function AdminOverview() {
  const { data: res, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: adminApi.getAnalytics,
    refetchInterval: 30000,
  });
  const stats = res?.data;

  if (isLoading) {
    return <div className="flex justify-center py-24"><Loader2 className="w-9 h-9 animate-spin text-brand" /></div>;
  }

  const kpis = [
    { icon: Users,    label: 'Total Users',          value: stats?.totalUsers ?? 0,         color: 'bg-[#2563EB]', href: '/admin/users' },
    { icon: CreditCard, label: 'Active Subscriptions', value: stats?.activeSubscriptions ?? 0, color: 'bg-brand',     href: '/admin/subscriptions', sub: `£${stats?.totalRevenue ?? 0} MRR` },
    { icon: Heart,    label: 'Partner Charities',    value: stats?.totalCharities ?? 0,     color: 'bg-success',   href: '/admin/charities' },
    { icon: Ticket,   label: 'Total Prize Pool',     value: `£${stats?.totalPrizePool ?? 0}`, color: 'bg-gold',    href: '/admin/draws' },
    { icon: Gift,     label: 'Pending Claims',       value: stats?.pendingClaims ?? 0,      color: 'bg-amber-500', href: '/admin/winners' },
    { icon: Heart,    label: 'Total Donations',      value: stats?.totalDonations ?? 0,     color: 'bg-[#047857]', href: '/admin/charities', sub: `£${stats?.totalDonatedAmount ?? 0} Donated` },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Admin Dashboard</h1>
        <p className="text-ink-muted text-sm mt-1">Platform overview and key metrics</p>
      </div>

      {/* Pending claims alert */}
      {stats && Number(stats.pendingClaims) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 flex-1">
            <strong>{stats.pendingClaims} winner claim{Number(stats.pendingClaims) > 1 ? 's' : ''}</strong> awaiting review.
          </p>
          <Link to="/admin/winners" className="btn-md bg-amber-600 text-white hover:bg-amber-700 btn text-sm px-4 py-2 rounded-xl">
            Review Now
          </Link>
        </motion.div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <StatCard {...kpi} value={String(kpi.value)} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="font-bold text-ink mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Create Draw', href: '/admin/draws', icon: Ticket, color: 'btn-primary' },
            { label: 'Review Claims', href: '/admin/winners', icon: Gift, color: 'btn-secondary' },
            { label: 'Add Charity', href: '/admin/charities', icon: Heart, color: 'btn-ghost border border-border' },
            { label: 'Manage Users', href: '/admin/users', icon: Users, color: 'btn-ghost border border-border' },
          ].map(a => (
            <Link key={a.label} to={a.href} className={`${a.color} btn btn-md justify-start gap-3`}>
              <a.icon className="w-4 h-4" /> {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
