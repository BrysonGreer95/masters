// Point tables for each event — mirrors AboutView.vue point distributions
export const PUTT_PUTT_POINTS = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5];
export const SCRAMBLE_POINTS  = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
export const FANTASY_POINTS   = [400, 380, 360, 340, 320, 300, 280, 260, 240, 220, 200, 180, 160, 140, 120, 100, 80, 60, 40, 20];

/** Per-hole pars for each ParTee Shack course. Yellow total = 40, Blue total = 42. */
export const PUTT_PAR_YELLOW = [2, 2, 3, 2, 3, 2, 2, 2, 3, 2, 3, 2, 2, 2, 2, 2, 2, 2];
export const PUTT_PAR_BLUE   = [3, 2, 2, 2, 3, 2, 2, 3, 2, 2, 3, 3, 2, 3, 2, 2, 2, 2];

/**
 * Combined 36-hole par array: holes 1–18 = Yellow course, holes 19–36 = Blue course.
 * Used for best-of-18 scoring in 2027+.
 */
export const PUTT_PAR_ALL = [...PUTT_PAR_YELLOW, ...PUTT_PAR_BLUE];

// Scramble 1 — Reedy Creek Golf Course (front 9 then back 9)
export const SCRAMBLE_PAR  = [4, 4, 3, 5, 4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 5, 3, 4, 4];

// Scramble 2 — course TBD; update pars when venue is confirmed
export const SCRAMBLE2_PAR = [4, 4, 3, 5, 4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 5, 3, 4, 4];

/**
 * Sum all non-null scores in an array.
 * Returns null if every entry is null (player/team hasn't started).
 */
export function holeTotal(scores) {
  if (!scores || scores.every((score) => score === null || score === undefined)) return null;
  return scores.reduce((runningTotal, score) => runningTotal + (score ?? 0), 0);
}

/**
 * Best-of-18 scoring for ParTee Shack.
 *
 * Players play all 36 holes (holes 0–17 = Yellow, holes 18–35 = Blue).
 * Score is determined by the 18 individual holes where the player performed
 * best relative to par. Returns the sum of those 18 hole-over-par values
 * (lower is better), or null if fewer than 18 holes have been played.
 *
 * @param {Array<number|null>} scores - 36-element array of hole strokes
 * @param {number[]}           pars   - 36-element par array (PUTT_PAR_ALL)
 * @returns {number|null}
 */
export function bestOf18Score(scores, pars) {
  const relative = scores.map((s, i) => (s === null || s === undefined) ? null : s - pars[i]);
  const valid = relative.filter((v) => v !== null);
  if (valid.length < 18) return null;
  const sorted = [...valid].sort((a, b) => a - b);
  return sorted.slice(0, 18).reduce((sum, v) => sum + v, 0);
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
    let tieEnd = position;
    while (tieEnd < ranked.length && ranked[tieEnd].total === ranked[position].total) {
      tieEnd++;
    }
    const tiedGroup = ranked.slice(position, tieEnd);

    if (tiedGroup.length === 1 || !hasTiebreakers) {
      let totalPoints = 0;
      for (let idx = position; idx < tieEnd; idx++) totalPoints += pointsTable[idx] ?? 0;
      const avgPoints = totalPoints / tiedGroup.length;
      tiedGroup.forEach((item) => {
        result[item.id] = { rank: position + 1, points: avgPoints };
      });
    } else {
      const subRanked = [...tiedGroup].sort(
        (a, b) => (tiebreakers[a.id] ?? Infinity) - (tiebreakers[b.id] ?? Infinity),
      );

      let subPosition = 0;
      while (subPosition < subRanked.length) {
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

  items
    .filter((item) => item.total === null)
    .forEach((item) => {
      result[item.id] = { rank: null, points: 0 };
    });

  return result;
}
