import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Shield, Ban, CheckCircle, Loader2 } from 'lucide-react';
import apiClient from '../../lib/axios';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import type { User } from '../../types';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

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

  const suspendMut = useMutation({
    mutationFn: async ({ id, suspend }: { id: string; suspend: boolean }) => {
      const r = await apiClient.patch(`/auth/admin/users/${id}/suspend`, { is_suspended: suspend });
      return r.data;
    },
    onSuccess: (_, vars) => {
      toast.success(vars.suspend ? 'User suspended' : 'User reinstated');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Action failed'),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">Users</h1>
          <p className="text-ink-muted text-sm mt-1">{total} total registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="input pl-9"
          />
        </div>
      </div>

      {/* Table */}
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
                    className="table-row"
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
                      <p className="text-xs text-ink-muted">{formatRelativeTime(user.created_at)}</p>
                    </td>
                    <td className="table-cell">
                      {user.is_suspended ? (
                        <span className="badge badge-danger">Suspended</span>
                      ) : (
                        <span className="badge badge-success">Active</span>
                      )}
                    </td>
                    <td className="table-cell text-right">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => suspendMut.mutate({ id: user.id, suspend: !user.is_suspended })}
                          disabled={suspendMut.isPending}
                          className={`btn btn-sm ${user.is_suspended ? 'btn-secondary' : 'btn-danger'} text-xs px-3 py-1.5`}
                        >
                          {user.is_suspended ? (
                            <><CheckCircle className="w-3.5 h-3.5" /> Reinstate</>
                          ) : (
                            <><Ban className="w-3.5 h-3.5" /> Suspend</>
                          )}
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
