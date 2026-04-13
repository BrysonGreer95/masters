import { createStore } from 'vuex';
import defaultData from '../assets/data.json';
import {
  PUTT_PUTT_POINTS, SCRAMBLE_POINTS, FANTASY_POINTS,
  PUTT_PAR_ALL,
  bestOf18Score, holeTotal, calcRankings,
} from '../constants/scoring';

const EVENTS_KEY          = 'masters-completed-events';
const PUTT_HOLES_KEY      = 'masters-putt-holes';
const SCRAMBLE1_HOLES_KEY = 'masters-scramble1-holes';
const SCRAMBLE2_HOLES_KEY = 'masters-scramble2-holes';
const FANTASY_POINTS_KEY  = 'masters-fantasy-points';
const WATCH_PARTY_KEY     = 'masters-watch-party';
const ACTUAL_PUTTS_KEY    = 'masters-actual-putts';
const VERSION_KEY         = 'masters-data-version';

// ─── Version check ────────────────────────────────────────────────────────────
function checkVersion() {
  try {
    const storedVersion = Number(localStorage.getItem(VERSION_KEY));
    if (storedVersion !== defaultData._version) {
      localStorage.removeItem(EVENTS_KEY);
      localStorage.removeItem(PUTT_HOLES_KEY);
      localStorage.removeItem(SCRAMBLE1_HOLES_KEY);
      localStorage.removeItem(SCRAMBLE2_HOLES_KEY);
      localStorage.removeItem(FANTASY_POINTS_KEY);
      localStorage.removeItem(WATCH_PARTY_KEY);
      localStorage.removeItem(ACTUAL_PUTTS_KEY);
      localStorage.setItem(VERSION_KEY, String(defaultData._version));
    }
  } catch { /* ignore */ }
}

checkVersion();

// ─── Default builders ─────────────────────────────────────────────────────────

function defaultPuttHoles() {
  const holes = {};
  defaultData.players.forEach((player) => {
    holes[player.id] = defaultData.scorecard.putt_putt.scores[player.id] ?? Array(36).fill(null);
  });
  return holes;
}

function defaultScramble1Holes() {
  const holes = {};
  const teamNumbers = [...new Set(defaultData.players.map((p) => p.scramble1_team).filter(Boolean))];
  teamNumbers.forEach((teamNum) => {
    holes[teamNum] = defaultData.scorecard.scramble1?.scores?.[teamNum] ?? Array(18).fill(null);
  });
  return holes;
}

function defaultScramble2Holes() {
  const holes = {};
  const teamNumbers = [...new Set(defaultData.players.map((p) => p.scramble2_team).filter(Boolean))];
  teamNumbers.forEach((teamNum) => {
    holes[teamNum] = defaultData.scorecard.scramble2?.scores?.[teamNum] ?? Array(18).fill(null);
  });
  return holes;
}

// ─── Load helpers ─────────────────────────────────────────────────────────────

