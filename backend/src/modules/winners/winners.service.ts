import { supabase } from '../../config/database';
import { NotFoundError, ForbiddenError } from '../../shared/errors/AppError';

export class WinnersService {
  async getMyWinnings(userId: string) {
    const { data } = await supabase
      .from('winner_claims')
      .select('*, draw:draws(draw_month, winning_numbers)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data ?? [];
  }

  async uploadProof(userId: string, claimId: string, proofUrl: string) {
    const { data: claim } = await supabase
      .from('winner_claims')
      .select('id, user_id, claim_status')
      .eq('id', claimId)
      .single();

    if (!claim) throw new NotFoundError('Claim');
    if (claim.user_id !== userId) throw new ForbiddenError('Not your claim');
    if (claim.claim_status !== 'pending') throw new ForbiddenError('Claim already reviewed');

    const { data, error } = await supabase
      .from('winner_claims')
      .update({ proof_url: proofUrl, updated_at: new Date().toISOString() })
      .eq('id', claimId)
      .select()
      .single();

    if (error) throw new Error('Failed to update claim');
    return data;
  }

  async getAllClaims(filters: { status?: string; payment?: string }) {
    let query = supabase
      .from('winner_claims')
      .select('*, user:users(full_name, email), draw:draws(draw_month)')
      .order('created_at', { ascending: false });

    if (filters.status) query = query.eq('claim_status', filters.status);
    if (filters.payment) query = query.eq('payment_status', filters.payment);

    const { data } = await query;
    return data ?? [];
  }

  async reviewClaim(adminId: string, claimId: string, status: 'approved' | 'rejected', notes?: string) {
    const { data, error } = await supabase
      .from('winner_claims')
      .update({
        claim_status: status,
        admin_notes: notes ?? null,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', claimId)
      .select()
      .single();

    if (error || !data) throw new NotFoundError('Claim');
    return data;
  }

  async markPaid(claimId: string) {
    const { data, error } = await supabase
      .from('winner_claims')
      .update({ payment_status: 'paid', paid_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', claimId)
      .eq('claim_status', 'approved')
      .select()
      .single();

    if (error || !data) throw new NotFoundError('Claim or claim not approved');
    return data;
  }
}

export const winnersService = new WinnersService();
