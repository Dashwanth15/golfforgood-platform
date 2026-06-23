import apiClient from '../../lib/axios';
import type { ApiResponse, User } from '../../types';

export interface UpdateProfileInput {
  full_name?: string;
  avatar_url?: string | null;
  password?: string;
}

export const profileApi = {
  getProfile: async () => {
    const res = await apiClient.get<ApiResponse<User>>('/profile');
    return res.data;
  },
  updateProfile: async (data: UpdateProfileInput) => {
    const res = await apiClient.patch<ApiResponse<User>>('/profile', data);
    return res.data;
  },
};
