import { supabase } from '../../config/database';
import { NotFoundError } from '../../shared/errors/AppError';

export class CharitiesService {
  async getAll(params: { search?: string; category?: string; page?: number; limit?: number } = {}) {
    const { search, category, page = 1, limit = 20 } = params;
    const from = (page - 1) * limit;

    let query = supabase
      .from('charities')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('total_raised', { ascending: false })
      .range(from, from + limit - 1);

    if (search) query = query.ilike('name', `%${search}%`);
    if (category) query = query.eq('category', category);

    const { data, count } = await query;
    return { charities: data ?? [], total: count ?? 0 };
  }

  async getFeatured() {
    const { data } = await supabase
      .from('charities')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .single();
    return data;
  }

  async getById(id: string) {
    const { data } = await supabase
      .from('charities').select('*').eq('id', id).single();
    if (!data) throw new NotFoundError('Charity');
    return data;
  }

  async getMySelection(userId: string) {
    const { data } = await supabase
      .from('user_charity_selections')
      .select('id, contribution_pct, charity:charities(*)')
      .eq('user_id', userId)
      .single();
    return data;
  }

  async setMySelection(userId: string, charity_id: string, contribution_pct: number) {
    // Upsert using unique constraint on user_id
    const { data, error } = await supabase
      .from('user_charity_selections')
      .upsert(
        { user_id: userId, charity_id, contribution_pct, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
      .select('id, contribution_pct, charity:charities(*)')
      .single();

    if (error) throw new Error('Failed to save charity selection');
    return data;
  }

  async create(data: any) {
    const { data: charity, error } = await supabase
      .from('charities').insert(data).select().single();
    if (error) throw new Error('Failed to create charity');
    return charity;
  }

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('charities')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id).select().single();
    if (error || !data) throw new NotFoundError('Charity');
    return data;
  }

  async remove(id: string) {
    await supabase.from('charities')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    return { deleted: true };
  }
}

export const charitiesService = new CharitiesService();
