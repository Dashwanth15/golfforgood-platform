import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, Eye, Send, Loader2, Ticket, X, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { drawsApi } from '../../features/draws/drawsApi';
import { formatCurrency, formatDrawMonth, formatDate } from '../../utils/formatters';
import type { Draw } from '../../types';
const createSchema = z.object({
  draw_month: z.string().min(1, 'Required'),
  total_revenue: z.number().positive('Must be positive'),
});
type CreateForm = z.infer<typeof createSchema>;


export default function AdminDraws() {
  const [showCreate, setShowCreate] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: 'generate' | 'publish' } | null>(null);
  const qc = useQueryClient();

  const { data: res, isLoading } = useQuery({
    queryKey: ['admin-draws'],
    queryFn: drawsApi.getAll,
  });
  const draws: Draw[] = res?.data ?? [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: { total_revenue: 0 },
  });

  const createMut = useMutation({
    mutationFn: drawsApi.create,
    onSuccess: () => { toast.success('Draw created!'); qc.invalidateQueries({ queryKey: ['admin-draws'] }); setShowCreate(false); reset(); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Failed to create draw'),
  });

  const simulateMut = useMutation({
    mutationFn: drawsApi.simulate,
    onSuccess: () => { toast.success('Simulation complete!'); qc.invalidateQueries({ queryKey: ['admin-draws'] }); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Simulation failed'),
  });

  const generateMut = useMutation({
    mutationFn: drawsApi.generate,
    onSuccess: () => { toast.success('Winning numbers generated!'); qc.invalidateQueries({ queryKey: ['admin-draws'] }); setConfirmAction(null); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Failed'),
  });

  const publishMut = useMutation({
    mutationFn: drawsApi.publish,
    onSuccess: () => { toast.success('Draw published to subscribers!'); qc.invalidateQueries({ queryKey: ['admin-draws'] }); setConfirmAction(null); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Failed'),
  });

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.action === 'generate') generateMut.mutate(confirmAction.id);
    else publishMut.mutate(confirmAction.id);
  };

  const statusColor: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700 border border-slate-200',
    simulated: 'bg-blue-100 text-blue-800 border border-blue-200',
    published: 'bg-green-100 text-green-800 border border-green-200',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">Draws Management</h1>
          <p className="text-ink-muted text-sm mt-1">Create, generate and publish monthly draws</p>
        </div>
        {!showCreate && (
          <button onClick={() => setShowCreate(true)} className="btn-primary btn-md">
            <Plus className="w-4 h-4" /> New Draw
          </button>
        )}
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <div className="card border-2 border-brand/30">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-ink">Create New Draw</h3>
                <button onClick={() => { setShowCreate(false); reset(); }} className="p-1.5 rounded-lg hover:bg-surface">
                  <X className="w-4 h-4 text-ink-muted" />
                </button>
              </div>
              <form onSubmit={handleSubmit(d => createMut.mutate(d as any))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Draw Month</label>
                  <input {...register('draw_month')} type="month" className={`input ${errors.draw_month ? 'input-error' : ''}`} />
                  {errors.draw_month && <p className="form-error">{errors.draw_month.message}</p>}
                </div>
                <div>
                  <label className="label">Total Revenue (£)</label>
                  <input {...register('total_revenue', { valueAsNumber: true })} type="number" step="0.01" min="0" placeholder="e.g. 5000" className={`input ${errors.total_revenue ? 'input-error' : ''}`} />
                  {errors.total_revenue && <p className="form-error">{errors.total_revenue.message}</p>}
                </div>
                <div className="sm:col-span-2 flex gap-3">
                  <button type="submit" disabled={createMut.isPending} className="btn-primary btn-md">
                    {createMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ticket className="w-4 h-4" />}
                    Create Draw
                  </button>
                  <button type="button" onClick={() => { setShowCreate(false); reset(); }} className="btn-ghost btn-md">Cancel</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Dialog */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmAction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-ink text-center mb-2">Confirm Action</h3>
              <p className="text-sm text-ink-muted text-center mb-6">
                {confirmAction.action === 'generate'
                  ? 'Generate winning numbers for this draw? This action cannot be undone.'
                  : 'Publish this draw to all subscribers? Winners will be notified.'}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmAction(null)} className="btn-ghost btn-md flex-1">Cancel</button>
                <button
                  onClick={handleConfirm}
                  disabled={generateMut.isPending || publishMut.isPending}
                  className={`btn-md flex-1 ${confirmAction.action === 'publish' ? 'btn-primary' : 'bg-amber-500 text-white hover:bg-amber-600 btn'}`}
                >
                  {(generateMut.isPending || publishMut.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draw list */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
      ) : draws.length === 0 ? (
        <div className="card text-center py-16">
          <Ticket className="w-12 h-12 text-border mx-auto mb-4" />
          <h3 className="font-bold text-ink mb-2">No draws yet</h3>
          <p className="text-sm text-ink-muted mb-6">Create the first monthly draw to get started</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary btn-md">Create First Draw</button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-surface">
                  <tr>
                    <th className="table-header">Draw Month</th>
                    <th className="table-header">Status</th>
                    <th className="table-header text-right">Revenue</th>
                    <th className="table-header text-right">Jackpot Rollover</th>
                    <th className="table-header text-center">Total Participants</th>
                    <th className="table-header text-center">Winner Count</th>
                    <th className="table-header">Created Date</th>
                    <th className="table-header text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {draws.map((draw) => {
                    const winnerCount = draw.prize_pools?.reduce((sum, p) => sum + p.winner_count, 0) ?? 0;
                    const participants = draw.draw_entries?.[0]?.count ?? (draw.status === 'published' ? 0 : '—');
                    return (
                      <tr key={draw.id} className="table-row">
                        <td className="table-cell font-bold text-ink">
                          {formatDrawMonth(draw.draw_month)}
                        </td>
                        <td className="table-cell">
                          <span className={`badge ${statusColor[draw.status]} px-2.5 py-1 rounded-lg text-xs font-semibold capitalize`}>
                            {draw.status}
                          </span>
                        </td>
                        <td className="table-cell text-right font-medium text-ink">
                          {formatCurrency(draw.total_revenue)}
                        </td>
                        <td className="table-cell text-right font-medium text-gold-hover">
                          {formatCurrency(draw.jackpot_rollover)}
                        </td>
                        <td className="table-cell text-center font-medium text-ink">
                          {participants}
                        </td>
                        <td className="table-cell text-center font-medium text-brand">
                          {draw.status === 'published' ? winnerCount : '—'}
                        </td>
                        <td className="table-cell text-sm text-ink-muted">
                          {draw.created_at ? formatDate(draw.created_at) : '—'}
                        </td>
                        <td className="table-cell text-right">
                          <div className="flex gap-2 justify-end">
                            {draw.status === 'draft' && (
                              <>
                                <button
                                  onClick={() => simulateMut.mutate(draw.id)}
                                  disabled={simulateMut.isPending}
                                  className="btn-secondary btn-sm"
                                  title="Simulate draw to see match statistics"
                                >
                                  <Eye className="w-3.5 h-3.5" /> Simulate
                                </button>
                                <button
                                  onClick={() => setConfirmAction({ id: draw.id, action: 'generate' })}
                                  className="btn-sm bg-amber-500 text-white hover:bg-amber-600 btn text-xs px-3 py-1.5 rounded-xl flex items-center gap-1"
                                >
                                  <Play className="w-3.5 h-3.5" /> Generate Numbers
                                </button>
                              </>
                            )}
                            {draw.status === 'simulated' && (
                              <button
                                onClick={() => setConfirmAction({ id: draw.id, action: 'publish' })}
                                className="btn-primary btn-sm"
                              >
                                <Send className="w-3.5 h-3.5" /> Publish Draw
                              </button>
                            )}
                            {draw.status === 'published' && (
                              <span className="text-xs text-success font-semibold flex items-center gap-1">
                                ✅ Published
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Fallback View */}
          <div className="block md:hidden space-y-4">
            {draws.map((draw) => {
              const winnerCount = draw.prize_pools?.reduce((sum, p) => sum + p.winner_count, 0) ?? 0;
              const participants = draw.draw_entries?.[0]?.count ?? (draw.status === 'published' ? 0 : '—');
              return (
                <div key={draw.id} className="card hover:shadow-elevated transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-ink">{formatDrawMonth(draw.draw_month)}</h3>
                    <span className={`badge ${statusColor[draw.status]} px-2.5 py-1 rounded-lg text-xs font-semibold capitalize`}>
                      {draw.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm border-b border-border pb-3 mb-3">
                    <div>
                      <p className="text-xs text-ink-muted">Revenue</p>
                      <p className="font-semibold text-ink">{formatCurrency(draw.total_revenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-muted">Jackpot Rollover</p>
                      <p className="font-semibold text-gold-hover">{formatCurrency(draw.jackpot_rollover)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-muted">Total Participants</p>
                      <p className="font-semibold text-ink">{participants}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-muted">Winner Count</p>
                      <p className="font-semibold text-brand">{draw.status === 'published' ? winnerCount : '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-ink-muted">
                    <span>Created: {draw.created_at ? formatDate(draw.created_at) : '—'}</span>
                    <div className="flex gap-2">
                      {draw.status === 'draft' && (
                        <>
                          <button
                            onClick={() => simulateMut.mutate(draw.id)}
                            disabled={simulateMut.isPending}
                            className="btn-secondary btn-sm text-xs px-2.5 py-1.5"
                          >
                            Simulate
                          </button>
                          <button
                            onClick={() => setConfirmAction({ id: draw.id, action: 'generate' })}
                            className="btn-sm bg-amber-500 text-white hover:bg-amber-600 btn text-xs px-2.5 py-1.5 rounded-xl"
                          >
                            Generate
                          </button>
                        </>
                      )}
                      {draw.status === 'simulated' && (
                        <button
                          onClick={() => setConfirmAction({ id: draw.id, action: 'publish' })}
                          className="btn-primary btn-sm text-xs px-2.5 py-1.5"
                        >
                          Publish
                        </button>
                      )}
                      {draw.status === 'published' && (
                        <span className="text-xs text-success font-semibold">Published</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
