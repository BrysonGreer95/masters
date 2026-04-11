// Point tables for each event — mirrors AboutView.vue point distributions
export const PUTT_PUTT_POINTS = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35];
export const SCRAMBLE_POINTS = [200, 175, 150, 125, 100, 75, 50];
export const FANTASY_POINTS = [300, 285, 270, 255, 240, 225, 210, 195, 180, 165, 150, 135, 120, 105];

/** Per-hole pars for each ParTee Shack course. Total: Yellow = 40, Blue = 42. */
export const PUTT_PAR_YELLOW = [2, 2, 3, 2, 3, 2, 2, 2, 3, 2, 3, 2, 2, 2, 2, 2, 2, 2];
export const PUTT_PAR_BLUE = [3, 2, 2, 2, 3, 2, 2, 3, 2, 2, 3, 3, 2, 3, 2, 2, 2, 2];

// Reedy Creek Golf Course hole pars (front 9 then back 9)
export const SCRAMBLE_PAR = [4, 4, 3, 4, 5, 4, 3, 4, 4, 4, 4, 3, 4, 5, 4, 3, 5, 4];

/**
 * Sum all non-null scores in an array.
 * Returns null if every entry is null (player/team hasn't started).
 */
export function holeTotal(scores) {
  if (!scores || scores.every((score) => score === null || score === undefined)) return null;
  return scores.reduce((runningTotal, score) => runningTotal + (score ?? 0), 0);
}

/**
 * Rank items by total strokes (ascending) and return a points map.
 *
 * Tie-breaking: if a `tiebreakers` map is provided ({ [id]: number }, lower = better),
 * tied items are sub-ranked by their tiebreaker value and receive distinct point values.
 * Without tiebreakers (or when tiebreaker values themselves tie), points are averaged
 * across the tied positions — never rounded, allowing half-point splits.
 *
 * @param {Array<{id: number|string, total: number|null}>} items
 * @param {number[]} pointsTable     - index 0 = 1st place points
 * @param {Object}  [tiebreakers={}] - { [id]: number } lower value wins the tiebreak
 * @returns {Object}                 - { [id]: { rank: number|null, points: number } }
 */
export function calcRankings(items, pointsTable, tiebreakers = {}) {
  const ranked = items
    .filter((item) => item.total !== null)
    .sort((a, b) => a.total - b.total);

  const result = {};
  const hasTiebreakers = Object.keys(tiebreakers).length > 0;
  let position = 0;

  while (position < ranked.length) {
    // Scan ahead to find the end of the group of items tied at this position
    let tieEnd = position;
    while (tieEnd < ranked.length && ranked[tieEnd].total === ranked[position].total) {
      tieEnd++;
    }
    const tiedGroup = ranked.slice(position, tieEnd);

    if (tiedGroup.length === 1 || !hasTiebreakers) {
      // No tiebreaker available — average points across all tied positions
      let totalPoints = 0;
      for (let idx = position; idx < tieEnd; idx++) totalPoints += pointsTable[idx] ?? 0;
      const avgPoints = totalPoints / tiedGroup.length;
      tiedGroup.forEach((item) => {
        result[item.id] = { rank: position + 1, points: avgPoints };
      });
    } else {
      // Sub-rank within the tie using tiebreakers (lower value = better)
      const subRanked = [...tiedGroup].sort(
        (a, b) => (tiebreakers[a.id] ?? Infinity) - (tiebreakers[b.id] ?? Infinity),
      );

      let subPosition = 0;
      while (subPosition < subRanked.length) {
        // Find all items sharing the same tiebreaker value (sub-tie)
        let subTieEnd = subPosition;
        const tbValue = tiebreakers[subRanked[subPosition].id] ?? Infinity;
        while (subTieEnd < subRanked.length && (tiebreakers[subRanked[subTieEnd].id] ?? Infinity) === tbValue) {
          subTieEnd++;
        }

        let totalPoints = 0;
        for (let idx = position + subPosition; idx < position + subTieEnd; idx++) {
          totalPoints += pointsTable[idx] ?? 0;
        }
        const avgPoints = totalPoints / (subTieEnd - subPosition);

        for (let idx = subPosition; idx < subTieEnd; idx++) {
          result[subRanked[idx].id] = { rank: position + subPosition + 1, points: avgPoints };
        }
        subPosition = subTieEnd;
      }
    }

    position = tieEnd;
  }

  // DNS / no scores — assign rank null and 0 points
  items
    .filter((item) => item.total === null)
    .forEach((item) => {
      result[item.id] = { rank: null, points: 0 };
    });

  return result;
}
