import { supabase } from '../../config/database';
import { NotFoundError, ForbiddenError } from '../../shared/errors/AppError';
import { APP_CONSTANTS } from '../../config/constants';

// ── Fisher-Yates shuffle on pool 1-45, pick 5 ────────────────────
function generateWinningNumbers(): number[] {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 5).sort((a, b) => a - b);
}

// ── Count matches between entry and winning numbers ───────────────
function countMatches(entry: number[], winning: number[]): number {
  const winSet = new Set(winning);
  return entry.filter(n => winSet.has(n)).length;
}

function getMatchLevel(matches: number): string | null {
  if (matches === 5) return 'five_match';
  if (matches === 4) return 'four_match';
  if (matches === 3) return 'three_match';
  return null;
}

export class DrawsService {
  async getPublishedDraws() {
    const { data } = await supabase
      .from('draws')
      .select('*, prize_pools(*)')
      .eq('status', 'published')
      .order('draw_month', { ascending: false });
    return data ?? [];
  }

  async getDrawById(id: string) {
    const { data } = await supabase
      .from('draws')
      .select('*, prize_pools(*)')
      .eq('id', id)
      .single();
    if (!data) throw new NotFoundError('Draw');
    return data;
  }

  async getUpcomingDraw() {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const daysUntilDraw = Math.ceil((nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      nextDrawDate: nextMonth.toISOString().split('T')[0],
      daysUntilDraw,
    };
  }

  async createDraw(adminId: string, draw_month: string, total_revenue: number) {
    // Normalize draw_month to first of month
    const monthDate = draw_month.includes('-01') ? draw_month : `${draw_month}-01`;

    // Inherit jackpot rollover from the immediate preceding draw (if it exists and is published)
    let jackpotRollover = 0;
    const { data: precedingDraws } = await supabase
      .from('draws')
      .select('id, status')
      .lt('draw_month', monthDate)
      .order('draw_month', { ascending: false })
      .limit(1);

    if (precedingDraws && precedingDraws.length > 0) {
      const prevDraw = precedingDraws[0];
      if (prevDraw.status === 'published') {
        const { data: pools } = await supabase
          .from('prize_pools')
          .select('pool_amount, rolled_over')
          .eq('draw_id', prevDraw.id)
          .eq('match_level', 'five_match')
          .limit(1);

        if (pools && pools.length > 0 && pools[0].rolled_over) {
          jackpotRollover = Number(pools[0].pool_amount);
        }
      }
    }

    const { data, error } = await supabase
      .from('draws')
      .insert({
        draw_month: monthDate,
        total_revenue,
        jackpot_rollover: jackpotRollover,
        created_by: adminId,
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('A draw for this month already exists');
      throw new Error('Failed to create draw');
    }
    return data;
  }

  async simulateDraw(drawId: string) {
    const draw = await this.getDrawById(drawId);
    if (draw.status !== 'draft') throw new ForbiddenError('Only draft draws can be simulated');

    const simNumbers = generateWinningNumbers();

    // Get all active subscriber user IDs
    const today = new Date().toISOString().split('T')[0];
    const { data: activeSubs } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('status', 'active')
      .gte('end_date', today);
    const activeUserIds = new Set((activeSubs ?? []).map(s => s.user_id));

    // Get all user scores
    const { data: entries } = await supabase
      .from('user_scores')
      .select('user_id, score_value');

    // Group by user
    const userScores: Record<string, number[]> = {};
    (entries ?? []).forEach(e => {
      // Only include user if they have an active subscription
      if (!activeUserIds.has(e.user_id)) return;

      if (!userScores[e.user_id]) userScores[e.user_id] = [];
      userScores[e.user_id].push(e.score_value);
    });

    // Filter out users who do not have exactly 5 scores
    const eligibleUserScores: Record<string, number[]> = {};
    Object.entries(userScores).forEach(([userId, scores]) => {
      if (scores.length === APP_CONSTANTS.MAX_SCORES_PER_USER) {
        eligibleUserScores[userId] = scores;
      }
    });

    const matchCounts = { three_match: 0, four_match: 0, five_match: 0 };
    Object.values(eligibleUserScores).forEach(scores => {
      const m = countMatches(scores, simNumbers);
      const lvl = getMatchLevel(m);
      if (lvl) matchCounts[lvl as keyof typeof matchCounts]++;
    });

    const revenue = Number(draw.total_revenue);
    const rollover = Number(draw.jackpot_rollover);
    const prizePools = {
      three_match: { pool: revenue * 0.25, winners: matchCounts.three_match },
      four_match:  { pool: revenue * 0.35, winners: matchCounts.four_match },
      five_match:  { pool: (revenue * 0.40) + rollover, winners: matchCounts.five_match },
    };

    return {
      simulation: true,
      winningNumbers: simNumbers,
      totalParticipants: Object.keys(eligibleUserScores).length,
      prizePools,
      matchCounts,
    };
  }

  async generateDraw(drawId: string) {
    const draw = await this.getDrawById(drawId);
    if (draw.status !== 'draft') throw new ForbiddenError('Only draft draws can have numbers generated');

    const winningNumbers = generateWinningNumbers();

    // Update draw with numbers and simulated status
    const { data: updated } = await supabase
      .from('draws')
      .update({
        winning_numbers: winningNumbers,
        status: 'simulated',
        simulated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', drawId)
      .select()
      .single();

    return updated;
  }

  async publishDraw(drawId: string) {
    const draw = await this.getDrawById(drawId);
    if (draw.status !== 'simulated') throw new ForbiddenError('Generate numbers before publishing');

    const winning = draw.winning_numbers as number[];
    const revenue = Number(draw.total_revenue);
    const rollover = Number(draw.jackpot_rollover);

    // Get all active subscription user IDs
    const today = new Date().toISOString().split('T')[0];
    const { data: activeSubs } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('status', 'active')
      .gte('end_date', today);
    const activeUserIds = new Set((activeSubs ?? []).map(s => s.user_id));

    // Get all user scores
    const { data: scores } = await supabase
      .from('user_scores')
      .select('user_id, score_value');

    // Group by user
    const userScores: Record<string, number[]> = {};
    (scores ?? []).forEach(e => {
      // Only include user if they have an active subscription
      if (!activeUserIds.has(e.user_id)) return;

      if (!userScores[e.user_id]) userScores[e.user_id] = [];
      userScores[e.user_id].push(e.score_value);
    });

    // Filter out users who do not have exactly 5 scores
    const eligibleUserScores: Record<string, number[]> = {};
    Object.entries(userScores).forEach(([userId, numbers]) => {
      if (numbers.length === APP_CONSTANTS.MAX_SCORES_PER_USER) {
        eligibleUserScores[userId] = numbers;
      }
    });

    // Categorise winners
    const winners: Record<string, { userId: string; numbers: number[]; matches: number; level: string }[]> = {
      five_match: [], four_match: [], three_match: [],
    };

    Object.entries(eligibleUserScores).forEach(([userId, numbers]) => {
      const m = countMatches(numbers, winning);
      const lvl = getMatchLevel(m);
      if (lvl) winners[lvl].push({ userId, numbers, matches: m, level: lvl });
    });

    // Create prize pools: Add jackpot_rollover ONLY to the five_match pool
    const pools = [
      { match_level: 'five_match',  allocation_pct: 40, pool_amount: (revenue * 0.40) + rollover },
      { match_level: 'four_match',  allocation_pct: 35, pool_amount: revenue * 0.35 },
      { match_level: 'three_match', allocation_pct: 25, pool_amount: revenue * 0.25 },
    ];

    // Upsert prize pools
    for (const pool of pools) {
      const winnerList = winners[pool.match_level];
      const perWinner = winnerList.length > 0 ? pool.pool_amount / winnerList.length : null;
      const rolledOver = winnerList.length === 0;

      await supabase.from('prize_pools').upsert({
        draw_id: drawId,
        match_level: pool.match_level,
        allocation_pct: pool.allocation_pct,
        pool_amount: pool.pool_amount,
        winner_count: winnerList.length,
        per_winner_amount: perWinner,
        rolled_over: rolledOver,
      }, { onConflict: 'draw_id,match_level' });
    }

    // Create draw entries + winner claims
    for (const [userId, numbers] of Object.entries(eligibleUserScores)) {
      const m = countMatches(numbers, winning);
      const lvl = getMatchLevel(m);

      // Upsert draw entry
      const { data: entry } = await supabase
        .from('draw_entries')
        .upsert({
          draw_id: drawId, user_id: userId,
          entry_numbers: numbers,
          match_level: lvl,
          match_count: m,
        }, { onConflict: 'draw_id,user_id' })
        .select()
        .single();

      // Create winner claim if they matched
      if (lvl && entry) {
        const pool = pools.find(p => p.match_level === lvl)!;
        const winnerList = winners[lvl];
        const prizeAmount = winnerList.length > 0 ? pool.pool_amount / winnerList.length : 0;

        await supabase.from('winner_claims').upsert({
          draw_id: drawId,
          user_id: userId,
          draw_entry_id: entry.id,
          match_level: lvl,
          prize_amount: prizeAmount,
        }, { onConflict: 'draw_id,user_id,match_level' });
      }
    }

    // Propagate rollover if no five_match winners
    const fiveMatchWinners = winners['five_match'].length;
    if (fiveMatchWinners === 0) {
      const fiveMatchPoolAmount = pools.find(p => p.match_level === 'five_match')!.pool_amount;

      // Find the chronologically next draft/simulated draw
      const { data: nextDraws } = await supabase
        .from('draws')
        .select('id, draw_month')
        .gt('draw_month', draw.draw_month)
        .in('status', ['draft', 'simulated'])
        .order('draw_month', { ascending: true })
        .limit(1);

      if (nextDraws && nextDraws.length > 0) {
        await supabase
          .from('draws')
          .update({
            jackpot_rollover: fiveMatchPoolAmount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', nextDraws[0].id);
      }
    }

    // Publish the draw
    const { data: published } = await supabase
      .from('draws')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', drawId)
      .select('*, prize_pools(*)')
      .single();

    return published;
  }

  async getAllDraws() {
    const { data } = await supabase
      .from('draws')
      .select('*, prize_pools(*), draw_entries(count)')
      .order('draw_month', { ascending: false });
    return data ?? [];
  }
}

export const drawsService = new DrawsService();
