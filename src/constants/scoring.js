// Point tables for each event — mirrors AboutView.vue point distributions
export const PUTT_PUTT_POINTS = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35];
export const SCRAMBLE_POINTS  = [200, 175, 150, 125, 100, 75, 50];
export const FANTASY_POINTS   = [300, 285, 270, 255, 240, 225, 210, 195, 180, 165, 150, 135, 120, 105];

/** Per-hole pars for each ParTee Shack course. Total: Yellow = 40, Blue = 42. */
export const PUTT_PAR_YELLOW = [2,2,3,2,3,2,2,2,3,2,3,2,2,2,2,2,2,2];
export const PUTT_PAR_BLUE   = [3,2,2,2,3,2,2,3,2,2,3,3,2,3,2,2,2,2];

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
 *
 * Tie-breaking: if a `tiebreakers` map is provided ({ [id]: number }, lower = better),
 * tied items are sub-ranked by their tiebreaker value and receive distinct point values.
 * Without tiebreakers (or when tiebreaker values themselves tie), points are averaged
 * across the tied positions.
 *
 * @param {Array<{id: number|string, total: number|null}>} items
 * @param {number[]} pointsTable        - index 0 = 1st place points
 * @param {Object}  [tiebreakers={}]    - { [id]: number } lower value wins the tiebreak
 * @returns {Object}                    - { [id]: { rank: number|null, points: number } }
 */
export function calcRankings(items, pointsTable, tiebreakers = {}) {
  const played = items
    .filter((x) => x.total !== null)
    .sort((a, b) => a.total - b.total);
  const result = {};

  let i = 0;
  while (i < played.length) {
    // Collect all items tied on total strokes
    let j = i;
    while (j < played.length && played[j].total === played[i].total) j++;
    const tiedGroup = played.slice(i, j);

    if (tiedGroup.length === 1 || Object.keys(tiebreakers).length === 0) {
      // No tiebreaker available — average points across tied positions
      let totalPts = 0;
      for (let k = i; k < j; k++) totalPts += pointsTable[k] ?? 0;
      const avgPts = totalPts / tiedGroup.length;
      tiedGroup.forEach((x) => { result[x.id] = { rank: i + 1, points: avgPts }; });
    } else {
      // Sub-rank within the tie using tiebreakers (lower = better)
      const subRanked = [...tiedGroup].sort(
        (a, b) => (tiebreakers[a.id] ?? Infinity) - (tiebreakers[b.id] ?? Infinity),
      );

      let si = 0;
      while (si < subRanked.length) {
        // Find sub-ties (same tiebreaker value)
        let sj = si;
        const tbVal = tiebreakers[subRanked[si].id] ?? Infinity;
        while (sj < subRanked.length && (tiebreakers[subRanked[sj].id] ?? Infinity) === tbVal) sj++;

        // Average only across this sub-tied slice
        let totalPts = 0;
        for (let k = i + si; k < i + sj; k++) totalPts += pointsTable[k] ?? 0;
        const avgPts = totalPts / (sj - si);
        for (let k = si; k < sj; k++) {
          result[subRanked[k].id] = { rank: i + si + 1, points: avgPts };
        }
        si = sj;
      }
    }

    i = j;
  }

  // DNS / no scores
  items.filter((x) => x.total === null).forEach((x) => {
    result[x.id] = { rank: null, points: 0 };
  });

  return result;
}
