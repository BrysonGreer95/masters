<template>
  <div class="admin">

    <!-- ─── Password gate ─────────────────────────────────────────── -->
    <div v-if="!authenticated" class="auth-gate">
      <form class="auth-card" @submit.prevent="tryLogin">
        <h2 class="auth-title">Score Entry</h2>
        <p class="auth-subtitle">Enter password to continue</p>
        <input v-model="passwordInput" type="password" class="auth-input" placeholder="Password"
          autocomplete="current-password" ref="pwInput" />
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
          <button class="tab-btn" :class="{ active: tab === 'putt' }" @click="tab = 'putt'">ParTee Shack</button>
          <button class="tab-btn" :class="{ active: tab === 'scramble' }" @click="tab = 'scramble'">Scramble</button>
        </div>

        <!-- ═══════════ PUTT PUTT SCORECARD TAB ═══════════ -->
        <div v-if="tab === 'putt'">
          <div class="sc-controls">
            <div class="sc-controls-left">
              <p class="sc-hint">Rankings and points update live from hole scores.</p>
              <div class="event-toggles">
                <span class="event-toggles-label">Mark complete:</span>
                <button class="event-toggle-btn" :class="{ completed: completedEvents.parTeeShack }"
                  @click="toggleEventCompleted('parTeeShack')">
                  ParTee Shack
                </button>
              </div>
            </div>
            <div class="sc-control-btns">
              <button class="btn-reset" @click="confirmReset">Reset All</button>
              <button class="btn-export" @click="copyDataJson">{{ exportLabel }}</button>
            </div>
          </div>

          <div class="scorecard-entry-wrap">
            <table class="entry-table">
              <thead>
                <tr class="et-header">
                  <th class="et-name-col">Player</th>
                  <th v-for="h in 18" :key="`ph-${h}`" class="et-hole-col">{{ h }}</th>
                  <th class="et-tot-col">+/-</th>
                  <th class="et-rank-col">Rank</th>
                  <th class="et-pts-col">Pts</th>
                </tr>
                <tr class="et-par-row et-par-yellow">
                  <td class="et-name-col"><span class="course-badge course-badge--yellow">Y</span> Par (40)</td>
                  <td v-for="(p, i) in PUTT_PAR_YELLOW" :key="`py-${i}`" class="et-hole-col">{{ p }}</td>
                  <td class="et-tot-col">40</td>
                  <td class="et-rank-col"></td>
                  <td class="et-pts-col"></td>
                </tr>
                <tr class="et-par-row et-par-blue">
                  <td class="et-name-col"><span class="course-badge course-badge--blue">B</span> Par (42)</td>
                  <td v-for="(p, i) in PUTT_PAR_BLUE" :key="`pb-${i}`" class="et-hole-col">{{ p }}</td>
                  <td class="et-tot-col">42</td>
                  <td class="et-rank-col"></td>
                  <td class="et-pts-col"></td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="player in puttPuttEntryRows" :key="player.id">
                  <td class="et-name-col et-name">
                    {{ player.name }}
                    <div class="course-toggle">
                      <button
                        :class="['course-btn', 'course-btn--yellow', player.course !== 'blue' ? 'course-btn--active' : '']"
                        @click="setCourse(player.id, 'yellow')">Y</button>
                      <button
                        :class="['course-btn', 'course-btn--blue', player.course === 'blue' ? 'course-btn--active' : '']"
                        @click="setCourse(player.id, 'blue')">B</button>
                    </div>
                  </td>
                  <td v-for="h in 18" :key="`f-${player.id}-${h}`" class="et-hole-col">
                    <input type="number" class="hole-input" min="1" max="20" :value="player.scores[h - 1] ?? ''"
                      @change="setPuttHole(player.id, h - 1, $event.target.value)" />
                  </td>
                  <td class="et-tot-col et-computed et-total">{{ relativeToParDisplay(player.scores, player.par) }}</td>
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
            <div class="sc-controls-left">
              <p class="sc-hint">Rankings and points update live from hole scores.</p>
              <div class="event-toggles">
                <span class="event-toggles-label">Mark complete:</span>
                <button class="event-toggle-btn" :class="{ completed: completedEvents.scramble }"
                  @click="toggleEventCompleted('scramble')">
                  Scramble
                </button>
              </div>
            </div>
            <div class="sc-control-btns">
              <button class="btn-reset" @click="confirmReset">Reset All</button>
              <button class="btn-export" @click="copyDataJson">{{ exportLabel }}</button>
            </div>
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
                    <input type="number" class="hole-input" min="1" max="15" :value="team.scores[h - 1] ?? ''"
                      @change="setScrambleHole(team.num, h - 1, $event.target.value)" />
                  </td>
                  <td class="et-sub-col et-computed">{{ subtotal(team.scores, 0, 9) }}</td>
                  <!-- Back 9 -->
                  <td v-for="h in 9" :key="`sb-${team.num}-${h}`" class="et-hole-col">
                    <input type="number" class="hole-input" min="1" max="15" :value="team.scores[h + 8] ?? ''"
                      @change="setScrambleHole(team.num, h + 8, $event.target.value)" />
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
import config from '../assets/config.json';
import { PUTT_PAR_YELLOW, PUTT_PAR_BLUE, SCRAMBLE_PAR } from '../constants/scoring';

