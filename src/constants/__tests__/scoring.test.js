import {
  PUTT_PUTT_POINTS,
  SCRAMBLE_POINTS,
  FANTASY_POINTS,
  holeTotal,
  calcRankings,
} from '../scoring';

// ─── holeTotal ────────────────────────────────────────────────────────────────

describe('holeTotal', () => {
  test('returns null when all holes are null', () => {
    expect(holeTotal([null, null, null])).toBeNull();
  });

  test('returns null for empty array', () => {
    expect(holeTotal([])).toBeNull();
  });

  test('returns null for falsy input', () => {
    expect(holeTotal(null)).toBeNull();
    expect(holeTotal(undefined)).toBeNull();
  });

  test('sums non-null scores, treating remaining nulls as 0', () => {
    expect(holeTotal([2, null, 3, null])).toBe(5);
  });

  test('sums a fully-entered 36-hole putt putt round', () => {
    const scores = Array(36).fill(2); // all pars
    expect(holeTotal(scores)).toBe(72);
  });

  test('sums a fully-entered 18-hole scramble round', () => {
    const scores = [4, 4, 3, 4, 5, 4, 3, 4, 4, 4, 4, 3, 4, 5, 4, 3, 5, 4];
    expect(holeTotal(scores)).toBe(71);
  });
});

// ─── calcRankings — Putt Putt ─────────────────────────────────────────────────

describe('calcRankings — Putt Putt', () => {
  test('clean standings: all 14 players receive their exact point value', () => {
    const items = Array.from({ length: 14 }, (_, index) => ({ id: index + 1, total: 60 + index }));
    const result = calcRankings(items, PUTT_PUTT_POINTS);
    PUTT_PUTT_POINTS.forEach((pts, index) => {
      expect(result[index + 1].points).toBe(pts);
      expect(result[index + 1].rank).toBe(index + 1);
    });
  });

  test('1st place gets 100 pts', () => {
    const items = [{ id: 1, total: 60 }, { id: 2, total: 70 }];
    expect(calcRankings(items, PUTT_PUTT_POINTS)[1]).toEqual({ rank: 1, points: 100 });
  });

  test('14th place gets 35 pts', () => {
    const items = Array.from({ length: 14 }, (_, index) => ({ id: index + 1, total: 60 + index }));
    expect(calcRankings(items, PUTT_PUTT_POINTS)[14]).toEqual({ rank: 14, points: 35 });
  });

  test('2-way tie for 1st splits (100+95)/2 = 97.5 each', () => {
    const items = [
      { id: 1, total: 60 },
      { id: 2, total: 60 },
      { id: 3, total: 65 },
    ];
    const result = calcRankings(items, PUTT_PUTT_POINTS);
    expect(result[1].points).toBe(97.5);
    expect(result[2].points).toBe(97.5);
    expect(result[1].rank).toBe(1);
    expect(result[2].rank).toBe(1);
    expect(result[3].rank).toBe(3);
    expect(result[3].points).toBe(90);
  });

  test('3-way tie for 1st splits (100+95+90)/3 = 95 each', () => {
    const items = [
      { id: 1, total: 60 },
      { id: 2, total: 60 },
      { id: 3, total: 60 },
      { id: 4, total: 70 },
    ];
    const result = calcRankings(items, PUTT_PUTT_POINTS);
    expect(result[1].points).toBe(95);
    expect(result[2].points).toBe(95);
    expect(result[3].points).toBe(95);
    expect(result[4].rank).toBe(4);
    expect(result[4].points).toBe(85);
  });

  test('DNS player gets 0 pts and null rank', () => {
    const items = [{ id: 1, total: 65 }, { id: 2, total: null }];
    expect(calcRankings(items, PUTT_PUTT_POINTS)[2]).toEqual({ rank: null, points: 0 });
  });

  test('multiple DNS players all get 0 pts', () => {
    const items = [
      { id: 1, total: 65 },
      { id: 2, total: null },
      { id: 3, total: null },
    ];
    const result = calcRankings(items, PUTT_PUTT_POINTS);
    expect(result[2]).toEqual({ rank: null, points: 0 });
    expect(result[3]).toEqual({ rank: null, points: 0 });
  });
});

// ─── calcRankings — Scramble ──────────────────────────────────────────────────

