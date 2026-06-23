import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, Loader2, Target, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { scoresApi } from '../../features/scores/scoresApi';
import { formatDate } from '../../utils/formatters';
import type { Score } from '../../types';
const scoreSchema = z.object({
  score_value: z.number().int().min(1, 'Min 1').max(45, 'Max 45'),
  score_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format'),
});
type ScoreForm = z.infer<typeof scoreSchema>;

export default function Scores() {
  const [showForm, setShowForm] = useState(false);
  const [editingScore, setEditingScore] = useState<Score | null>(null);
  const qc = useQueryClient();

  const { data: res, isLoading } = useQuery({
    queryKey: ['my-scores'],
    queryFn: scoresApi.getMyScores,
  });
  const scores = res?.data ?? [];

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ScoreForm>({
    resolver: zodResolver(scoreSchema),
    defaultValues: { score_date: new Date().toISOString().split('T')[0] },
  });

  const addMut = useMutation({
    mutationFn: scoresApi.addScore,
    onSuccess: () => {
      toast.success('Score added!');
      qc.invalidateQueries({ queryKey: ['my-scores'] });
      reset({ score_date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Failed to add score'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ScoreForm> }) => scoresApi.updateScore(id, data),
    onSuccess: () => {
      toast.success('Score updated!');
      qc.invalidateQueries({ queryKey: ['my-scores'] });
      setEditingScore(null);
      reset();
      setShowForm(false);
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Failed to update score'),
  });

  const deleteMut = useMutation({
    mutationFn: scoresApi.deleteScore,
    onSuccess: () => {
      toast.success('Score deleted');
      qc.invalidateQueries({ queryKey: ['my-scores'] });
    },
    onError: () => toast.error('Failed to delete score'),
  });

  const onSubmit = (data: ScoreForm) => {
    if (editingScore) {
      updateMut.mutate({ id: editingScore.id, data });
    } else {
      addMut.mutate(data);
    }
  };

  const startEdit = (score: Score) => {
    setEditingScore(score);
    setValue('score_value', score.score_value);
    setValue('score_date', score.score_date);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingScore(null);
    reset({ score_date: new Date().toISOString().split('T')[0] });
  };

  const isSubmitting = addMut.isPending || updateMut.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">Golf Scores</h1>
          <p className="text-ink-muted text-sm mt-1">Your latest 5 scores — they're your draw entry numbers</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary btn-md">
            <Plus className="w-4 h-4" /> Add Score
          </button>
        )}
      </div>

      {/* Info banner */}
      <div className="card bg-brand/5 border-brand/20 border mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
        <div className="text-sm text-ink-muted">
          <span className="font-semibold text-ink">Rolling Window:</span> You can store up to 5 scores. When you add a 6th, the oldest is automatically removed. Each date can only have one score.
        </div>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="card border-brand/30 border-2">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-ink">{editingScore ? 'Edit Score' : 'New Score'}</h3>
                <button onClick={cancelForm} className="p-1.5 rounded-lg hover:bg-surface"><X className="w-4 h-4 text-ink-muted" /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Score Value <span className="text-ink-muted font-normal">(1–45)</span></label>
                  <input {...register('score_value', { valueAsNumber: true })} type="number" min={1} max={45} placeholder="e.g. 32" className={`input ${errors.score_value ? 'input-error' : ''}`} />
                  {errors.score_value && <p className="form-error">{errors.score_value.message}</p>}
                </div>
                <div>
                  <label className="label">Date</label>
                  <input {...register('score_date')} type="date" max={new Date().toISOString().split('T')[0]} className={`input ${errors.score_date ? 'input-error' : ''}`} />
                  {errors.score_date && <p className="form-error">{errors.score_date.message}</p>}
                </div>
                <div className="sm:col-span-2 flex gap-3">
                  <button type="submit" disabled={isSubmitting} className="btn-primary btn-md">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editingScore ? 'Update Score' : 'Add Score'}
                  </button>
                  <button type="button" onClick={cancelForm} className="btn-ghost btn-md">Cancel</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score List */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
      ) : scores.length === 0 ? (
        <div className="card text-center py-16">
          <Target className="w-12 h-12 text-border mx-auto mb-4" />
          <h3 className="font-bold text-ink mb-2">No scores yet</h3>
          <p className="text-sm text-ink-muted mb-6">Add your first golf score to start participating in draws</p>
          <button onClick={() => setShowForm(true)} className="btn-primary btn-md">Add First Score</button>
        </div>
      ) : (
        <div className="space-y-3">
          {scores.map((score, i) => (
            <motion.div
              key={score.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card flex items-center gap-4 hover:shadow-elevated transition-all duration-200"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-black text-brand">{score.score_value}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-ink text-lg">{score.score_value} points</span>
                  {i === 0 && <span className="badge badge-success">Latest</span>}
                  {i === scores.length - 1 && scores.length === 5 && (
                    <span className="badge badge-warning">Oldest</span>
                  )}
                </div>
                <span className="text-sm text-ink-muted">Played on {formatDate(score.score_date)}</span>
              </div>

              {/* Draw ball preview */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-ink-muted">Draw #</span>
                <div className="draw-ball-gold w-10 h-10 text-sm">{score.score_value}</div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => startEdit(score)}
                  className="p-2 rounded-xl text-ink-muted hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteMut.mutate(score.id)}
                  disabled={deleteMut.isPending}
                  className="p-2 rounded-xl text-ink-muted hover:text-danger hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Capacity indicator */}
      {scores.length > 0 && (
        <div className="mt-6 flex items-center gap-3">
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`w-8 h-2 rounded-full ${i < scores.length ? 'bg-brand' : 'bg-border'}`} />
            ))}
          </div>
          <span className="text-xs text-ink-muted">{scores.length}/5 scores</span>
        </div>
      )}
    </div>
  );
}
