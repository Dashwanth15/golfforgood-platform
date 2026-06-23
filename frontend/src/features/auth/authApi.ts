import apiClient from '../../lib/axios';
import type { ApiResponse, User } from '../../types';

export const authApi = {
  register: async (data: { full_name: string; email: string; password: string }) => {
    const res = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data);
    return res.data;
  },

  loginWithGoogle: async (accessToken: string) => {
    const res = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/google', { access_token: accessToken });
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};
