import { createStore } from 'vuex';
import defaultData from '../assets/data.json';
import scorecardData from '../assets/scorecard_data.json';
import {
  PUTT_PUTT_POINTS, SCRAMBLE_POINTS, FANTASY_POINTS,
  PUTT_PAR_YELLOW, PUTT_PAR_BLUE,
  holeTotal, calcRankings,
} from '../constants/scoring';

const STORAGE_KEY        = 'masters-scores';
const EVENTS_KEY         = 'masters-completed-events';
const PUTT_HOLES_KEY     = 'masters-putt-holes';
const PUTT_COURSE_KEY    = 'masters-putt-course';
const SCRAMBLE_HOLES_KEY = 'masters-scramble-holes';
const VERSION_KEY        = 'masters-data-version';

// ─── Version check ────────────────────────────────────────────────────────────
// If data.json's _version doesn't match localStorage, nuke all stale caches.

function checkVersion() {
  try {
    const stored = Number(localStorage.getItem(VERSION_KEY));
    if (stored !== defaultData._version) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EVENTS_KEY);
      localStorage.removeItem(PUTT_HOLES_KEY);
      localStorage.removeItem(PUTT_COURSE_KEY);
      localStorage.removeItem(SCRAMBLE_HOLES_KEY);
      localStorage.setItem(VERSION_KEY, String(defaultData._version));
    }
  } catch { /* ignore */ }
}

checkVersion();

// ─── Load helpers ─────────────────────────────────────────────────────────────

function loadPlayers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return JSON.parse(JSON.stringify(defaultData.players));
}