function loadCompletedEvents() {
  try {
    const saved = localStorage.getItem(EVENTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultData.completed_events ?? { parTeeShack: false, scramble1: false, scramble2: false, fantasy: false };
}

function loadPuttHoles() {
  try {
    const saved = localStorage.getItem(PUTT_HOLES_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultPuttHoles();
}

function loadScramble1Holes() {
  try {
    const saved = localStorage.getItem(SCRAMBLE1_HOLES_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultScramble1Holes();
}

function loadScramble2Holes() {
  try {
    const saved = localStorage.getItem(SCRAMBLE2_HOLES_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultScramble2Holes();
}

function loadFantasyPoints() {
  try {
    const saved = localStorage.getItem(FANTASY_POINTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultData.fantasy_points ?? {};
}

function loadWatchParty() {
  try {
    const saved = localStorage.getItem(WATCH_PARTY_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultData.watch_party ?? { bonus_points: 40, attendees: {} };
}

function loadActualPutts() {
  try {
    const saved = localStorage.getItem(ACTUAL_PUTTS_KEY);
    if (saved !== null) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultData.actual_putts ?? null;
}

// ─── Persist helpers ──────────────────────────────────────────────────────────

function persist(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export default createStore({
  state() {
    return {
      players:         JSON.parse(JSON.stringify(defaultData.players)),
      completedEvents: loadCompletedEvents(),
      puttPuttHoles:   loadPuttHoles(),
      scramble1Holes:  loadScramble1Holes(),
      scramble2Holes:  loadScramble2Holes(),
      fantasyPoints:   loadFantasyPoints(),
      watchParty:      loadWatchParty(),
      actualPutts:     loadActualPutts(),
    };
  },

  getters: {
    players:         (state) => state.players,
    completedEvents: (state) => state.completedEvents,
    puttPuttHoles:   (state) => state.puttPuttHoles,
    scramble1Holes:  (state) => state.scramble1Holes,
    scramble2Holes:  (state) => state.scramble2Holes,
    watchParty:      (state) => state.watchParty,
    actualPutts:     (state) => state.actualPutts,

    /** Overall standings — includes all five scoring categories. */
    sortedByTotal(state, getters) {
      return [...state.players]
        .map((player) => {
          const watchBonus = state.watchParty.attendees[player.id]
            ? (state.watchParty.bonus_points || 0)
            : 0;
          return {
            ...player,
            parTeeShack: getters.puttPuttRankings[player.id]?.points ?? 0,
            scramble1:   getters.scramble1Rankings[player.scramble1_team]?.points ?? 0,
            scramble2:   getters.scramble2Rankings[player.scramble2_team]?.points ?? 0,
            fantasy:     state.fantasyPoints[player.id] ?? 0,
            watchParty:  watchBonus,
          };
        })
        .sort((a, b) =>
          (b.parTeeShack + b.scramble1 + b.scramble2 + b.fantasy + b.watchParty) -
          (a.parTeeShack + a.scramble1 + a.scramble2 + a.fantasy + a.watchParty)
        )
        .map((player, index) => ({ ...player, _rank: index + 1 }));
    },

    /** Live rankings from ParTee Shack best-of-18 across both courses. */
    puttPuttRankings(state) {
      const totals = state.players.map((player) => ({
        id:    player.id,
        total: bestOf18Score(state.puttPuttHoles[player.id] ?? Array(36).fill(null), PUTT_PAR_ALL),
      }));
      return calcRankings(totals, PUTT_PUTT_POINTS);
    },

    /** Live rankings from Scramble 1 hole scores. { [teamNum]: { rank, points } } */
    scramble1Rankings(state) {
      const teamNumbers = [...new Set(state.players.map((p) => p.scramble1_team).filter(Boolean))];
      const totals = teamNumbers.map((teamNum) => ({
        id:    teamNum,
        total: holeTotal(state.scramble1Holes[teamNum] || []),
      }));
      return calcRankings(totals, SCRAMBLE_POINTS);
    },

    /** Live rankings from Scramble 2 hole scores. { [teamNum]: { rank, points } } */
    scramble2Rankings(state) {
      const teamNumbers = [...new Set(state.players.map((p) => p.scramble2_team).filter(Boolean))];
      const totals = teamNumbers.map((teamNum) => ({
        id:    teamNum,
        total: holeTotal(state.scramble2Holes[teamNum] || []),
      }));
      return calcRankings(totals, SCRAMBLE_POINTS);
    },
  },

  mutations: {
    toggleEventCompleted(state, event) {
      state.completedEvents[event] = !state.completedEvents[event];
      persist(EVENTS_KEY, state.completedEvents);
    },

    resetScores(state) {
      state.players        = JSON.parse(JSON.stringify(defaultData.players));
      state.completedEvents = { parTeeShack: false, scramble1: false, scramble2: false, fantasy: false };
      state.puttPuttHoles  = defaultPuttHoles();
      state.scramble1Holes = defaultScramble1Holes();
      state.scramble2Holes = defaultScramble2Holes();
      state.fantasyPoints  = {};
      state.watchParty     = defaultData.watch_party ?? { bonus_points: 40, attendees: {} };
      state.actualPutts    = defaultData.actual_putts ?? null;
      try {
        localStorage.removeItem(EVENTS_KEY);
        localStorage.removeItem(PUTT_HOLES_KEY);
        localStorage.removeItem(SCRAMBLE1_HOLES_KEY);
        localStorage.removeItem(SCRAMBLE2_HOLES_KEY);
        localStorage.removeItem(FANTASY_POINTS_KEY);
        localStorage.removeItem(WATCH_PARTY_KEY);
        localStorage.removeItem(ACTUAL_PUTTS_KEY);
      } catch { /* ignore */ }
    },

    updatePuttPuttHole(state, { playerId, holeIndex, value }) {
      const scores = [...(state.puttPuttHoles[playerId] ?? Array(36).fill(null))];
      scores[holeIndex] = (value === '' || value === null || value === undefined)
        ? null : Number(value);
      state.puttPuttHoles = { ...state.puttPuttHoles, [playerId]: scores };
      persist(PUTT_HOLES_KEY, state.puttPuttHoles);
    },

    updateScramble1Hole(state, { teamNum, holeIndex, value }) {
      const scores = [...(state.scramble1Holes[teamNum] ?? Array(18).fill(null))];
      scores[holeIndex] = (value === '' || value === null || value === undefined)
        ? null : Number(value);
      state.scramble1Holes = { ...state.scramble1Holes, [teamNum]: scores };
      persist(SCRAMBLE1_HOLES_KEY, state.scramble1Holes);
    },

    updateScramble2Hole(state, { teamNum, holeIndex, value }) {
      const scores = [...(state.scramble2Holes[teamNum] ?? Array(18).fill(null))];
      scores[holeIndex] = (value === '' || value === null || value === undefined)
        ? null : Number(value);
      state.scramble2Holes = { ...state.scramble2Holes, [teamNum]: scores };
      persist(SCRAMBLE2_HOLES_KEY, state.scramble2Holes);
    },

    /**
     * Compute and lock in fantasy points from manually-entered score totals.
     * Called from AdminView's Masters tab after entering each player's fantasy score.
     * @param {Array<{id: number, total: number|null}>} scoreTotals
     */
    applyFantasyPoints(state, scoreTotals) {
      const actualPutts = state.actualPutts;
      const tiebreakers = actualPutts != null
        ? Object.fromEntries(state.players.map((p) => [p.id, Math.abs((p.total_putts || 0) - actualPutts)]))
        : {};
      const rankings = calcRankings(scoreTotals, FANTASY_POINTS, tiebreakers);
      state.fantasyPoints = Object.fromEntries(
        state.players.map((p) => [p.id, rankings[p.id]?.points ?? 0])
      );
      state.completedEvents.fantasy = true;
      persist(FANTASY_POINTS_KEY, state.fantasyPoints);
      persist(EVENTS_KEY, state.completedEvents);
    },

    setActualPutts(state, value) {
      state.actualPutts = value === '' || value === null ? null : Number(value);
      persist(ACTUAL_PUTTS_KEY, state.actualPutts);
    },

    toggleWatchParty(state, playerId) {
      const attendees = { ...state.watchParty.attendees };
      attendees[playerId] = !attendees[playerId];
      state.watchParty = { ...state.watchParty, attendees };
      persist(WATCH_PARTY_KEY, state.watchParty);
    },

    setWatchPartyBonus(state, value) {
      state.watchParty = { ...state.watchParty, bonus_points: Number(value) || 0 };
      persist(WATCH_PARTY_KEY, state.watchParty);
    },
  },
});