describe('calcRankings — Scramble', () => {
  test('clean standings: all 7 teams receive their exact point value', () => {
    const items = Array.from({ length: 7 }, (_, index) => ({ id: index + 1, total: 65 + index }));
    const result = calcRankings(items, SCRAMBLE_POINTS);
    SCRAMBLE_POINTS.forEach((pts, index) => {
      expect(result[index + 1].points).toBe(pts);
      expect(result[index + 1].rank).toBe(index + 1);
    });
  });

  test('1st place gets 200 pts, 7th gets 50 pts', () => {
    const items = Array.from({ length: 7 }, (_, index) => ({ id: index + 1, total: 65 + index }));
    const result = calcRankings(items, SCRAMBLE_POINTS);
    expect(result[1]).toEqual({ rank: 1, points: 200 });
    expect(result[7]).toEqual({ rank: 7, points: 50 });
  });

  test('2-way tie for 1st splits (200+175)/2 = 187.5 each', () => {
    const items = [
      { id: 1, total: 65 },
      { id: 2, total: 65 },
      { id: 3, total: 70 },
    ];
    const result = calcRankings(items, SCRAMBLE_POINTS);
    expect(result[1].points).toBe(187.5);
    expect(result[2].points).toBe(187.5);
    expect(result[3].rank).toBe(3);
    expect(result[3].points).toBe(150);
  });

  test('mid-pack 2-way tie for 3rd splits (150+125)/2 = 137.5 each', () => {
    const items = [
      { id: 1, total: 63 },
      { id: 2, total: 64 },
      { id: 3, total: 68 },
      { id: 4, total: 68 },
      { id: 5, total: 70 },
    ];
    const result = calcRankings(items, SCRAMBLE_POINTS);
    expect(result[3].points).toBe(137.5);
    expect(result[4].points).toBe(137.5);
    expect(result[3].rank).toBe(3);
    expect(result[4].rank).toBe(3);
    expect(result[5].rank).toBe(5);
    expect(result[5].points).toBe(100);
  });
});

// ─── calcRankings — Fantasy (with total_putts tiebreaker) ────────────────────

