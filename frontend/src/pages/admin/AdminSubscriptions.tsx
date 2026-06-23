import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Search, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { subscriptionApi } from '../../features/subscription/subscriptionApi';
import { formatDate, formatCurrency } from '../../utils/formatters';
import type { Subscription } from '../../types';

const STATUS_COLORS: Record<string, string> = {
  active: 'badge-success', expired: 'badge-danger', cancelled: 'badge-warning',
};

export default function AdminSubscriptions() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data: res, isLoading } = useQuery({
    queryKey: ['admin-subscriptions', page],
    queryFn: () => subscriptionApi.getAll({ page, limit: 15 }),
  });

  const subs: Subscription[] = res?.data ?? [];
  const total: number = res?.pagination?.total ?? 0;
  const totalPages: number = res?.pagination?.totalPages ?? 1;

  const filtered = search
    ? subs.filter(s => s.user?.full_name?.toLowerCase().includes(search.toLowerCase()) || s.user?.email?.toLowerCase().includes(search.toLowerCase()))
    : subs;

  const updateMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => subscriptionApi.updateStatus(id, status),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries({ queryKey: ['admin-subscriptions'] }); },
    onError: () => toast.error('Update failed'),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">Subscriptions</h1>
          <p className="text-ink-muted text-sm mt-1">{total} total subscriptions</p>
        </div>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by subscriber name or email..." className="input pl-9" />
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="table-header">Subscriber</th>
                <th className="table-header">Plan</th>
                <th className="table-header">Status</th>
                <th className="table-header">Period</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="py-16 text-center"><Loader2 className="w-6 h-6 animate-spin text-brand mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center text-sm text-ink-muted">No subscriptions found</td></tr>
              ) : (
                filtered.map((sub, i) => (
                  <motion.tr key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="table-row">
                    <td className="table-cell">
                      <div>
                        <p className="font-semibold text-ink text-sm">{sub.user?.full_name ?? '—'}</p>
                        <p className="text-xs text-ink-muted">{sub.user?.email ?? '—'}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="text-sm font-medium text-ink">{sub.plan?.name ?? '—'}</p>
                        <p className="text-xs text-brand">{sub.plan ? formatCurrency(sub.plan.price_amount) : ''}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${STATUS_COLORS[sub.status] ?? 'badge-blue'}`}>{sub.status}</span>
                    </td>
                    <td className="table-cell text-sm text-ink-muted">
                      {formatDate(sub.start_date)} — {formatDate(sub.end_date)}
                    </td>
                    <td className="table-cell text-right">
                      {sub.status === 'active' && (
                        <button
                          onClick={() => updateMut.mutate({ id: sub.id, status: 'cancelled' })}
                          disabled={updateMut.isPending}
                          className="btn-danger btn-sm text-xs"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                      )}
                      {sub.status === 'cancelled' && (
                        <button
                          onClick={() => updateMut.mutate({ id: sub.id, status: 'active' })}
                          disabled={updateMut.isPending}
                          className="btn-primary btn-sm text-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Reactivate
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-ink-muted">Page {page} of {totalPages} · {total} total</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost btn-sm disabled:opacity-40">← Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-ghost btn-sm disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
