import { createStore } from 'vuex';
import defaultData from '../assets/data.json';

const STORAGE_KEY = 'masters-scores';
const EVENTS_KEY = 'masters-completed-events';

function loadCompletedEvents() {
  try {
    const saved = localStorage.getItem(EVENTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return { parTeeShack: false, scramble: false, fantasy: false };
}

function loadPlayers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore malformed storage
  }
  // Deep clone so mutations don't affect the imported default
  return JSON.parse(JSON.stringify(defaultData));
}

function persist(players) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  } catch {
    // ignore storage quota errors
  }
}

export default createStore({
  state() {
    return {
      players: loadPlayers(),
      completedEvents: loadCompletedEvents(),
    };
  },

  getters: {
    players: (state) => state.players,

    sortedByTotal: (state) =>
      [...state.players]
        .sort((a, b) => {
          const totalA = a.parTeeShack + a.scramble + a.fantasy;
          const totalB = b.parTeeShack + b.scramble + b.fantasy;
          return totalB - totalA;
        })
        .map((p, idx) => ({ ...p, _rank: idx + 1 })),

    hasLocalOverrides: () => !!localStorage.getItem(STORAGE_KEY),
    completedEvents: (state) => state.completedEvents,
  },

  mutations: {
    updateScore(state, { id, field, value }) {
      const player = state.players.find((p) => p.id === id);
      if (player && ['parTeeShack', 'scramble', 'fantasy'].includes(field)) {
        player[field] = Math.max(0, parseInt(value) || 0);
        persist(state.players);
      }
    },

    toggleEventCompleted(state, event) {
      state.completedEvents[event] = !state.completedEvents[event];
      try {
        localStorage.setItem(EVENTS_KEY, JSON.stringify(state.completedEvents));
      } catch {
        // ignore
      }
    },

    resetScores(state) {
      state.players = JSON.parse(JSON.stringify(defaultData));
      state.completedEvents = { parTeeShack: false, scramble: false, fantasy: false };
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(EVENTS_KEY);
      } catch {
        // ignore
      }
    },
  },
});