describe('calcRankings — Fantasy', () => {
  test('clean standings: all 14 players receive their exact point value', () => {
    const items = Array.from({ length: 14 }, (_, index) => ({ id: index + 1, total: -20 + index }));
    const result = calcRankings(items, FANTASY_POINTS);
    FANTASY_POINTS.forEach((pts, index) => {
      expect(result[index + 1].points).toBe(pts);
      expect(result[index + 1].rank).toBe(index + 1);
    });
  });

  test('negative totals sort correctly — more negative = better', () => {
    const items = [
      { id: 1, total: -5 },
      { id: 2, total: -15 },
      { id: 3, total: 0 },
    ];
    const result = calcRankings(items, FANTASY_POINTS);
    expect(result[2].rank).toBe(1);
    expect(result[1].rank).toBe(2);
    expect(result[3].rank).toBe(3);
  });

  test('2-way tie with no tiebreaker splits (300+285)/2 = 292.5 each', () => {
    const items = [
      { id: 1, total: -12 },
      { id: 2, total: -12 },
      { id: 3, total: -8 },
    ];
    const result = calcRankings(items, FANTASY_POINTS);
    expect(result[1].points).toBe(292.5);
    expect(result[2].points).toBe(292.5);
  });

  // Tiebreaker = |prediction - actual_putts|, lower diff wins.
  // e.g. actual = 9000, id1 predicted 9042 (diff 42), id2 predicted 8712 (diff 288) → id1 wins
  test('2-way tie: closest total_putts prediction wins 1st (300), other gets 2nd (285)', () => {
    const actual = 9000;
    const items = [
      { id: 1, total: -12 },
      { id: 2, total: -12 },
      { id: 3, total: -8 },
    ];
    // id1 diff = |9042 - 9000| = 42, id2 diff = |8712 - 9000| = 288 → id1 closer
    const tiebreakers = { 1: Math.abs(9042 - actual), 2: Math.abs(8712 - actual), 3: Math.abs(8886 - actual) };
    const result = calcRankings(items, FANTASY_POINTS, tiebreakers);
    expect(result[1].rank).toBe(1);
    expect(result[1].points).toBe(300);
    expect(result[2].rank).toBe(2);
    expect(result[2].points).toBe(285);
    expect(result[3].rank).toBe(3);
    expect(result[3].points).toBe(270);
  });

  test('3-way tie: closest predictions assign distinct 1st, 2nd, 3rd', () => {
    const actual = 9000;
    const items = [
      { id: 1, total: -12 }, // predicted 8950, diff 50
      { id: 2, total: -12 }, // predicted 9200, diff 200
      { id: 3, total: -12 }, // predicted 9010, diff 10 → closest, wins
      { id: 4, total: -8 },
    ];
    const tiebreakers = {
      1: Math.abs(8950 - actual),  // 50
      2: Math.abs(9200 - actual),  // 200
      3: Math.abs(9010 - actual),  // 10
      4: Math.abs(9100 - actual),
    };
    const result = calcRankings(items, FANTASY_POINTS, tiebreakers);
    expect(result[3].rank).toBe(1);
    expect(result[3].points).toBe(300);
    expect(result[1].rank).toBe(2);
    expect(result[1].points).toBe(285);
    expect(result[2].rank).toBe(3);
    expect(result[2].points).toBe(270);
    expect(result[4].rank).toBe(4);
    expect(result[4].points).toBe(255);
  });

  test('tiebreaker sub-tie: identical prediction diff still splits those two', () => {
    const actual = 9000;
    const items = [
      { id: 1, total: -12 },
      { id: 2, total: -12 },
      { id: 3, total: -8 },
    ];
    // both predicted exactly 9000 — diff 0 for both
    const tiebreakers = { 1: Math.abs(9000 - actual), 2: Math.abs(9000 - actual), 3: 50 };
    const result = calcRankings(items, FANTASY_POINTS, tiebreakers);
    expect(result[1].points).toBe(292.5);
    expect(result[2].points).toBe(292.5);
  });

  test('tiebreaker only resolves the tied group, not surrounding ranks', () => {
    const actual = 9000;
    const items = [
      { id: 1, total: -15 }, // clear 1st
      { id: 2, total: -10 }, // predicted 9200, diff 200
      { id: 3, total: -10 }, // predicted 9050, diff 50 → closer, wins 2nd
    ];
    const tiebreakers = { 1: 0, 2: Math.abs(9200 - actual), 3: Math.abs(9050 - actual) };
    const result = calcRankings(items, FANTASY_POINTS, tiebreakers);
    expect(result[1].rank).toBe(1);
    expect(result[1].points).toBe(300);
    expect(result[3].rank).toBe(2);
    expect(result[3].points).toBe(285);
    expect(result[2].rank).toBe(3);
    expect(result[2].points).toBe(270);
  });

  test('DNS player (no picks) gets 0 pts, null rank, unaffected by tiebreaker', () => {
    const items = [
      { id: 1, total: -10 },
      { id: 2, total: null },
    ];
    const tiebreakers = { 1: 42, 2: 10 };
    const result = calcRankings(items, FANTASY_POINTS, tiebreakers);
    expect(result[2]).toEqual({ rank: null, points: 0 });
  });
});

// ─── Point table sanity checks ────────────────────────────────────────────────

describe('point tables', () => {
  test('PUTT_PUTT_POINTS has 14 entries', () => {
    expect(PUTT_PUTT_POINTS).toHaveLength(14);
  });

  test('SCRAMBLE_POINTS has 7 entries', () => {
    expect(SCRAMBLE_POINTS).toHaveLength(7);
  });

  test('FANTASY_POINTS has 14 entries', () => {
    expect(FANTASY_POINTS).toHaveLength(14);
  });

  test('PUTT_PUTT_POINTS is strictly descending', () => {
    for (let index = 1; index < PUTT_PUTT_POINTS.length; index++) {
      expect(PUTT_PUTT_POINTS[index]).toBeLessThan(PUTT_PUTT_POINTS[index - 1]);
    }
  });

  test('SCRAMBLE_POINTS is strictly descending', () => {
    for (let index = 1; index < SCRAMBLE_POINTS.length; index++) {
      expect(SCRAMBLE_POINTS[index]).toBeLessThan(SCRAMBLE_POINTS[index - 1]);
    }
  });

  test('FANTASY_POINTS is strictly descending', () => {
    for (let index = 1; index < FANTASY_POINTS.length; index++) {
      expect(FANTASY_POINTS[index]).toBeLessThan(FANTASY_POINTS[index - 1]);
    }
  });
});
