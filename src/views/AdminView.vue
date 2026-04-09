<template>
  <div class="admin">
    <div class="page-header">
      <h1>Score Entry</h1>
      <p class="page-subtitle">Changes save automatically &mdash; no rebuild needed</p>
    </div>

    <div class="admin-body">
      <!-- Status bar -->
      <div class="status-bar">
        <span class="status-indicator" :class="{ active: hasLocalOverrides }">
          {{ hasLocalOverrides ? 'Using saved scores' : 'Using default data.json scores' }}
        </span>
        <div class="admin-actions">
          <button class="btn-reset" @click="confirmReset">Reset to data.json</button>
          <button class="btn-export" @click="copyJson">{{ copyLabel }}</button>
        </div>
      </div>

      <!-- Event completion toggles -->
      <div class="event-toggles">
        <span class="event-toggles-label">Mark event complete:</span>
        <button
          v-for="event in events"
          :key="event.field"
          class="event-toggle-btn"
          :class="{ completed: completedEvents[event.field] }"
          @click="toggleEventCompleted(event.field)"
        >
          {{ event.label }}
        </button>
      </div>

      <!-- Score table -->
      <div class="score-table-wrap">
        <table class="score-table">
          <thead>
            <tr>
              <th class="col-player">Player</th>
              <th class="col-score">ParTee Shack</th>
              <th class="col-score">Scramble</th>
              <th class="col-score">Fantasy</th>
              <th class="col-total">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in sortedByTotal" :key="player.id" class="player-row">
              <td class="col-player">
                <span class="rank">{{ player._rank }}</span>
                {{ player.user.first_name }} {{ player.user.last_name }}
              </td>
              <td class="col-score">
                <input
                  type="number"
                  class="score-input"
                  min="0"
                  :value="player.parTeeShack"
                  @change="update(player.id, 'parTeeShack', $event.target.value)"
                />
              </td>
              <td class="col-score">
                <input
                  type="number"
                  class="score-input"
                  min="0"
                  :value="player.scramble"
                  @change="update(player.id, 'scramble', $event.target.value)"
                />
              </td>
              <td class="col-score">
                <input
                  type="number"
                  class="score-input"
                  :class="{ 'score-input--locked': !hasFantasyPicks(player) }"
                  min="0"
                  :value="player.fantasy"
                  :disabled="!hasFantasyPicks(player)"
                  @change="update(player.id, 'fantasy', $event.target.value)"
                />
              </td>
              <td class="col-total">
                {{ player.parTeeShack + player.scramble + player.fantasy }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Export hint -->
      <p class="export-hint">
        Use <strong>Copy JSON</strong> to get the updated <code>data.json</code> content — paste it into
        <code>src/assets/data.json</code> to make scores permanent across devices.
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'AdminView',
  data() {
    return {
      copyLabel: 'Copy JSON',
    };
  },
  computed: {
    ...mapGetters(['sortedByTotal', 'players', 'hasLocalOverrides', 'completedEvents']),
    events: () => [
      { field: 'parTeeShack', label: 'ParTee Shack' },
      { field: 'scramble', label: 'Scramble' },
      { field: 'fantasy', label: 'Fantasy' },
    ],
  },
  methods: {
    ...mapMutations(['updateScore', 'resetScores', 'toggleEventCompleted']),

    hasFantasyPicks(player) {
      return player.fantasy_picks && player.fantasy_picks.some((p) => p.trim() !== '');
    },

    update(id, field, value) {
      this.updateScore({ id, field, value });
    },

    confirmReset() {
      if (confirm('Reset all scores to the values in data.json? This cannot be undone.')) {
        this.resetScores();
      }
    },

    async copyJson() {
      // Build the full updated data array (preserving non-score fields)
      const json = JSON.stringify(this.players, null, 2);
      try {
        await navigator.clipboard.writeText(json);
        this.copyLabel = 'Copied!';
        setTimeout(() => { this.copyLabel = 'Copy JSON'; }, 2000);
      } catch {
        // Fallback for browsers without clipboard API
        const ta = document.createElement('textarea');
        ta.value = json;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        this.copyLabel = 'Copied!';
        setTimeout(() => { this.copyLabel = 'Copy JSON'; }, 2000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.admin {
  width: 100%;
}

.admin-body {
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

// ─── Status Bar ───────────────────────────────────────────────────────────────
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #fafafa;
  border: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.status-indicator {
  font-size: 0.8rem;
  font-weight: 600;
  color: #999;
  letter-spacing: 0.3px;

  &.active {
    color: $masters-accent;

    &::before {
      content: '● ';
      color: $masters-accent;
    }
  }
}

.admin-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-reset,
.btn-export {
  padding: 0.45rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
  font-family: $body-font-stack;
}

.btn-reset {
  background: #f0f0f0;
  color: #555;

  &:hover { background: #e0e0e0; }
}

.btn-export {
  background: $primary;
  color: white;

  &:hover { background: darken($primary, 6%); }
}

// ─── Event Toggles ────────────────────────────────────────────────────────────
.event-toggles {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.event-toggles-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-right: 0.25rem;
}

.event-toggle-btn {
  padding: 0.35rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: white;
  color: #777;
  cursor: pointer;
  font-family: $body-font-stack;
  transition: all 0.15s ease;

  &:hover {
    border-color: $masters-accent;
    color: $masters-accent;
  }

  &.completed {
    background: $masters-accent;
    border-color: $masters-accent;
    color: white;
  }
}

// ─── Score Table ──────────────────────────────────────────────────────────────
.score-table-wrap {
  overflow-x: auto;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
}

.score-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th {
    background: #f7f7f7;
    color: #666;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    padding: 0.65rem 1rem;
    border-bottom: 2px solid rgba($masters-accent, 0.2);
    text-align: left;
  }

  td {
    padding: 0.55rem 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: rgba($masters-accent, 0.02);
  }
}

.col-score {
  text-align: center;
  width: 120px;
}

.col-total {
  text-align: center;
  width: 80px;
  font-weight: 700;
  color: $primary;
  font-size: 1rem;
}

.rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: $primary;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  margin-right: 0.5rem;
  vertical-align: middle;
}

// ─── Score Input ──────────────────────────────────────────────────────────────
.score-input {
  width: 80px;
  padding: 0.4rem 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #fafafa;
  font-size: 0.9rem;
  font-weight: 600;
  color: $primary;
  text-align: center;
  font-family: $body-font-stack;
  transition: border-color 0.15s, background 0.15s;

  &:focus {
    outline: none;
    border-color: $masters-accent;
    background: white;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }

  &--locked {
    background: #f0f0f0;
    color: #aaa;
    border-color: rgba(0, 0, 0, 0.08);
    cursor: not-allowed;
  }
}

// ─── Export Hint ─────────────────────────────────────────────────────────────
.export-hint {
  margin-top: 1.5rem;
  font-size: 0.82rem;
  color: #999;
  line-height: 1.6;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  padding-top: 1rem;

  code {
    background: #f0f0f0;
    padding: 0.1rem 0.3rem;
    font-size: 0.8rem;
    color: $primary;
  }
}

@media (max-width: $bp-mobile) {
  .admin-body {
    padding: 1.5rem 1rem 2rem;
  }

  .status-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .score-input {
    width: 65px;
  }
}
</style>
