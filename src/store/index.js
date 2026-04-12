import { createStore } from 'vuex';
import defaultData from '../assets/data.json';
import {
  PUTT_PUTT_POINTS, SCRAMBLE_POINTS, FANTASY_POINTS,
  PUTT_PAR_YELLOW, PUTT_PAR_BLUE,
  holeTotal, calcRankings,
} from '../constants/scoring';

const EVENTS_KEY         = 'masters-completed-events';
const PUTT_HOLES_KEY     = 'masters-putt-holes';
const PUTT_COURSE_KEY    = 'masters-putt-course';
const SCRAMBLE_HOLES_KEY = 'masters-scramble-holes';
const FANTASY_POINTS_KEY = 'masters-fantasy-points';
const VERSION_KEY        = 'masters-data-version';

// ─── Version check ────────────────────────────────────────────────────────────
// If data.json's _version doesn't match localStorage, nuke all stale caches.

function checkVersion() {
  try {
    const storedVersion = Number(localStorage.getItem(VERSION_KEY));
    if (storedVersion !== defaultData._version) {
      localStorage.removeItem(EVENTS_KEY);
      localStorage.removeItem(PUTT_HOLES_KEY);
      localStorage.removeItem(PUTT_COURSE_KEY);
      localStorage.removeItem(SCRAMBLE_HOLES_KEY);
      localStorage.removeItem(FANTASY_POINTS_KEY);
      localStorage.setItem(VERSION_KEY, String(defaultData._version));
    }
  } catch { /* ignore */ }
}

checkVersion();

// ─── Default builders ─────────────────────────────────────────────────────────
// These seed from data.json's scorecard section so entered scores survive a
// page refresh without needing to re-enter them via the admin UI.

function defaultPuttHoles() {
  const holes = {};
  defaultData.players.forEach((player) => {
    holes[player.id] = defaultData.scorecard.putt_putt.scores[player.id] ?? Array(18).fill(null);
  });
  return holes;
}

function defaultScrambleHoles() {
  const holes = {};
  const teamNumbers = [...new Set(defaultData.players.map((p) => p.team).filter(Boolean))];
  teamNumbers.forEach((teamNum) => {
    holes[teamNum] = defaultData.scorecard.scramble.scores[teamNum] ?? Array(18).fill(null);
  });
  return holes;
}

// ─── Load helpers ─────────────────────────────────────────────────────────────