function loadCompletedEvents() {
  try {
    const saved = localStorage.getItem(EVENTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return { parTeeShack: false, scramble: false, fantasy: false };
}

function defaultPuttHoles() {
  const holes = {};
  defaultData.players.forEach((p) => {
    holes[p.id] = scorecardData.putt_putt.scores[p.id] ?? Array(18).fill(null);
  });
  return holes;
}

function loadPuttCourse() {
  try {
    const saved = localStorage.getItem(PUTT_COURSE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return scorecardData.putt_putt.courses ?? {};
}

function persistPuttCourse(course) {
  try { localStorage.setItem(PUTT_COURSE_KEY, JSON.stringify(course)); } catch { /* ignore */ }
}

function defaultScrambleHoles() {
  const holes = {};
  const teams = [...new Set(defaultData.players.map((p) => p.team).filter(Boolean))];
  teams.forEach((t) => {
    holes[t] = scorecardData.scramble.scores[t] ?? Array(18).fill(null);
  });
  return holes;
}

function loadPuttHoles() {
  try {
    const saved = localStorage.getItem(PUTT_HOLES_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultPuttHoles();
}

function loadScrambleHoles() {
  try {
    const saved = localStorage.getItem(SCRAMBLE_HOLES_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultScrambleHoles();
}

// ─── Persist helpers ──────────────────────────────────────────────────────────

function persist(players) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(players)); } catch { /* ignore */ }
}

function persistPuttHoles(holes) {
  try { localStorage.setItem(PUTT_HOLES_KEY, JSON.stringify(holes)); } catch { /* ignore */ }
}

function persistScrambleHoles(holes) {
  try { localStorage.setItem(SCRAMBLE_HOLES_KEY, JSON.stringify(holes)); } catch { /* ignore */ }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export default createStore({
  state() {
    return {
      players:        loadPlayers(),
      completedEvents: loadCompletedEvents(),
      puttPuttHoles:  loadPuttHoles(),
      puttCourse:     loadPuttCourse(),
      scrambleHoles:  loadScrambleHoles(),
    };
  },

  getters: {
    players:         (state) => state.players,
    completedEvents: (state) => state.completedEvents,
    hasLocalOverrides: () => !!localStorage.getItem(STORAGE_KEY),

    puttPuttHoles:   (state) => state.puttPuttHoles,
    puttCourse:      (state) => state.puttCourse,
    scrambleHoles:   (state) => state.scrambleHoles,

    sortedByTotal: (state) =>
      [...state.players]
        .sort((a, b) => {
          const totalA = a.parTeeShack + a.scramble + a.fantasy;
          const totalB = b.parTeeShack + b.scramble + b.fantasy;
          return totalB - totalA;
        })
        .map((p, idx) => ({ ...p, _rank: idx + 1 })),

    /** Live rankings computed from putt putt hole scores, ranked by strokes relative to course par. */
    puttPuttRankings(state) {
      const totals = state.players.map((p) => {
        const raw = holeTotal(state.puttPuttHoles[p.id] || []);
        if (raw === null) return { id: p.id, total: null };
        const parArr = (state.puttCourse[p.id] || 'yellow') === 'blue' ? PUTT_PAR_BLUE : PUTT_PAR_YELLOW;
        const parTotal = parArr.reduce((s, v) => s + v, 0);
        return { id: p.id, total: raw - parTotal };
      });
      return calcRankings(totals, PUTT_PUTT_POINTS);
    },

    /** Live rankings computed from scramble hole scores. { [teamNum]: { rank, points } } */
    scrambleRankings(state) {
      const teamNums = [...new Set(state.players.map((p) => p.team).filter(Boolean))];
      const totals = teamNums.map((t) => ({
        id:    t,
        total: holeTotal(state.scrambleHoles[t] || []),
      }));
      return calcRankings(totals, SCRAMBLE_POINTS);
    },
  },

  mutations: {
    // ─── Existing score mutations ───────────────────────────────────────────
    updateScore(state, { id, field, value }) {
      const player = state.players.find((p) => p.id === id);
      if (player && ['parTeeShack', 'scramble', 'fantasy'].includes(field)) {
        player[field] = Math.max(0, parseInt(value) || 0);
        persist(state.players);
      }
    },

    toggleEventCompleted(state, event) {
      state.completedEvents[event] = !state.completedEvents[event];
      try { localStorage.setItem(EVENTS_KEY, JSON.stringify(state.completedEvents)); } catch { /* ignore */ }
    },

    resetScores(state) {
      state.players        = JSON.parse(JSON.stringify(defaultData.players));
      state.completedEvents = { parTeeShack: false, scramble: false, fantasy: false };
      state.puttPuttHoles  = defaultPuttHoles();
      state.puttCourse     = {};
      state.scrambleHoles  = defaultScrambleHoles();
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(EVENTS_KEY);
        localStorage.removeItem(PUTT_HOLES_KEY);
        localStorage.removeItem(PUTT_COURSE_KEY);
        localStorage.removeItem(SCRAMBLE_HOLES_KEY);
      } catch { /* ignore */ }
    },

    setPuttCourse(state, { playerId, course }) {
      state.puttCourse = { ...state.puttCourse, [playerId]: course };
      persistPuttCourse(state.puttCourse);
    },

    // ─── Hole score mutations ───────────────────────────────────────────────
    updatePuttPuttHole(state, { playerId, holeIndex, value }) {
      const arr = [...(state.puttPuttHoles[playerId] ?? Array(18).fill(null))];
      arr[holeIndex] = (value === '' || value === null || value === undefined)
        ? null
        : Number(value);
      state.puttPuttHoles = { ...state.puttPuttHoles, [playerId]: arr };
      persistPuttHoles(state.puttPuttHoles);
    },

    updateScrambleHole(state, { teamNum, holeIndex, value }) {
      const arr = [...(state.scrambleHoles[teamNum] ?? Array(18).fill(null))];
      arr[holeIndex] = (value === '' || value === null || value === undefined)
        ? null
        : Number(value);
      state.scrambleHoles = { ...state.scrambleHoles, [teamNum]: arr };
      persistScrambleHoles(state.scrambleHoles);
    },

    // ─── Apply calculated points to player records ──────────────────────────

    /** Compute putt putt rankings from hole scores and write points to each player. */
    applyPuttPuttPoints(state) {
      const totals = state.players.map((p) => {
        const raw = holeTotal(state.puttPuttHoles[p.id] || []);
        if (raw === null) return { id: p.id, total: null };
        const parArr = (state.puttCourse[p.id] || 'yellow') === 'blue' ? PUTT_PAR_BLUE : PUTT_PAR_YELLOW;
        const parTotal = parArr.reduce((s, v) => s + v, 0);
        return { id: p.id, total: raw - parTotal };
      });
      const rankings = calcRankings(totals, PUTT_PUTT_POINTS);
      state.players.forEach((p) => {
        p.parTeeShack = rankings[p.id]?.points ?? 0;
      });
      persist(state.players);
    },

    /**
     * Apply fantasy points from a pre-computed scores array.
     * @param {Array<{id: number, total: number|null}>} scoreTotals
     */
    applyFantasyPoints(state, scoreTotals) {
      const actual = defaultData.actual_putts;
      const tiebreakers = actual != null
        ? Object.fromEntries(state.players.map((p) => [p.id, Math.abs((p.total_putts || 0) - actual)]))
        : {};
      const rankings = calcRankings(scoreTotals, FANTASY_POINTS, tiebreakers);
      state.players.forEach((p) => {
        p.fantasy = rankings[p.id]?.points ?? 0;
      });
      state.completedEvents.fantasy = true;
      persist(state.players);
      try { localStorage.setItem(EVENTS_KEY, JSON.stringify(state.completedEvents)); } catch { /* ignore */ }
    },

    /** Compute scramble team rankings and write points to both teammates. */
    applyScramblePoints(state) {
      const teamNums = [...new Set(state.players.map((p) => p.team).filter(Boolean))];
      const totals = teamNums.map((t) => ({
        id:    t,
        total: holeTotal(state.scrambleHoles[t] || []),
      }));
      const rankings = calcRankings(totals, SCRAMBLE_POINTS);
      state.players.forEach((p) => {
        if (p.team) p.scramble = rankings[p.team]?.points ?? 0;
      });
      persist(state.players);
    },
  },
});
