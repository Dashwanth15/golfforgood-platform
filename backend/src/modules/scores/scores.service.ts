import { supabase } from '../../config/database';
import { NotFoundError, ForbiddenError, ValidationError } from '../../shared/errors/AppError';
import { APP_CONSTANTS } from '../../config/constants';

export class ScoresService {
  async getMyScores(userId: string) {
    const { data } = await supabase
      .from('user_scores')
      .select('id, score_value, score_date, created_at, updated_at')
      .eq('user_id', userId)
      .order('score_date', { ascending: false });
    return data ?? [];
  }

  async addScore(userId: string, score_value: number, score_date: string) {
    const existing = await this.getMyScores(userId);

    // 1. Check for duplicate date BEFORE deleting anything to avoid data loss
    const isDuplicateDate = existing.some(s => s.score_date === score_date);
    if (isDuplicateDate) {
      throw new ValidationError('A score for this date already exists. Please choose a different date.');
    }

    // 2. Enforce rolling window: keep only latest 5
    if (existing.length >= APP_CONSTANTS.MAX_SCORES_PER_USER) {
      // Delete the oldest score
      const oldest = existing[existing.length - 1];
      const { error: deleteError } = await supabase.from('user_scores').delete().eq('id', oldest.id);
      if (deleteError) {
        throw new Error('Failed to rotate scores');
      }
    }

    // 3. Insert new score
    const { data, error } = await supabase
      .from('user_scores')
      .insert({ user_id: userId, score_value, score_date })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ValidationError('A score for this date already exists. Please choose a different date.');
      }
      throw new Error('Failed to add score');
    }
    return data;
  }

  async updateScore(userId: string, scoreId: string, updates: { score_value?: number; score_date?: string }) {
    // Verify ownership
    const { data: existing } = await supabase
      .from('user_scores').select('id, user_id').eq('id', scoreId).single();
    if (!existing) throw new NotFoundError('Score');
    if (existing.user_id !== userId) throw new ForbiddenError('Not your score');

    const { data, error } = await supabase
      .from('user_scores')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', scoreId)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new ValidationError('A score for this date already exists');
      throw new Error('Failed to update score');
    }
    return data;
  }

  async deleteScore(userId: string, scoreId: string) {
    const { data: existing } = await supabase
      .from('user_scores').select('id, user_id').eq('id', scoreId).single();
    if (!existing) throw new NotFoundError('Score');
    if (existing.user_id !== userId) throw new ForbiddenError('Not your score');

    await supabase.from('user_scores').delete().eq('id', scoreId);
    return { deleted: true };
  }

  // --- ADMIN METHODS ---
  async adminGetUserScores(userId: string) {
    const { data } = await supabase
      .from('user_scores')
      .select('id, score_value, score_date, created_at, updated_at')
      .eq('user_id', userId)
      .order('score_date', { ascending: false });
    return data ?? [];
  }

  async adminUpdateScore(scoreId: string, updates: { score_value?: number; score_date?: string }) {
    const { data: existing } = await supabase
      .from('user_scores').select('id, user_id').eq('id', scoreId).single();
    if (!existing) throw new NotFoundError('Score');

    const { data, error } = await supabase
      .from('user_scores')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', scoreId)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new ValidationError('A score for this date already exists for this user');
      throw new Error(`Failed to update score: ${error.message}`);
    }
    return data;
  }

  async adminDeleteScore(scoreId: string) {
    const { data: existing } = await supabase
      .from('user_scores').select('id').eq('id', scoreId).single();
    if (!existing) throw new NotFoundError('Score');

    await supabase.from('user_scores').delete().eq('id', scoreId);
    return { deleted: true };
  }
}

export const scoresService = new ScoresService();
