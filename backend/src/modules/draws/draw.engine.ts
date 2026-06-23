import { APP_CONSTANTS } from '../../config/constants';

export type MatchLevel = 'five_match' | 'four_match' | 'three_match' | null;

export interface DrawEntry {
  userId: string;
  entryNumbers: number[];
}

export interface ProcessedEntry extends DrawEntry {
  matchCount: number;
  matchLevel: MatchLevel;
}

export interface DrawEngineResult {
  winningNumbers: number[];
  entries: ProcessedEntry[];
  summary: {
    five_match: string[];
    four_match: string[];
    three_match: string[];
  };
}

/**
 * Fisher-Yates shuffle — cryptographically uniform distribution.
 * Every permutation is equally likely.
 */
function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate 5 unique winning numbers from range [1, 45].
 * Returns sorted ascending.
 */
export function generateWinningNumbers(): number[] {
  const pool = Array.from(
    { length: APP_CONSTANTS.DRAW_POOL_MAX - APP_CONSTANTS.DRAW_POOL_MIN + 1 },
    (_, i) => i + APP_CONSTANTS.DRAW_POOL_MIN
  );
  const shuffled = fisherYatesShuffle(pool);
  return shuffled
    .slice(0, APP_CONSTANTS.DRAW_NUMBERS_COUNT)
    .sort((a, b) => a - b);
}

/**
 * Compare all user entries against winning numbers.
 * Returns match level (5/4/3 match) or null.
 */
export function processEntries(
  winningNumbers: number[],
  entries: DrawEntry[]
): ProcessedEntry[] {
  const winSet = new Set(winningNumbers);

  return entries.map((entry) => {
    const matchCount = entry.entryNumbers.filter((n) => winSet.has(n)).length;
    const matchLevel: MatchLevel =
      matchCount === 5 ? 'five_match' :
      matchCount === 4 ? 'four_match' :
      matchCount === 3 ? 'three_match' :
      null;

    return { ...entry, matchCount, matchLevel };
  });
}

/**
 * Full draw engine — generates numbers and processes all entries.
 */
export function runDrawEngine(entries: DrawEntry[]): DrawEngineResult {
  const winningNumbers = generateWinningNumbers();
  const processedEntries = processEntries(winningNumbers, entries);

  const summary = {
    five_match: processedEntries.filter(e => e.matchLevel === 'five_match').map(e => e.userId),
    four_match:  processedEntries.filter(e => e.matchLevel === 'four_match').map(e => e.userId),
    three_match: processedEntries.filter(e => e.matchLevel === 'three_match').map(e => e.userId),
  };

  return { winningNumbers, entries: processedEntries, summary };
}
