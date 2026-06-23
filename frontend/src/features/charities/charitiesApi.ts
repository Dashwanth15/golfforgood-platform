import apiClient from '../../lib/axios';
import type { ApiResponse, Charity, CharitySelection } from '../../types';

export const charitiesApi = {
  getAll: async (params?: { search?: string; category?: string; page?: number; limit?: number }) => {
    const res = await apiClient.get<ApiResponse<Charity[]>>('/charities', { params });
    return res.data;
  },
  getFeatured: async () => {
    const res = await apiClient.get<ApiResponse<Charity>>('/charities/featured');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Charity>>(`/charities/${id}`);
    return res.data;
  },
  getMySelection: async () => {
    const res = await apiClient.get<ApiResponse<CharitySelection>>('/charities/user/my-selection');
    return res.data;
  },
  setMySelection: async (data: { charity_id: string; contribution_pct: number }) => {
    const res = await apiClient.post<ApiResponse<CharitySelection>>('/charities/user/my-selection', data);
    return res.data;
  },
  // Admin
  create: async (data: Partial<Charity>) => {
    const res = await apiClient.post<ApiResponse<Charity>>('/charities', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Charity>) => {
    const res = await apiClient.patch<ApiResponse<Charity>>(`/charities/${id}`, data);
    return res.data;
  },
  remove: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/charities/${id}`);
    return res.data;
  },
};
