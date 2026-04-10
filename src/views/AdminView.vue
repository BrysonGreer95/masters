<template>
  <div class="admin">

    <!-- ─── Password gate ─────────────────────────────────────────── -->
    <div v-if="!authenticated" class="auth-gate">
      <form class="auth-card" @submit.prevent="tryLogin">
        <h2 class="auth-title">Score Entry</h2>
        <p class="auth-subtitle">Enter password to continue</p>
        <input
          v-model="passwordInput"
          type="password"
          class="auth-input"
          placeholder="Password"
          autocomplete="current-password"
          ref="pwInput"
        />
        <p v-if="authError" class="auth-error">Incorrect password</p>
        <button type="submit" class="auth-btn">Enter</button>
      </form>
    </div>

    <template v-else>
    <div class="page-header">
      <h1>Score Entry</h1>
      <p class="page-subtitle">Changes save automatically &mdash; no rebuild needed</p>
    </div>

    <div class="admin-body">
      <!-- Tab navigation -->
      <div class="admin-tabs">
        <button class="tab-btn" :class="{ active: tab === 'points' }" @click="tab = 'points'">Points</button>
        <button class="tab-btn" :class="{ active: tab === 'putt' }"   @click="tab = 'putt'">ParTee Shack</button>
        <button class="tab-btn" :class="{ active: tab === 'scramble' }" @click="tab = 'scramble'">Scramble</button>
      </div>

      <!-- ═══════════ POINTS TAB (existing) ═══════════ -->
      <div v-if="tab === 'points'">
        <div class="status-bar">
          <span class="status-indicator" :class="{ active: hasLocalOverrides }">
            {{ hasLocalOverrides ? 'Using saved scores' : 'Using default data.json scores' }}
          </span>
          <div class="admin-actions">
            <button class="btn-reset" @click="confirmReset">Reset All</button>
            <button class="btn-export" @click="copyJson">{{ copyLabel }}</button>
          </div>
        </div>

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
                  <input type="number" class="score-input" min="0"
                    :value="player.parTeeShack"
                    @change="update(player.id, 'parTeeShack', $event.target.value)"
                  />
                </td>
                <td class="col-score">
                  <input type="number" class="score-input" min="0"
                    :value="player.scramble"
                    @change="update(player.id, 'scramble', $event.target.value)"
                  />
                </td>
                <td class="col-score">
                  <input type="number" class="score-input" min="0"
                    :class="{ 'score-input--locked': !hasFantasyPicks(player) }"
                    :value="player.fantasy"
                    :disabled="!hasFantasyPicks(player)"
                    @change="update(player.id, 'fantasy', $event.target.value)"
                  />
                </td>
                <td class="col-total">{{ player.parTeeShack + player.scramble + player.fantasy }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="export-hint">
          Use <strong>Reset All</strong> to clear all scores and hole data.
          Use <strong>Copy JSON</strong> to export <code>data.json</code> with current scores for permanent storage.
        </p>
      </div>

      <!-- ═══════════ PUTT PUTT SCORECARD TAB ═══════════ -->
      <div v-if="tab === 'putt'">
        <div class="sc-controls">
          <p class="sc-hint">Enter strokes per hole. Rankings and points update live. Click <strong>Apply</strong> when finished to push points to the leaderboard.</p>
          <button class="btn-apply" @click="confirmApplyPutt">Apply Points to Leaderboard</button>
        </div>

        <div class="scorecard-entry-wrap">
          <table class="entry-table">
            <thead>
              <tr class="et-header">
                <th class="et-name-col">Player</th>
                <th v-for="h in 18" :key="`ph-${h}`" class="et-hole-col">{{ h }}</th>
                <th class="et-sub-col">OUT</th>
                <th v-for="h in 18" :key="`ph-${h + 18}`" class="et-hole-col">{{ h + 18 }}</th>
                <th class="et-sub-col">IN</th>
                <th class="et-tot-col">TOT</th>
                <th class="et-rank-col">Rank</th>
                <th class="et-pts-col">Pts</th>
              </tr>
              <tr class="et-par-row">
                <td class="et-name-col">Par</td>
                <td v-for="h in 36" :key="`pp-${h}`" class="et-hole-col">{{ PUTT_PAR }}</td>
                <td class="et-sub-col">{{ PUTT_PAR * 18 }}</td>
                <td class="et-sub-col"></td><!-- placeholder for IN label spacing -->
                <td class="et-tot-col">{{ PUTT_PAR * 36 }}</td>
                <td class="et-rank-col"></td>
                <td class="et-pts-col"></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="player in puttPuttEntryRows" :key="player.id">
                <td class="et-name-col et-name">{{ player.name }}</td>
                <!-- Front 18 -->
                <td v-for="h in 18" :key="`f-${player.id}-${h}`" class="et-hole-col">
                  <input
                    type="number"
                    class="hole-input"
                    min="1" max="20"
                    :value="player.scores[h - 1] ?? ''"
                    @change="setPuttHole(player.id, h - 1, $event.target.value)"
                  />
                </td>
                <td class="et-sub-col et-computed">{{ subtotal(player.scores, 0, 18) }}</td>
                <!-- Back 18 -->
                <td v-for="h in 18" :key="`b-${player.id}-${h}`" class="et-hole-col">
                  <input
                    type="number"
                    class="hole-input"
                    min="1" max="20"
                    :value="player.scores[h + 17] ?? ''"
                    @change="setPuttHole(player.id, h + 17, $event.target.value)"
                  />
                </td>
                <td class="et-sub-col et-computed">{{ subtotal(player.scores, 18, 36) }}</td>
                <td class="et-tot-col et-computed et-total">{{ subtotal(player.scores, 0, 36) }}</td>
                <td class="et-rank-col et-computed">
                  <span v-if="puttPuttRankings[player.id]?.rank">{{ puttPuttRankings[player.id].rank }}</span>
                  <span v-else class="et-na">—</span>
                </td>
                <td class="et-pts-col et-computed">
                  <span v-if="puttPuttRankings[player.id]?.points" class="et-pts-val">
                    {{ puttPuttRankings[player.id].points }}
                  </span>
                  <span v-else class="et-na">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ═══════════ SCRAMBLE SCORECARD TAB ═══════════ -->
      <div v-if="tab === 'scramble'">
        <div class="sc-controls">
          <p class="sc-hint">Enter team strokes per hole. Rankings and points update live. Click <strong>Apply</strong> when finished to push points to the leaderboard.</p>
          <button class="btn-apply" @click="confirmApplyScramble">Apply Points to Leaderboard</button>
        </div>

        <div class="scorecard-entry-wrap">
          <table class="entry-table">
            <thead>
              <tr class="et-header">
                <th class="et-team-col">Team</th>
                <th v-for="h in 9" :key="`sh-${h}`" class="et-hole-col">{{ h }}</th>
                <th class="et-sub-col">OUT</th>
                <th v-for="h in 9" :key="`sh-${h + 9}`" class="et-hole-col">{{ h + 9 }}</th>
                <th class="et-sub-col">IN</th>
                <th class="et-tot-col">TOT</th>
                <th class="et-rank-col">Rank</th>
                <th class="et-pts-col">Pts</th>
              </tr>
              <tr class="et-par-row">
                <td class="et-team-col">Par</td>
                <td v-for="(p, i) in SCRAMBLE_PAR" :key="`sp-${i}`" class="et-hole-col">{{ p }}</td>
                <td class="et-sub-col">{{ scrambleParOut }}</td>
                <td class="et-sub-col">{{ scrambleParIn }}</td>
                <td class="et-tot-col">{{ scrambleParOut + scrambleParIn }}</td>
                <td class="et-rank-col"></td>
                <td class="et-pts-col"></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="team in scrambleEntryRows" :key="team.num">
                <td class="et-team-col et-name">
                  <span class="team-label">{{ team.num }}</span>
                  <span class="team-members-small">{{ team.members }}</span>
                </td>
                <!-- Front 9 -->
                <td v-for="h in 9" :key="`sf-${team.num}-${h}`" class="et-hole-col">
                  <input
                    type="number"
                    class="hole-input"
                    min="1" max="15"
                    :value="team.scores[h - 1] ?? ''"
                    @change="setScrambleHole(team.num, h - 1, $event.target.value)"
                  />
                </td>
                <td class="et-sub-col et-computed">{{ subtotal(team.scores, 0, 9) }}</td>
                <!-- Back 9 -->
                <td v-for="h in 9" :key="`sb-${team.num}-${h}`" class="et-hole-col">
                  <input
                    type="number"
                    class="hole-input"
                    min="1" max="15"
                    :value="team.scores[h + 8] ?? ''"
                    @change="setScrambleHole(team.num, h + 8, $event.target.value)"
                  />
                </td>
                <td class="et-sub-col et-computed">{{ subtotal(team.scores, 9, 18) }}</td>
                <td class="et-tot-col et-computed et-total">{{ subtotal(team.scores, 0, 18) }}</td>
                <td class="et-rank-col et-computed">
                  <span v-if="scrambleRankings[team.num]?.rank">{{ scrambleRankings[team.num].rank }}</span>
                  <span v-else class="et-na">—</span>
                </td>
                <td class="et-pts-col et-computed">
                  <span v-if="scrambleRankings[team.num]?.points" class="et-pts-val">
                    {{ scrambleRankings[team.num].points }}
                  </span>
                  <span v-else class="et-na">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
    </template><!-- end v-else authenticated -->

  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import playerData from '../assets/data.json';
import scorecardData from '../assets/scorecard_data.json';
import config from '../assets/config.json';
import { holeTotal } from '../constants/scoring';

export default {
  name: 'AdminView',

  data() {
    return {
      authenticated: sessionStorage.getItem('admin-auth') === '1',
      passwordInput: '',
      authError: false,
      tab: 'points',
      copyLabel: 'Copy JSON',
      PUTT_PAR:    scorecardData.putt_putt.par,
      SCRAMBLE_PAR: scorecardData.scramble.par,
    };
  },

  mounted() {
    if (!this.authenticated) {
      this.$nextTick(() => this.$refs.pwInput?.focus());
    }
  },

  computed: {
    ...mapGetters([
      'sortedByTotal', 'players', 'hasLocalOverrides', 'completedEvents',
      'puttPuttHoles', 'scrambleHoles', 'puttPuttRankings', 'scrambleRankings',
    ]),

    events: () => [
      { field: 'parTeeShack', label: 'ParTee Shack' },
      { field: 'scramble',    label: 'Scramble'     },
      { field: 'fantasy',     label: 'Fantasy'      },
    ],

    puttPuttEntryRows() {
      return playerData.players.map((p) => ({
        id:     p.id,
        name:   `${p.user.first_name} ${p.user.last_name}`,
        scores: this.puttPuttHoles[p.id] ?? Array(36).fill(null),
      }));
    },

    scrambleEntryRows() {
      const teamMap = {};
      playerData.players.forEach((p) => {
        if (!p.team) return;
        if (!teamMap[p.team]) teamMap[p.team] = [];
        teamMap[p.team].push(`${p.user.first_name} ${p.user.last_name}`);
      });
      return Object.keys(teamMap)
        .map(Number)
        .sort((a, b) => a - b)
        .map((num) => ({
          num,
          members: teamMap[num].join(' / '),
          scores:  this.scrambleHoles[num] ?? Array(18).fill(null),
        }));
    },

    scrambleParOut() {
      return this.SCRAMBLE_PAR.slice(0, 9).reduce((s, v) => s + v, 0);
    },

    scrambleParIn() {
      return this.SCRAMBLE_PAR.slice(9).reduce((s, v) => s + v, 0);
    },
  },

  methods: {
    ...mapMutations([
      'updateScore', 'resetScores', 'toggleEventCompleted',
      'updatePuttPuttHole', 'updateScrambleHole',
      'applyPuttPuttPoints', 'applyScramblePoints',
    ]),

    tryLogin() {
      if (this.passwordInput === config.admin_password) {
        sessionStorage.setItem('admin-auth', '1');
        this.authenticated = true;
        this.authError = false;
      } else {
        this.authError = true;
        this.passwordInput = '';
        this.$nextTick(() => this.$refs.pwInput?.focus());
      }
    },

    hasFantasyPicks(player) {
      return player.fantasy_picks?.some((p) => p.trim() !== '');
    },

    update(id, field, value) {
      this.updateScore({ id, field, value });
    },

    setPuttHole(playerId, holeIndex, value) {
      this.updatePuttPuttHole({ playerId, holeIndex, value });
    },

    setScrambleHole(teamNum, holeIndex, value) {
      this.updateScrambleHole({ teamNum, holeIndex, value });
    },

    subtotal(scores, from, to) {
      const slice = scores.slice(from, to);
      if (slice.every((s) => s === null || s === undefined)) return '—';
      return slice.reduce((sum, s) => sum + (s ?? 0), 0);
    },

    confirmApplyPutt() {
      if (confirm('Apply calculated ParTee Shack points to the leaderboard? This will overwrite current ParTee Shack scores.')) {
        this.applyPuttPuttPoints();
        this.tab = 'points';
      }
    },

    confirmApplyScramble() {
      if (confirm('Apply calculated Scramble points to the leaderboard? This will overwrite current Scramble scores for all players.')) {
        this.applyScramblePoints();
        this.tab = 'points';
      }
    },

    confirmReset() {
      if (confirm('Reset ALL scores and hole data to defaults? This cannot be undone.')) {
        this.resetScores();
      }
    },

    async copyJson() {
      const json = JSON.stringify(this.players, null, 2);
      try {
        await navigator.clipboard.writeText(json);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = json;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      this.copyLabel = 'Copied!';
      setTimeout(() => { this.copyLabel = 'Copy JSON'; }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.admin { width: 100%; }

.admin-body {
  max-width: 100%;
  padding: 2rem 1.5rem 3rem;

  @media (max-width: $bp-mobile) {
    padding: 1.5rem 1rem 2rem;
  }
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
.admin-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid rgba($masters-accent, 0.2);
}

.tab-btn {
  padding: 0.55rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #aaa;
  cursor: pointer;
  font-family: $body-font-stack;
  transition: color 0.15s, border-color 0.15s;

  &:hover { color: $primary; }

  &.active {
    color: $primary;
    border-bottom-color: $masters-accent;
  }
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

  &.active { color: $masters-accent; }
  &.active::before { content: '● '; color: $masters-accent; }
}

.admin-actions { display: flex; gap: 0.75rem; }

.btn-reset, .btn-export, .btn-apply {
  padding: 0.45rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  font-family: $body-font-stack;
  transition: background 0.15s;
}

.btn-reset  { background: #f0f0f0; color: #555; &:hover { background: #e0e0e0; } }
.btn-export { background: $primary; color: white; &:hover { background: darken($primary, 6%); } }
.btn-apply  { background: $masters-accent; color: white; padding: 0.5rem 1.25rem; &:hover { background: darken($masters-accent, 8%); } }

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
  transition: all 0.15s;

  &:hover { border-color: $masters-accent; color: $masters-accent; }
  &.completed { background: $masters-accent; border-color: $masters-accent; color: white; }
}

// ─── Points Score Table ───────────────────────────────────────────────────────
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

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba($masters-accent, 0.02); }
}

.col-score { text-align: center; width: 120px; }
.col-total { text-align: center; width: 80px; font-weight: 700; color: $primary; font-size: 1rem; }

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
  transition: border-color 0.15s;

  &:focus { outline: none; border-color: $masters-accent; background: white; }
  &::-webkit-inner-spin-button, &::-webkit-outer-spin-button { opacity: 1; }
  &--locked { background: #f0f0f0; color: #aaa; border-color: rgba(0,0,0,0.08); cursor: not-allowed; }
}

.export-hint {
  margin-top: 1.5rem;
  font-size: 0.82rem;
  color: #999;
  line-height: 1.6;
  border-top: 1px solid rgba(0,0,0,0.07);
  padding-top: 1rem;

  code { background: #f0f0f0; padding: 0.1rem 0.3rem; font-size: 0.8rem; color: $primary; }
}

// ─── Scorecard Entry (shared by putt putt and scramble tabs) ─────────────────
.sc-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.sc-hint {
  font-size: 0.85rem;
  color: #888;
  margin: 0;
  flex: 1;
}

.scorecard-entry-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
}

.entry-table {
  border-collapse: collapse;
  width: max-content;
  font-size: 0.8rem;

  th, td {
    border: 1px solid rgba(0, 0, 0, 0.09);
    padding: 0;
    text-align: center;
    white-space: nowrap;
  }
}

// ─── Entry table header ───────────────────────────────────────────────────────
.et-header th {
  background: $primary;
  color: white;
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.3px;
  padding: 0.4rem 0.3rem;
}

.et-par-row td {
  background: rgba($masters-accent, 0.07);
  color: #666;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.3rem;
}

// ─── Entry table column widths ────────────────────────────────────────────────
.et-name-col, .et-team-col {
  text-align: left !important;
  min-width: 130px;
  position: sticky;
  left: 0;
  z-index: 2;
  background: white;
  padding: 0.4rem 0.6rem !important;

  &.et-header { background: $primary !important; }
}

.et-par-row .et-name-col,
.et-par-row .et-team-col {
  background: rgba($masters-accent, 0.07) !important;
}

.et-hole-col { width: 36px; min-width: 36px; }

.et-sub-col {
  min-width: 38px;
  background: rgba(0,0,0,0.02);
  border-left: 2px solid rgba($masters-accent, 0.25) !important;
}

.et-tot-col {
  min-width: 40px;
  border-left: 2px solid $masters-accent !important;
}

.et-rank-col { min-width: 36px; border-left: 2px solid rgba($masters-gold, 0.4) !important; }
.et-pts-col  { min-width: 44px; }

// ─── Entry table cells ────────────────────────────────────────────────────────
.et-name {
  font-weight: 600;
  color: $primary;
  font-size: 0.82rem;
}

.et-computed {
  padding: 0.35rem !important;
  font-size: 0.78rem;
  color: #555;
  font-weight: 600;
}

.et-total { font-weight: 700; color: $primary; }

.et-pts-val {
  font-weight: 700;
  color: $masters-accent;
}

.et-na { color: #ccc; }

.team-label {
  font-weight: 700;
  color: $primary;
  margin-right: 0.4rem;
}

.team-members-small {
  font-size: 0.72rem;
  color: #777;
  font-weight: 400;
}

// ─── Hole inputs ──────────────────────────────────────────────────────────────
.hole-input {
  width: 34px;
  height: 32px;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 0.82rem;
  font-weight: 600;
  color: #333;
  font-family: $body-font-stack;
  padding: 0;
  display: block;
  margin: 0 auto;

  &:focus {
    outline: none;
    background: rgba($masters-accent, 0.08);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button { display: none; }

  // Hide spinners on Firefox
  -moz-appearance: textfield;
}

// ─── Auth Gate ────────────────────────────────────────────────────────────────
.auth-gate {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.auth-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-top: 3px solid $masters-accent;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.auth-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: $primary;
  font-family: $heading-font-stack;
  margin: 0 0 0.1rem;
}

.auth-subtitle {
  font-size: 0.82rem;
  color: #999;
  margin: 0 0 0.5rem;
}

.auth-input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 0.9rem;
  font-family: $body-font-stack;
  color: #333;
  box-sizing: border-box;
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: $masters-accent;
    box-shadow: 0 0 0 2px rgba($masters-accent, 0.12);
  }
}

.auth-error {
  font-size: 0.78rem;
  color: #b91c1c;
  margin: 0;
  font-weight: 600;
}

.auth-btn {
  background: $primary;
  color: white;
  border: none;
  padding: 0.6rem 1.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: $body-font-stack;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 0.25rem;
  transition: background 0.15s;

  &:hover { background: $masters-accent; }
}
</style>
