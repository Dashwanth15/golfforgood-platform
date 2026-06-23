import apiClient from '../../lib/axios';
import type { ApiResponse, Score } from '../../types';

export const scoresApi = {
  getMyScores: async () => {
    const res = await apiClient.get<ApiResponse<Score[]>>('/scores/my');
    return res.data;
  },
  addScore: async (data: { score_value: number; score_date: string }) => {
    const res = await apiClient.post<ApiResponse<Score>>('/scores', data);
    return res.data;
  },
  updateScore: async (id: string, data: { score_value?: number; score_date?: string }) => {
    const res = await apiClient.patch<ApiResponse<Score>>(`/scores/${id}`, data);
    return res.data;
  },
  deleteScore: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/scores/${id}`);
    return res.data;
  },
};
