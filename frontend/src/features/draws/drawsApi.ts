import apiClient from '../../lib/axios';
import type { ApiResponse, Draw, WinnerClaim, Analytics } from '../../types';

export const drawsApi = {
  getPublished: async () => {
    const res = await apiClient.get<ApiResponse<Draw[]>>('/draws');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Draw>>(`/draws/${id}`);
    return res.data;
  },
  getUpcoming: async () => {
    const res = await apiClient.get<ApiResponse<{ nextDrawDate: string; daysUntilDraw: number }>>('/draws/upcoming');
    return res.data;
  },
  getAll: async () => {
    const res = await apiClient.get<ApiResponse<Draw[]>>('/draws/admin');
    return res.data;
  },
  // Admin
  create: async (data: { draw_month: string; total_revenue: number }) => {
    const res = await apiClient.post<ApiResponse<Draw>>('/draws', data);
    return res.data;
  },
  simulate: async (id: string) => {
    const res = await apiClient.post<ApiResponse<any>>(`/draws/${id}/simulate`);
    return res.data;
  },
  generate: async (id: string) => {
    const res = await apiClient.post<ApiResponse<any>>(`/draws/${id}/generate`);
    return res.data;
  },
  publish: async (id: string) => {
    const res = await apiClient.post<ApiResponse<any>>(`/draws/${id}/publish`);
    return res.data;
  },
};

export const winnersApi = {
  getMyWinnings: async () => {
    const res = await apiClient.get<ApiResponse<WinnerClaim[]>>('/winners/my');
    return res.data;
  },
  uploadProof: async (id: string, proof_url: string) => {
    const res = await apiClient.post<ApiResponse<WinnerClaim>>(`/winners/${id}/proof`, { proof_url });
    return res.data;
  },
  // Admin
  getAll: async (params?: { status?: string; payment?: string }) => {
    const res = await apiClient.get<ApiResponse<WinnerClaim[]>>('/winners', { params });
    return res.data;
  },
  review: async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    const res = await apiClient.patch<ApiResponse<WinnerClaim>>(`/winners/${id}/review`, { status, notes });
    return res.data;
  },
  markPaid: async (id: string) => {
    const res = await apiClient.patch<ApiResponse<WinnerClaim>>(`/winners/${id}/payment`);
    return res.data;
  },
};

export const adminApi = {
  getAnalytics: async () => {
    const res = await apiClient.get<ApiResponse<Analytics>>('/admin/analytics');
    return res.data;
  },
};
