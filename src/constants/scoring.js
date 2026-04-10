// Point tables for each event — mirrors AboutView.vue point distributions
export const PUTT_PUTT_POINTS = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35];
export const SCRAMBLE_POINTS  = [200, 175, 150, 125, 100, 75, 50];
export const FANTASY_POINTS   = [300, 285, 270, 255, 240, 225, 210, 195, 180, 165, 150, 135, 120, 105];

export const PUTT_PAR = 2; // par per hole at ParTee Shack

// Reedy Creek Golf Course hole pars (front 9 then back 9)
export const SCRAMBLE_PAR = [4, 4, 3, 4, 5, 4, 3, 4, 4, 4, 4, 3, 4, 5, 4, 3, 5, 4];

/**
 * Sum all non-null scores in an array.
 * Returns null if every entry is null (player/team hasn't started).
 */
export function holeTotal(scores) {
  if (!scores || scores.every((s) => s === null || s === undefined)) return null;
  return scores.reduce((sum, s) => sum + (s ?? 0), 0);
}

/**
 * Rank items by total strokes (ascending) and return a points map.
 * Handles ties by averaging the point values for the tied positions.
 *
 * @param {Array<{id: number|string, total: number|null}>} items
 * @param {number[]} pointsTable  - index 0 = 1st place points
 * @returns {Object}              - { [id]: { rank: number|null, points: number } }
 */
export function calcRankings(items, pointsTable) {
  const played = items
    .filter((x) => x.total !== null)
    .sort((a, b) => a.total - b.total);
  const result = {};

  let i = 0;
  while (i < played.length) {
    // Find all tied at this total
    let j = i;
    while (j < played.length && played[j].total === played[i].total) j++;
    // Average the points for positions i…j-1
    let totalPts = 0;
    for (let k = i; k < j; k++) totalPts += pointsTable[k] ?? 0;
    const avgPts = Math.round(totalPts / (j - i));
    for (let k = i; k < j; k++) {
      result[played[k].id] = { rank: i + 1, points: avgPts };
    }
    i = j;
  }

  // DNS / no scores
  items.filter((x) => x.total === null).forEach((x) => {
    result[x.id] = { rank: null, points: 0 };
  });

  return result;
}
