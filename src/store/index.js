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
    const storedVersion = Number(localStorage.getItem(VERSION_KEY));
    if (storedVersion !== defaultData._version) {
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

// ─── Default builders ─────────────────────────────────────────────────────────
// These seed from scorecard_data.json so manually-entered scores survive a
// version bump without needing to re-enter them via the admin UI.

function defaultPuttHoles() {
  const holes = {};
  defaultData.players.forEach((player) => {
    holes[player.id] = scorecardData.putt_putt.scores[player.id] ?? Array(18).fill(null);
  });
  return holes;
}

function defaultScrambleHoles() {
  const holes = {};
  const teamNumbers = [...new Set(defaultData.players.map((player) => player.team).filter(Boolean))];
  teamNumbers.forEach((teamNum) => {
    holes[teamNum] = scorecardData.scramble.scores[teamNum] ?? Array(18).fill(null);
  });
  return holes;
}

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
  return scorecardData.putt_putt.courses ?? {};
}

function loadScrambleHoles() {
  try {
    const saved = localStorage.getItem(SCRAMBLE_HOLES_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultScrambleHoles();
}

// ─── Persist helpers ──────────────────────────────────────────────────────────

function persistPlayers(players) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(players)); } catch { /* ignore */ }
}

function persistPuttHoles(holes) {
  try { localStorage.setItem(PUTT_HOLES_KEY, JSON.stringify(holes)); } catch { /* ignore */ }
}

function persistPuttCourse(course) {
  try { localStorage.setItem(PUTT_COURSE_KEY, JSON.stringify(course)); } catch { /* ignore */ }
}

function persistScrambleHoles(holes) {
  try { localStorage.setItem(SCRAMBLE_HOLES_KEY, JSON.stringify(holes)); } catch { /* ignore */ }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export default createStore({
  state() {
    return {
      players:         loadPlayers(),
      completedEvents: loadCompletedEvents(),
      puttPuttHoles:   loadPuttHoles(),
      puttCourse:      loadPuttCourse(),
      scrambleHoles:   loadScrambleHoles(),
    };
  },

  getters: {
    players:           (state) => state.players,
    completedEvents:   (state) => state.completedEvents,
    hasLocalOverrides: ()      => !!localStorage.getItem(STORAGE_KEY),

    puttPuttHoles:  (state) => state.puttPuttHoles,
    puttCourse:     (state) => state.puttCourse,
    scrambleHoles:  (state) => state.scrambleHoles,

    sortedByTotal: (state) =>
      [...state.players]
        .sort((a, b) => {
          const totalA = a.parTeeShack + a.scramble + a.fantasy;
          const totalB = b.parTeeShack + b.scramble + b.fantasy;
          return totalB - totalA;
        })
        .map((player, index) => ({ ...player, _rank: index + 1 })),

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
      const teamNumbers = [...new Set(state.players.map((player) => player.team).filter(Boolean))];
      const totals = teamNumbers.map((teamNum) => ({
        id:    teamNum,
        total: holeTotal(state.scrambleHoles[teamNum] || []),
      }));
      return calcRankings(totals, SCRAMBLE_POINTS);
    },
  },

  mutations: {
    updateScore(state, { id, field, value }) {
      const player = state.players.find((player) => player.id === id);
      if (player && ['parTeeShack', 'scramble', 'fantasy'].includes(field)) {
        player[field] = Math.max(0, parseInt(value) || 0);
        persistPlayers(state.players);
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
      state.puttCourse     = scorecardData.putt_putt.courses ?? {};
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
     * Apply fantasy points from a pre-computed scores array.
     * Called automatically by Masters.vue once the tournament is officially over.
     * @param {Array<{id: number, total: number|null}>} scoreTotals
     */
    applyFantasyPoints(state, scoreTotals) {
      const actualPutts = defaultData.actual_putts;
      const tiebreakers = actualPutts != null
        ? Object.fromEntries(state.players.map((player) => [player.id, Math.abs((player.total_putts || 0) - actualPutts)]))
        : {};
      const rankings = calcRankings(scoreTotals, FANTASY_POINTS, tiebreakers);
      state.players.forEach((player) => {
        player.fantasy = rankings[player.id]?.points ?? 0;
      });
      state.completedEvents.fantasy = true;
      persistPlayers(state.players);
      try { localStorage.setItem(EVENTS_KEY, JSON.stringify(state.completedEvents)); } catch { /* ignore */ }
    },
  },
});
