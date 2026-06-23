import apiClient from '../../lib/axios';
import type { ApiResponse, SubscriptionPlan, Subscription } from '../../types';

export const subscriptionApi = {
  getPlans: async () => {
    const res = await apiClient.get<ApiResponse<SubscriptionPlan[]>>('/subscriptions/plans');
    return res.data;
  },
  getMySubscription: async () => {
    const res = await apiClient.get<ApiResponse<Subscription>>('/subscriptions/my');
    return res.data;
  },
  purchase: async (plan_id: string) => {
    const res = await apiClient.post<ApiResponse<Subscription>>('/subscriptions', { plan_id });
    return res.data;
  },
  cancel: async (id: string) => {
    const res = await apiClient.patch<ApiResponse<Subscription>>(`/subscriptions/${id}/cancel`);
    return res.data;
  },
  // Admin
  getAll: async (params?: { page?: number; limit?: number }) => {
    const res = await apiClient.get<ApiResponse<Subscription[]>>('/subscriptions', { params });
    return res.data;
  },
  updateStatus: async (id: string, status: string) => {
    const res = await apiClient.patch<ApiResponse<Subscription>>(`/subscriptions/${id}/status`, { status });
    return res.data;
  },
};
