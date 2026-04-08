import { createStore } from 'vuex';
import defaultData from '../assets/data.json';

const STORAGE_KEY = 'masters-scores';

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
  },

  mutations: {
    updateScore(state, { id, field, value }) {
      const player = state.players.find((p) => p.id === id);
      if (player && ['parTeeShack', 'scramble', 'fantasy'].includes(field)) {
        player[field] = Math.max(0, parseInt(value) || 0);
        persist(state.players);
      }
    },

    resetScores(state) {
      state.players = JSON.parse(JSON.stringify(defaultData));
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    },
  },
});