export default {
  name: 'AdminView',

  data() {
    return {
      authenticated: sessionStorage.getItem('admin-auth') === '1',
      passwordInput: '',
      authError: false,
      tab: 'putt',
      exportLabel: 'Copy data.json',
      PUTT_PAR_YELLOW,
      PUTT_PAR_BLUE,
      SCRAMBLE_PAR,
    };
  },

  mounted() {
    if (!this.authenticated) {
      this.$nextTick(() => this.$refs.pwInput?.focus());
    }
  },

  computed: {
    ...mapGetters([
      'players', 'completedEvents',
      'puttPuttHoles', 'puttCourse', 'scrambleHoles', 'puttPuttRankings', 'scrambleRankings',
    ]),

    puttPuttEntryRows() {
      return playerData.players.map((p) => {
        const course = this.puttCourse[p.id] || 'yellow';
        return {
          id: p.id,
          name: `${p.user.first_name} ${p.user.last_name}`,
          scores: this.puttPuttHoles[p.id] ?? Array(18).fill(null),
          course,
          par: course === 'blue' ? PUTT_PAR_BLUE : PUTT_PAR_YELLOW,
        };
      });
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
          scores: this.scrambleHoles[num] ?? Array(18).fill(null),
        }));
    },

    scrambleParOut() {
      return SCRAMBLE_PAR.slice(0, 9).reduce((s, v) => s + v, 0);
    },

    scrambleParIn() {
      return SCRAMBLE_PAR.slice(9).reduce((s, v) => s + v, 0);
    },
  },

  methods: {
    ...mapMutations([
      'resetScores', 'toggleEventCompleted',
      'updatePuttPuttHole', 'setPuttCourse', 'updateScrambleHole',
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

    setPuttHole(playerId, holeIndex, value) {
      this.updatePuttPuttHole({ playerId, holeIndex, value });
    },

    setCourse(playerId, course) {
      this.setPuttCourse({ playerId, course });
    },

    relativeToParDisplay(scores, parArr) {
      if (!scores.some((s) => s !== null)) return '—';
      let strokes = 0, parSoFar = 0;
      scores.forEach((s, i) => {
        if (s !== null) { strokes += s; parSoFar += parArr[i]; }
      });
      const rel = strokes - parSoFar;
      return rel === 0 ? 'E' : rel > 0 ? `+${rel}` : `${rel}`;
    },

    setScrambleHole(teamNum, holeIndex, value) {
      this.updateScrambleHole({ teamNum, holeIndex, value });
    },

    subtotal(scores, from, to) {
      const slice = scores.slice(from, to);
      if (slice.every((s) => s === null || s === undefined)) return '—';
      return slice.reduce((sum, s) => sum + (s ?? 0), 0);
    },

    confirmReset() {
      if (confirm('Reset ALL scores and hole data to defaults? This cannot be undone.')) {
        this.resetScores();
      }
    },

    async copyDataJson() {
      const puttScores = Object.fromEntries(
        playerData.players.map((p) => [String(p.id), this.puttPuttHoles[p.id] ?? Array(18).fill(null)])
      );
      const puttCourses = Object.fromEntries(
        playerData.players.map((p) => [String(p.id), this.puttCourse[p.id] || 'yellow'])
      );
      const scrambleTeams = [...new Set(playerData.players.map((p) => p.team).filter(Boolean))].sort((a, b) => a - b);
      const scrambleScores = Object.fromEntries(
        scrambleTeams.map((num) => [String(num), this.scrambleHoles[num] ?? Array(18).fill(null)])
      );

      const output = {
        _version: playerData._version,
        actual_putts: playerData.actual_putts,
        players: playerData.players,
        scorecard: {
          putt_putt: { courses: puttCourses, scores: puttScores },
          scramble:  { scores: scrambleScores },
        },
      };

      const json = JSON.stringify(output, null, 2);
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
      this.exportLabel = 'Copied!';
      setTimeout(() => { this.exportLabel = 'Copy data.json'; }, 2000);
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

  &:hover {
    color: $primary;
  }

  &.active {
    color: $primary;
    border-bottom-color: $masters-accent;
  }
}

// ─── Scorecard Controls ───────────────────────────────────────────────────────
.sc-controls {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.sc-controls-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.sc-hint {
  font-size: 0.85rem;
  color: #888;
  margin: 0;
}

.sc-control-btns {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  align-items: flex-start;
}

// ─── Event Toggles ────────────────────────────────────────────────────────────
.event-toggles {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
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

// ─── Buttons ──────────────────────────────────────────────────────────────────
.btn-reset,
.btn-export {
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

.btn-reset {
  background: #f0f0f0;
  color: #555;

  &:hover {
    background: #e0e0e0;
  }
}

.btn-export {
  background: $primary;
  color: white;

  &:hover {
    background: darken($primary, 6%);
  }
}

// ─── Scorecard Entry (shared by putt putt and scramble tabs) ─────────────────
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

  th,
  td {
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

.et-par-yellow td {
  background: rgba(#f5c518, 0.12) !important;
}

.et-par-blue td {
  background: rgba(#1565c0, 0.08) !important;
}

.et-par-yellow .et-name-col,
.et-par-blue .et-name-col {
  background: inherit !important;
}

// ─── Entry table column widths ────────────────────────────────────────────────
.et-name-col,
.et-team-col {
  text-align: left !important;
  min-width: 130px;
  position: sticky;
  left: 0;
  z-index: 2;
  background: white;
  padding: 0.4rem 0.6rem !important;

  &.et-header {
    background: $primary !important;
  }
}

.et-par-row .et-name-col,
.et-par-row .et-team-col {
  background: rgba($masters-accent, 0.07) !important;
}

.et-hole-col {
  width: 36px;
  min-width: 36px;
}

.et-sub-col {
  min-width: 38px;
  background: rgba(0, 0, 0, 0.02);
  border-left: 2px solid rgba($masters-accent, 0.25) !important;
}

.et-tot-col {
  min-width: 40px;
  border-left: 2px solid $masters-accent !important;
}

.et-rank-col {
  min-width: 36px;
  border-left: 2px solid rgba($masters-gold, 0.4) !important;
}

.et-pts-col {
  min-width: 44px;
}

// ─── Entry table cells ────────────────────────────────────────────────────────
.et-name {
  font-weight: 600;
  color: $primary;
  font-size: 0.82rem;
}

// ─── Course selector ──────────────────────────────────────────────────────────
.course-toggle {
  display: flex;
  gap: 3px;
  margin-top: 3px;
}

.course-btn {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 5px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  color: #888;
  cursor: pointer;
  border-radius: 2px;
  line-height: 1.4;

  &--yellow.course-btn--active {
    background: #f5c518;
    border-color: #c9a000;
    color: #5a3d00;
  }

  &--blue.course-btn--active {
    background: #1565c0;
    border-color: #0d47a1;
    color: white;
  }
}

// ─── Course badges (par rows & Results scorecard) ─────────────────────────────
.course-badge {
  display: inline-block;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 1px 4px;
  border-radius: 2px;
  vertical-align: middle;
  line-height: 1.4;
  margin-right: 3px;

  &--yellow {
    background: #f5c518;
    color: #5a3d00;
  }

  &--blue {
    background: #1565c0;
    color: white;
  }
}

.et-computed {
  padding: 0.35rem !important;
  font-size: 0.78rem;
  color: #555;
  font-weight: 600;
}

.et-total {
  font-weight: 700;
  color: $primary;
}

.et-pts-val {
  font-weight: 700;
  color: $masters-accent;
}

.et-na {
  color: #ccc;
}

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
  &::-webkit-outer-spin-button {
    display: none;
  }

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

  &:hover {
    background: $masters-accent;
  }
}
</style>
