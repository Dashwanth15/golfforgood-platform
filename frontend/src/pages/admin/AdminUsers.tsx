import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Shield, Ban, CheckCircle, Loader2, ArrowLeft, Edit2, Save, Trash2 } from 'lucide-react';
import apiClient from '../../lib/axios';
import { formatDate } from '../../utils/formatters';
import type { User } from '../../types';
import toast from 'react-hot-toast';

function UserDetailView({ user, onBack }: { user: User; onBack: () => void }) {
  const qc = useQueryClient();
  const [editingUser, setEditingUser] = useState(false);
  const [formData, setFormData] = useState({ full_name: user.full_name, email: user.email, role: user.role });
  
  // Scores
  const { data: scoresRes, isLoading: scoresLoading } = useQuery({
    queryKey: ['admin-user-scores', user.id],
    queryFn: async () => {
      const r = await apiClient.get(`/scores/admin/users/${user.id}`);
      return r.data;
    },
  });
  const scores = scoresRes?.data ?? [];

  const updateMut = useMutation({
    mutationFn: async (data: any) => apiClient.patch(`/auth/admin/users/${user.id}`, data),
    onSuccess: () => {
      toast.success('User updated');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      setEditingUser(false);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Update failed')
  });

  const suspendMut = useMutation({
    mutationFn: async (suspend: boolean) => apiClient.patch(`/auth/admin/users/${user.id}/suspend`, { is_suspended: suspend }),
    onSuccess: (_, suspend) => {
      toast.success(suspend ? 'User suspended' : 'User reinstated');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      onBack();
    }
  });

  // Score mutations
  const deleteScoreMut = useMutation({
    mutationFn: async (scoreId: string) => apiClient.delete(`/scores/admin/${scoreId}`),
    onSuccess: () => {
      toast.success('Score deleted');
      qc.invalidateQueries({ queryKey: ['admin-user-scores', user.id] });
    }
  });

  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [scoreForm, setScoreForm] = useState({ score_value: 0, score_date: '' });

  const updateScoreMut = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => apiClient.patch(`/scores/admin/${id}`, data),
    onSuccess: () => {
      toast.success('Score updated');
      qc.invalidateQueries({ queryKey: ['admin-user-scores', user.id] });
      setEditingScoreId(null);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to update score')
  });

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="btn-ghost btn-sm px-0 text-ink-muted hover:text-ink"><ArrowLeft className="w-4 h-4 mr-1"/> Back to Users</button>
      
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">User Details</h2>
          <div className="flex gap-2">
            {user.role !== 'admin' && (
              <button 
                onClick={() => suspendMut.mutate(!user.is_suspended)}
                className={`btn btn-sm ${user.is_suspended ? 'btn-secondary' : 'btn-danger'}`}
              >
                {user.is_suspended ? <CheckCircle className="w-4 h-4 mr-1"/> : <Ban className="w-4 h-4 mr-1"/>}
                {user.is_suspended ? 'Reinstate' : 'Suspend'}
              </button>
            )}
            {!editingUser ? (
              <button onClick={() => setEditingUser(true)} className="btn-secondary btn-sm"><Edit2 className="w-4 h-4 mr-1"/> Edit User</button>
            ) : (
              <button onClick={() => updateMut.mutate(formData)} disabled={updateMut.isPending} className="btn-primary btn-sm"><Save className="w-4 h-4 mr-1"/> Save</button>
            )}
          </div>
        </div>

        {editingUser ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="input" />
            </div>
            <div>
              <label className="label">Email</label>
              <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input" />
            </div>
            <div>
              <label className="label">Role</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as 'subscriber' | 'admin'})} className="input">
                <option value="subscriber">Subscriber</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface p-4 rounded-xl">
            <div><p className="text-xs text-ink-muted">Name</p><p className="font-semibold">{user.full_name}</p></div>
            <div><p className="text-xs text-ink-muted">Email</p><p className="font-semibold">{user.email}</p></div>
            <div><p className="text-xs text-ink-muted">Role</p><p className="font-semibold capitalize">{user.role}</p></div>
            <div><p className="text-xs text-ink-muted">Status</p><p className="font-semibold">{user.is_suspended ? 'Suspended' : 'Active'}</p></div>
            <div><p className="text-xs text-ink-muted">Joined</p><p className="font-semibold">{formatDate(user.created_at)}</p></div>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">User Scores</h2>
        {scoresLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-brand" /></div>
        ) : scores.length === 0 ? (
          <div className="text-center py-8 text-ink-muted">No scores logged</div>
        ) : (
          <div className="space-y-3">
            {scores.map((score: any) => (
              <div key={score.id} className="p-4 rounded-xl border border-border flex items-center justify-between">
                {editingScoreId === score.id ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                    <input type="number" min={1} max={45} className="input sm:max-w-[100px] w-full" value={scoreForm.score_value} onChange={e => setScoreForm({...scoreForm, score_value: +e.target.value})} />
                    <input type="date" className="input w-full sm:flex-1" value={scoreForm.score_date} onChange={e => setScoreForm({...scoreForm, score_date: e.target.value})} />
                    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 sm:ml-auto">
                      <button onClick={() => updateScoreMut.mutate({ id: score.id, data: scoreForm })} className="btn-primary btn-sm flex-1 sm:flex-none">Save</button>
                      <button onClick={() => setEditingScoreId(null)} className="btn-ghost btn-sm flex-1 sm:flex-none">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand font-bold flex items-center justify-center text-lg">{score.score_value}</div>
                      <div>
                        <p className="font-semibold text-ink">{score.score_value} points</p>
                        <p className="text-xs text-ink-muted">{formatDate(score.score_date)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        setEditingScoreId(score.id);
                        setScoreForm({ score_value: score.score_value, score_date: score.score_date });
                      }} className="btn-secondary btn-sm"><Edit2 className="w-3.5 h-3.5"/></button>
                      <button onClick={() => {
                        if(confirm('Are you sure you want to delete this score?')) deleteScoreMut.mutate(score.id);
                      }} className="btn-danger btn-sm"><Trash2 className="w-3.5 h-3.5"/></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ['admin-users', search, page],
    queryFn: async () => {
      const r = await apiClient.get('/auth/admin/users', { params: { search, page, limit: 15 } });
      return r.data;
    },
  });

  const users: User[] = res?.data ?? [];
  const total: number = res?.pagination?.total ?? 0;
  const totalPages: number = res?.pagination?.totalPages ?? 1;

  if (selectedUser) {
    return <UserDetailView user={users.find(u => u.id === selectedUser.id) || selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">Users</h1>
          <p className="text-ink-muted text-sm mt-1">{total} total registered users</p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="table-header">User</th>
                <th className="table-header">Role</th>
                <th className="table-header">Joined</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-brand mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-ink-muted text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="table-row cursor-pointer hover:bg-surface"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-brand">{user.full_name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-ink text-sm">{user.full_name}</p>
                          <p className="text-xs text-ink-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${user.role === 'admin' ? 'badge-blue' : 'badge-brand'} flex items-center gap-1 w-fit`}>
                        {user.role === 'admin' && <Shield className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{formatDate(user.created_at)}</span>
                    </td>
                    <td className="table-cell">
                      {user.is_suspended ? (
                        <span className="badge badge-danger">Suspended</span>
                      ) : (
                        <span className="badge badge-success">Active</span>
                      )}
                    </td>
                    <td className="table-cell text-right">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }} className="btn-secondary btn-sm">
                        Manage
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-ink-muted">Page {page} of {totalPages}</p>
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