function loadCompletedEvents() {
  try {
    const saved = localStorage.getItem(EVENTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return { parTeeShack: false, scramble: false, fantasy: false };
}

function loadPuttHoles() {
  try {
    const saved = localStorage.getItem(PUTT_HOLES_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultPuttHoles();
}

function loadPuttCourse() {
  try {
    const saved = localStorage.getItem(PUTT_COURSE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultData.scorecard.putt_putt.courses ?? {};
}

function loadScrambleHoles() {
  try {
    const saved = localStorage.getItem(SCRAMBLE_HOLES_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultScrambleHoles();
}

function loadFantasyPoints() {
  try {
    const saved = localStorage.getItem(FANTASY_POINTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return {};
}

// ─── Persist helpers ──────────────────────────────────────────────────────────

function persistPuttHoles(holes) {
  try { localStorage.setItem(PUTT_HOLES_KEY, JSON.stringify(holes)); } catch { /* ignore */ }
}

function persistPuttCourse(course) {
  try { localStorage.setItem(PUTT_COURSE_KEY, JSON.stringify(course)); } catch { /* ignore */ }
}

function persistScrambleHoles(holes) {
  try { localStorage.setItem(SCRAMBLE_HOLES_KEY, JSON.stringify(holes)); } catch { /* ignore */ }
}

function persistFantasyPoints(points) {
  try { localStorage.setItem(FANTASY_POINTS_KEY, JSON.stringify(points)); } catch { /* ignore */ }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export default createStore({
  state() {
    return {
      players:         JSON.parse(JSON.stringify(defaultData.players)),
      completedEvents: loadCompletedEvents(),
      puttPuttHoles:   loadPuttHoles(),
      puttCourse:      loadPuttCourse(),
      scrambleHoles:   loadScrambleHoles(),
      fantasyPoints:   loadFantasyPoints(),
    };
  },

  getters: {
    players:         (state) => state.players,
    completedEvents: (state) => state.completedEvents,

    puttPuttHoles:  (state) => state.puttPuttHoles,
    puttCourse:     (state) => state.puttCourse,
    scrambleHoles:  (state) => state.scrambleHoles,

    /** Overall standings — injects computed parTeeShack/scramble/fantasy so consumers don't change. */
    sortedByTotal(state, getters) {
      return [...state.players]
        .map((player) => ({
          ...player,
          parTeeShack: getters.puttPuttRankings[player.id]?.points ?? 0,
          scramble:    getters.scrambleRankings[player.team]?.points ?? 0,
          fantasy:     state.fantasyPoints[player.id] ?? 0,
        }))
        .sort((a, b) =>
          (b.parTeeShack + b.scramble + b.fantasy) - (a.parTeeShack + a.scramble + a.fantasy)
        )
        .map((player, index) => ({ ...player, _rank: index + 1 }));
    },

    /** Live rankings computed from putt putt hole scores, ranked by strokes relative to course par. */
    puttPuttRankings(state) {
      const totals = state.players.map((player) => {
        const raw = holeTotal(state.puttPuttHoles[player.id] || []);
        if (raw === null) return { id: player.id, total: null };
        const parArray = (state.puttCourse[player.id] || 'yellow') === 'blue' ? PUTT_PAR_BLUE : PUTT_PAR_YELLOW;
        const parTotal = parArray.reduce((sum, par) => sum + par, 0);
        return { id: player.id, total: raw - parTotal };
      });
      return calcRankings(totals, PUTT_PUTT_POINTS);
    },

    /** Live rankings computed from scramble hole scores. { [teamNum]: { rank, points } } */
    scrambleRankings(state) {
      const teamNumbers = [...new Set(state.players.map((p) => p.team).filter(Boolean))];
      const totals = teamNumbers.map((teamNum) => ({
        id:    teamNum,
        total: holeTotal(state.scrambleHoles[teamNum] || []),
      }));
      return calcRankings(totals, SCRAMBLE_POINTS);
    },
  },

  mutations: {
    toggleEventCompleted(state, event) {
      state.completedEvents[event] = !state.completedEvents[event];
      try { localStorage.setItem(EVENTS_KEY, JSON.stringify(state.completedEvents)); } catch { /* ignore */ }
    },

    resetScores(state) {
      state.players        = JSON.parse(JSON.stringify(defaultData.players));
      state.completedEvents = { parTeeShack: false, scramble: false, fantasy: false };
      state.puttPuttHoles  = defaultPuttHoles();
      state.puttCourse     = defaultData.scorecard.putt_putt.courses ?? {};
      state.scrambleHoles  = defaultScrambleHoles();
      state.fantasyPoints  = {};
      try {
        localStorage.removeItem(EVENTS_KEY);
        localStorage.removeItem(PUTT_HOLES_KEY);
        localStorage.removeItem(PUTT_COURSE_KEY);
        localStorage.removeItem(SCRAMBLE_HOLES_KEY);
        localStorage.removeItem(FANTASY_POINTS_KEY);
      } catch { /* ignore */ }
    },

    setPuttCourse(state, { playerId, course }) {
      state.puttCourse = { ...state.puttCourse, [playerId]: course };
      persistPuttCourse(state.puttCourse);
    },

    updatePuttPuttHole(state, { playerId, holeIndex, value }) {
      const scores = [...(state.puttPuttHoles[playerId] ?? Array(18).fill(null))];
      scores[holeIndex] = (value === '' || value === null || value === undefined)
        ? null
        : Number(value);
      state.puttPuttHoles = { ...state.puttPuttHoles, [playerId]: scores };
      persistPuttHoles(state.puttPuttHoles);
    },

    updateScrambleHole(state, { teamNum, holeIndex, value }) {
      const scores = [...(state.scrambleHoles[teamNum] ?? Array(18).fill(null))];
      scores[holeIndex] = (value === '' || value === null || value === undefined)
        ? null
        : Number(value);
      state.scrambleHoles = { ...state.scrambleHoles, [teamNum]: scores };
      persistScrambleHoles(state.scrambleHoles);
    },

    /**
     * Compute and lock in fantasy points from a pre-computed score totals array.
     * Called automatically by Masters.vue once roundStatus is "Official".
     * Points are ranked, tiebroken by closeness to actual_putts when available.
     * @param {Array<{id: number, total: number|null}>} scoreTotals
     */
    applyFantasyPoints(state, scoreTotals) {
      const actualPutts = defaultData.actual_putts;
      const tiebreakers = actualPutts != null
        ? Object.fromEntries(state.players.map((p) => [p.id, Math.abs((p.total_putts || 0) - actualPutts)]))
        : {};
      const rankings = calcRankings(scoreTotals, FANTASY_POINTS, tiebreakers);
      state.fantasyPoints = Object.fromEntries(
        state.players.map((p) => [p.id, rankings[p.id]?.points ?? 0])
      );
      state.completedEvents.fantasy = true;
      persistFantasyPoints(state.fantasyPoints);
      try { localStorage.setItem(EVENTS_KEY, JSON.stringify(state.completedEvents)); } catch { /* ignore */ }
    },
  },
});
