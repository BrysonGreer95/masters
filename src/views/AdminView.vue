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
          <button class="tab-btn" :class="{ active: tab === 'putt' }"      @click="tab = 'putt'">ParTee Shack</button>
          <button class="tab-btn" :class="{ active: tab === 'scramble1' }" @click="tab = 'scramble1'">Scramble 1</button>
          <button class="tab-btn" :class="{ active: tab === 'scramble2' }" @click="tab = 'scramble2'">Scramble 2</button>
          <button class="tab-btn" :class="{ active: tab === 'masters' }"   @click="tab = 'masters'">Masters</button>
        </div>

        <!-- ═══════════ PARTEE SHACK TAB (36 holes, best-of-18) ═══════════ -->
        <div v-if="tab === 'putt'">
          <div class="sc-controls">
            <div class="sc-controls-left">
              <p class="sc-hint">
                Enter all 36 holes per player (Yellow 1–18, Blue 1–18).
                Score is the best 18 individual holes relative to par.
              </p>
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
                  <th colspan="18" class="et-course-header et-course-yellow">Yellow (1–18)</th>
                  <th colspan="18" class="et-course-header et-course-blue">Blue (1–18)</th>
                  <th class="et-tot-col">Best 18</th>
                  <th class="et-rank-col">Rank</th>
                  <th class="et-pts-col">Pts</th>
                </tr>
                <tr class="et-par-row et-par-yellow">
                  <td class="et-name-col"><span class="course-badge course-badge--yellow">Y</span> Par (40)</td>
                  <td v-for="(p, i) in PUTT_PAR_YELLOW" :key="`py-${i}`" class="et-hole-col">{{ p }}</td>
                  <td v-for="(p, i) in PUTT_PAR_BLUE"   :key="`pb-${i}`" class="et-hole-col et-blue-col">{{ p }}</td>
                  <td class="et-tot-col"></td>
                  <td class="et-rank-col"></td>
                  <td class="et-pts-col"></td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="player in puttPuttEntryRows" :key="player.id">
                  <td class="et-name-col et-name">{{ player.name }}</td>
                  <!-- Yellow holes 1–18 (indices 0–17) -->
                  <td v-for="h in 18" :key="`y-${player.id}-${h}`" class="et-hole-col">
                    <input type="number" class="hole-input" min="1" max="20"
                      :value="player.scores[h - 1] ?? ''"
                      @change="setPuttHole(player.id, h - 1, $event.target.value)" />
                  </td>
                  <!-- Blue holes 1–18 (indices 18–35) -->
                  <td v-for="h in 18" :key="`b-${player.id}-${h}`" class="et-hole-col et-blue-col">
                    <input type="number" class="hole-input" min="1" max="20"
                      :value="player.scores[h + 17] ?? ''"
                      @change="setPuttHole(player.id, h + 17, $event.target.value)" />
                  </td>
                  <td class="et-tot-col et-computed et-total">{{ puttDisplayScore(player.scores) }}</td>
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

        <!-- ═══════════ SCRAMBLE 1 TAB ═══════════ -->
        <div v-if="tab === 'scramble1'">
          <div class="sc-controls">
            <div class="sc-controls-left">
              <p class="sc-hint">Rankings and points update live from hole scores.</p>
              <div class="event-toggles">
                <span class="event-toggles-label">Mark complete:</span>
                <button class="event-toggle-btn" :class="{ completed: completedEvents.scramble1 }"
                  @click="toggleEventCompleted('scramble1')">
                  Scramble 1
                </button>
              </div>
            </div>
            <div class="sc-control-btns">
              <button class="btn-reset" @click="confirmReset">Reset All</button>
              <button class="btn-export" @click="copyDataJson">{{ exportLabel }}</button>
            </div>
          </div>

          <p v-if="scramble1EntryRows.length === 0" class="no-teams-msg">
            No teams assigned yet. Set <code>scramble1_team</code> for each player in data.json, then bump <code>_version</code>.
          </p>
          <div v-else class="scorecard-entry-wrap">
            <table class="entry-table">
              <thead>
                <tr class="et-header">
                  <th class="et-team-col">Team</th>
                  <th v-for="h in 9"  :key="`s1h-${h}`"     class="et-hole-col">{{ h }}</th>
                  <th class="et-sub-col">OUT</th>
                  <th v-for="h in 9"  :key="`s1h-${h + 9}`" class="et-hole-col">{{ h + 9 }}</th>
                  <th class="et-sub-col">IN</th>
                  <th class="et-tot-col">TOT</th>
                  <th class="et-rank-col">Rank</th>
                  <th class="et-pts-col">Pts</th>
                </tr>
                <tr class="et-par-row">
                  <td class="et-team-col">Par</td>
                  <td v-for="(p, i) in SCRAMBLE_PAR" :key="`s1p-${i}`" class="et-hole-col">{{ p }}</td>
                  <td class="et-sub-col">{{ scramble1ParOut }}</td>
                  <td class="et-sub-col">{{ scramble1ParIn }}</td>
                  <td class="et-tot-col">{{ scramble1ParOut + scramble1ParIn }}</td>
                  <td class="et-rank-col"></td>
                  <td class="et-pts-col"></td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="team in scramble1EntryRows" :key="team.num">
                  <td class="et-team-col et-name">
                    <span class="team-label">{{ team.num }}</span>
                    <span class="team-members-small">{{ team.members }}</span>
                  </td>
                  <td v-for="h in 9" :key="`s1f-${team.num}-${h}`" class="et-hole-col">
                    <input type="number" class="hole-input" min="1" max="15"
                      :value="team.scores[h - 1] ?? ''"
                      @change="setScramble1Hole(team.num, h - 1, $event.target.value)" />
                  </td>
                  <td class="et-sub-col et-computed">{{ subtotal(team.scores, 0, 9) }}</td>
                  <td v-for="h in 9" :key="`s1b-${team.num}-${h}`" class="et-hole-col">
                    <input type="number" class="hole-input" min="1" max="15"
                      :value="team.scores[h + 8] ?? ''"
                      @change="setScramble1Hole(team.num, h + 8, $event.target.value)" />
                  </td>
                  <td class="et-sub-col et-computed">{{ subtotal(team.scores, 9, 18) }}</td>
                  <td class="et-tot-col et-computed et-total">{{ subtotal(team.scores, 0, 18) }}</td>
                  <td class="et-rank-col et-computed">
                    <span v-if="scramble1Rankings[team.num]?.rank">{{ scramble1Rankings[team.num].rank }}</span>
                    <span v-else class="et-na">—</span>
                  </td>
                  <td class="et-pts-col et-computed">
                    <span v-if="scramble1Rankings[team.num]?.points" class="et-pts-val">
                      {{ scramble1Rankings[team.num].points }}
                    </span>
                    <span v-else class="et-na">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ═══════════ SCRAMBLE 2 TAB ═══════════ -->
        <div v-if="tab === 'scramble2'">
          <div class="sc-controls">
            <div class="sc-controls-left">
              <p class="sc-hint">Rankings and points update live from hole scores.</p>
              <div class="event-toggles">
                <span class="event-toggles-label">Mark complete:</span>
                <button class="event-toggle-btn" :class="{ completed: completedEvents.scramble2 }"
                  @click="toggleEventCompleted('scramble2')">
                  Scramble 2
                </button>
              </div>
            </div>
            <div class="sc-control-btns">
              <button class="btn-reset" @click="confirmReset">Reset All</button>
              <button class="btn-export" @click="copyDataJson">{{ exportLabel }}</button>
            </div>
          </div>

          <p v-if="scramble2EntryRows.length === 0" class="no-teams-msg">
            No teams assigned yet. Set <code>scramble2_team</code> for each player in data.json, then bump <code>_version</code>.
          </p>
          <div v-else class="scorecard-entry-wrap">
            <table class="entry-table">
              <thead>
                <tr class="et-header">
                  <th class="et-team-col">Team</th>
                  <th v-for="h in 9"  :key="`s2h-${h}`"     class="et-hole-col">{{ h }}</th>
                  <th class="et-sub-col">OUT</th>
                  <th v-for="h in 9"  :key="`s2h-${h + 9}`" class="et-hole-col">{{ h + 9 }}</th>
                  <th class="et-sub-col">IN</th>
                  <th class="et-tot-col">TOT</th>
                  <th class="et-rank-col">Rank</th>
                  <th class="et-pts-col">Pts</th>
                </tr>
                <tr class="et-par-row">
                  <td class="et-team-col">Par</td>
                  <td v-for="(p, i) in SCRAMBLE2_PAR" :key="`s2p-${i}`" class="et-hole-col">{{ p }}</td>
                  <td class="et-sub-col">{{ scramble2ParOut }}</td>
                  <td class="et-sub-col">{{ scramble2ParIn }}</td>
                  <td class="et-tot-col">{{ scramble2ParOut + scramble2ParIn }}</td>
                  <td class="et-rank-col"></td>
                  <td class="et-pts-col"></td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="team in scramble2EntryRows" :key="team.num">
                  <td class="et-team-col et-name">
                    <span class="team-label">{{ team.num }}</span>
                    <span class="team-members-small">{{ team.members }}</span>
                  </td>
                  <td v-for="h in 9" :key="`s2f-${team.num}-${h}`" class="et-hole-col">
                    <input type="number" class="hole-input" min="1" max="15"
                      :value="team.scores[h - 1] ?? ''"
                      @change="setScramble2Hole(team.num, h - 1, $event.target.value)" />
                  </td>
                  <td class="et-sub-col et-computed">{{ subtotal(team.scores, 0, 9) }}</td>
                  <td v-for="h in 9" :key="`s2b-${team.num}-${h}`" class="et-hole-col">
                    <input type="number" class="hole-input" min="1" max="15"
                      :value="team.scores[h + 8] ?? ''"
                      @change="setScramble2Hole(team.num, h + 8, $event.target.value)" />
                  </td>
                  <td class="et-sub-col et-computed">{{ subtotal(team.scores, 9, 18) }}</td>
                  <td class="et-tot-col et-computed et-total">{{ subtotal(team.scores, 0, 18) }}</td>
                  <td class="et-rank-col et-computed">
                    <span v-if="scramble2Rankings[team.num]?.rank">{{ scramble2Rankings[team.num].rank }}</span>
                    <span v-else class="et-na">—</span>
                  </td>
                  <td class="et-pts-col et-computed">
                    <span v-if="scramble2Rankings[team.num]?.points" class="et-pts-val">
                      {{ scramble2Rankings[team.num].points }}
                    </span>
                    <span v-else class="et-na">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ═══════════ MASTERS TAB (fantasy + watch party) ═══════════ -->
        <div v-if="tab === 'masters'">

          <!-- ── Fantasy scoring ────────────────────────────── -->
          <div class="masters-section">
            <div class="section-header">
              <h2 class="section-title">Masters Fantasy</h2>
              <div class="event-toggles">
                <span class="event-toggles-label">Mark complete:</span>
                <button class="event-toggle-btn" :class="{ completed: completedEvents.fantasy }"
                  @click="toggleEventCompleted('fantasy')">
                  Fantasy
                </button>
              </div>
            </div>

            <p class="sc-hint">
              Enter each player's raw Masters fantasy score from the official league.
              Click <strong>Compute Rankings</strong> to assign points via the standings table.
            </p>

            <div class="actual-putts-row">
              <label class="actual-putts-label">Actual putts (tiebreaker):</label>
              <input type="number" class="actual-putts-input" min="0"
                :value="actualPutts ?? ''"
                @change="setActualPutts($event.target.value)"
                placeholder="e.g. 128" />
            </div>

            <div class="scorecard-entry-wrap fantasy-table-wrap">
              <table class="entry-table">
                <thead>
                  <tr class="et-header">
                    <th class="et-name-col">Player</th>
                    <th class="et-putts-col">Putts Guess</th>
                    <th class="et-score-col">Fantasy Score</th>
                    <th class="et-rank-col">Rank</th>
                    <th class="et-pts-col">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="player in players" :key="player.id">
                    <td class="et-name-col et-name">{{ player.user.first_name }} {{ player.user.last_name }}</td>
                    <td class="et-putts-col et-computed">
                      <span v-if="player.total_putts !== null && player.total_putts !== undefined">
                        {{ player.total_putts }}
                      </span>
                      <span v-else class="et-na">—</span>
                    </td>
                    <td class="et-score-col">
                      <input type="number" class="hole-input score-input" min="0"
                        :value="fantasyScoreInputs[player.id] ?? ''"
                        @change="setFantasyScore(player.id, $event.target.value)"
                        placeholder="—" />
                    </td>
                    <td class="et-rank-col et-computed">
                      <span v-if="fantasyRankPreview[player.id]?.rank">
                        {{ fantasyRankPreview[player.id].rank }}
                      </span>
                      <span v-else class="et-na">—</span>
                    </td>
                    <td class="et-pts-col et-computed">
                      <span v-if="fantasyRankPreview[player.id]?.points" class="et-pts-val">
                        {{ fantasyRankPreview[player.id].points }}
                      </span>
                      <span v-else class="et-na">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="compute-row">
              <button class="btn-compute" @click="computeFantasy">Compute &amp; Lock Rankings</button>
              <span v-if="fantasyLocked" class="compute-notice">Points applied — export to save to data.json</span>
            </div>
          </div>

          <!-- ── Watch Party ─────────────────────────────────── -->
          <div class="masters-section">
            <div class="section-header">
              <h2 class="section-title">Watch Party Attendance</h2>
              <div class="bonus-pts-row">
                <label class="actual-putts-label">Bonus pts per attendee:</label>
                <input type="number" class="actual-putts-input" min="0" max="200"
                  :value="watchParty.bonus_points"
                  @change="setWatchPartyBonus($event.target.value)" />
              </div>
            </div>
            <p class="sc-hint">Mark players who stayed through the closing ceremony to award bonus points.</p>

            <div class="watch-party-grid">
              <label v-for="player in players" :key="player.id" class="wp-player-row">
                <input type="checkbox"
                  :checked="!!watchParty.attendees[player.id]"
                  @change="toggleWatchParty(player.id)"
                  class="wp-checkbox" />
                <span class="wp-name">{{ player.user.first_name }} {{ player.user.last_name }}</span>
                <span v-if="watchParty.attendees[player.id]" class="wp-bonus">+{{ watchParty.bonus_points }}</span>
              </label>
            </div>
          </div>

          <div class="sc-control-btns masters-export-row">
            <button class="btn-reset" @click="confirmReset">Reset All</button>
            <button class="btn-export" @click="copyDataJson">{{ exportLabel }}</button>
          </div>
        </div>

      </div>
    </template>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import playerData from '../assets/data.json';
import config from '../assets/config.json';
import { PUTT_PAR_YELLOW, PUTT_PAR_BLUE, PUTT_PAR_ALL, SCRAMBLE_PAR, SCRAMBLE2_PAR, FANTASY_POINTS, bestOf18Score, calcRankings } from '../constants/scoring';

export default {
  name: 'AdminView',

  data() {
    return {
      authenticated: sessionStorage.getItem('admin-auth') === '1',
      passwordInput: '',
      authError: false,
      tab: 'putt',
      exportLabel: 'Copy data.json',
      fantasyScoreInputs: {},
      fantasyLocked: false,
      PUTT_PAR_YELLOW,
      PUTT_PAR_BLUE,
      PUTT_PAR_ALL,
      SCRAMBLE_PAR,
      SCRAMBLE2_PAR,
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
      'puttPuttHoles', 'scramble1Holes', 'scramble2Holes',
      'puttPuttRankings', 'scramble1Rankings', 'scramble2Rankings',
      'watchParty', 'actualPutts',
    ]),

    puttPuttEntryRows() {
      return playerData.players.map((p) => ({
        id:     p.id,
        name:   `${p.user.first_name} ${p.user.last_name}`,
        scores: this.puttPuttHoles[p.id] ?? Array(36).fill(null),
      }));
    },

    scramble1EntryRows() {
      const teamMap = {};
      playerData.players.forEach((p) => {
        if (!p.scramble1_team) return;
        if (!teamMap[p.scramble1_team]) teamMap[p.scramble1_team] = [];
        teamMap[p.scramble1_team].push(`${p.user.first_name} ${p.user.last_name}`);
      });
      return Object.keys(teamMap)
        .map(Number)
        .sort((a, b) => a - b)
        .map((num) => ({
          num,
          members: teamMap[num].join(' / '),
          scores:  this.scramble1Holes[num] ?? Array(18).fill(null),
        }));
    },

    scramble2EntryRows() {
      const teamMap = {};
      playerData.players.forEach((p) => {
        if (!p.scramble2_team) return;
        if (!teamMap[p.scramble2_team]) teamMap[p.scramble2_team] = [];
        teamMap[p.scramble2_team].push(`${p.user.first_name} ${p.user.last_name}`);
      });
      return Object.keys(teamMap)
        .map(Number)
        .sort((a, b) => a - b)
        .map((num) => ({
          num,
          members: teamMap[num].join(' / '),
          scores:  this.scramble2Holes[num] ?? Array(18).fill(null),
        }));
    },

    scramble1ParOut() { return SCRAMBLE_PAR.slice(0, 9).reduce((s, v) => s + v, 0); },
    scramble1ParIn()  { return SCRAMBLE_PAR.slice(9).reduce((s, v) => s + v, 0); },
    scramble2ParOut() { return SCRAMBLE2_PAR.slice(0, 9).reduce((s, v) => s + v, 0); },
    scramble2ParIn()  { return SCRAMBLE2_PAR.slice(9).reduce((s, v) => s + v, 0); },

    /** Live preview of fantasy rankings before locking. */
    fantasyRankPreview() {
      const scoreTotals = playerData.players.map((p) => ({
        id:    p.id,
        total: this.fantasyScoreInputs[p.id] != null ? Number(this.fantasyScoreInputs[p.id]) : null,
      }));
      const actualPutts = this.actualPutts;
      const tiebreakers = actualPutts != null
        ? Object.fromEntries(playerData.players.map((p) => [p.id, Math.abs((p.total_putts || 0) - actualPutts)]))
        : {};
      return calcRankings(scoreTotals, FANTASY_POINTS, tiebreakers);
    },
  },

  methods: {
    ...mapMutations([
      'resetScores', 'toggleEventCompleted',
      'updatePuttPuttHole',
      'updateScramble1Hole', 'updateScramble2Hole',
      'applyFantasyPoints',
      'setActualPutts',
      'toggleWatchParty', 'setWatchPartyBonus',
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

    puttDisplayScore(scores) {
      const result = bestOf18Score(scores, PUTT_PAR_ALL);
      if (result === null) return '—';
      return result === 0 ? 'E' : result > 0 ? `+${result}` : `${result}`;
    },

    setScramble1Hole(teamNum, holeIndex, value) {
      this.updateScramble1Hole({ teamNum, holeIndex, value });
    },

    setScramble2Hole(teamNum, holeIndex, value) {
      this.updateScramble2Hole({ teamNum, holeIndex, value });
    },

    setFantasyScore(playerId, value) {
      if (value === '' || value === null) {
        const updated = { ...this.fantasyScoreInputs };
        delete updated[playerId];
        this.fantasyScoreInputs = updated;
      } else {
        this.fantasyScoreInputs = { ...this.fantasyScoreInputs, [playerId]: Number(value) };
      }
      this.fantasyLocked = false;
    },

    computeFantasy() {
      const scoreTotals = playerData.players.map((p) => ({
        id:    p.id,
        total: this.fantasyScoreInputs[p.id] != null ? Number(this.fantasyScoreInputs[p.id]) : null,
      }));
      this.applyFantasyPoints(scoreTotals);
      this.fantasyLocked = true;
    },

    subtotal(scores, from, to) {
      const slice = scores.slice(from, to);
      if (slice.every((s) => s === null || s === undefined)) return '—';
      return slice.reduce((sum, s) => sum + (s ?? 0), 0);
    },

    confirmReset() {
      if (confirm('Reset ALL scores and hole data to defaults? This cannot be undone.')) {
        this.fantasyScoreInputs = {};
        this.fantasyLocked = false;
        this.resetScores();
      }
    },

    async copyDataJson() {
      const puttScores = Object.fromEntries(
        playerData.players.map((p) => [String(p.id), this.puttPuttHoles[p.id] ?? Array(36).fill(null)])
      );

      const s1TeamNums = [...new Set(playerData.players.map((p) => p.scramble1_team).filter(Boolean))].sort((a, b) => a - b);
      const s2TeamNums = [...new Set(playerData.players.map((p) => p.scramble2_team).filter(Boolean))].sort((a, b) => a - b);

      const scramble1Scores = Object.fromEntries(
        s1TeamNums.map((num) => [String(num), this.scramble1Holes[num] ?? Array(18).fill(null)])
      );
      const scramble2Scores = Object.fromEntries(
        s2TeamNums.map((num) => [String(num), this.scramble2Holes[num] ?? Array(18).fill(null)])
      );

      const fantasyPts = Object.fromEntries(
        playerData.players.map((p) => [String(p.id), this.$store.state.fantasyPoints[p.id] ?? 0])
      );

      const output = {
        _version:          playerData._version,
        actual_putts:      this.actualPutts,
        completed_events:  this.$store.state.completedEvents,
        watch_party: {
          bonus_points: this.watchParty.bonus_points,
          attendees:    this.watchParty.attendees,
        },
        fantasy_points: fantasyPts,
        players:        playerData.players,
        scorecard: {
          putt_putt:  { scores: puttScores },
          scramble1:  { scores: scramble1Scores },
          scramble2:  { scores: scramble2Scores },
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

  &:hover { color: $primary; }
  &.active { color: $primary; border-bottom-color: $masters-accent; }
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

  &:hover { border-color: $masters-accent; color: $masters-accent; }
  &.completed { background: $masters-accent; border-color: $masters-accent; color: white; }
}

// ─── Buttons ──────────────────────────────────────────────────────────────────
.btn-reset,
.btn-export,
.btn-compute {
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
  &:hover { background: #e0e0e0; }
}

.btn-export {
  background: $primary;
  color: white;
  &:hover { background: darken($primary, 6%); }
}

.btn-compute {
  background: $masters-accent;
  color: white;
  &:hover { background: darken($masters-accent, 8%); }
}

// ─── Scorecard Entry ──────────────────────────────────────────────────────────
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

// ─── Course header spanning cells ─────────────────────────────────────────────
.et-course-header {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  padding: 0.3rem 0.5rem !important;
}

.et-course-yellow { background: rgba(#f5c518, 0.18) !important; color: #5a3d00 !important; }
.et-course-blue   { background: rgba(#1565c0, 0.15) !important; color: #0d2f6b !important; }

.et-blue-col { background: rgba(#1565c0, 0.04); }

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

.et-par-yellow td { background: rgba(#f5c518, 0.12) !important; }
.et-par-blue   td { background: rgba(#1565c0, 0.08) !important; }

// ─── Column widths ────────────────────────────────────────────────────────────
.et-name-col,
.et-team-col {
  text-align: left !important;
  min-width: 130px;
  position: sticky;
  left: 0;
  z-index: 2;
  background: white;
  padding: 0.4rem 0.6rem !important;
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
  min-width: 52px;
  border-left: 2px solid $masters-accent !important;
}

.et-rank-col {
  min-width: 36px;
  border-left: 2px solid rgba($masters-gold, 0.4) !important;
}

.et-pts-col   { min-width: 44px; }
.et-putts-col { min-width: 90px; }
.et-score-col { min-width: 90px; }

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

.et-total    { font-weight: 700; color: $primary; }
.et-pts-val  { font-weight: 700; color: $masters-accent; }
.et-na       { color: #ccc; }

.team-label        { font-weight: 700; color: $primary; margin-right: 0.4rem; }
.team-members-small { font-size: 0.72rem; color: #777; font-weight: 400; }

// ─── Course badges ────────────────────────────────────────────────────────────
.course-badge {
  display: inline-block;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 1px 4px;
  border-radius: 2px;
  vertical-align: middle;
  line-height: 1.4;
  margin-right: 3px;

  &--yellow { background: #f5c518; color: #5a3d00; }
  &--blue   { background: #1565c0; color: white; }
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
  -moz-appearance: textfield;
}

.score-input {
  width: 70px;
  height: 30px;
  padding: 0 6px;
  display: inline-block;
  margin: 3px auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 2px;

  &:focus {
    outline: none;
    border-color: $masters-accent;
  }
}

// ─── No teams message ─────────────────────────────────────────────────────────
.no-teams-msg {
  font-size: 0.85rem;
  color: #999;
  padding: 2rem 0;
  margin: 0;

  code {
    background: rgba(0,0,0,0.06);
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 0.82rem;
    color: #555;
  }
}

// ─── Masters tab sections ─────────────────────────────────────────────────────
.masters-section {
  margin-bottom: 2.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: $primary;
  margin: 0;
  font-family: $heading-font-stack;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.actual-putts-row,
.bonus-pts-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.75rem;
}

.actual-putts-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.actual-putts-input {
  width: 100px;
  padding: 0.35rem 0.6rem;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 0.85rem;
  font-family: $body-font-stack;
  color: #333;

  &:focus {
    outline: none;
    border-color: $masters-accent;
    box-shadow: 0 0 0 2px rgba($masters-accent, 0.1);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button { display: none; }
  -moz-appearance: textfield;
}

.fantasy-table-wrap { margin-bottom: 0.75rem; }

.compute-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.compute-notice {
  font-size: 0.78rem;
  color: $masters-accent;
  font-weight: 600;
}

// ─── Watch Party grid ─────────────────────────────────────────────────────────
.watch-party-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.wp-player-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
  cursor: pointer;
  transition: background 0.1s;

  &:hover { background: rgba($masters-accent, 0.05); }
}

.wp-checkbox {
  width: 15px;
  height: 15px;
  accent-color: $masters-accent;
  cursor: pointer;
  flex-shrink: 0;
}

.wp-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: $primary;
  flex: 1;
}

.wp-bonus {
  font-size: 0.75rem;
  font-weight: 700;
  color: $masters-accent;
}

.masters-export-row {
  margin-top: 0.5rem;
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

// ─── Page header ──────────────────────────────────────────────────────────────
.page-header {
  padding: 1.5rem 1.5rem 0;

  h1 {
    font-family: $heading-font-stack;
    font-size: 1.4rem;
    font-weight: 700;
    color: $primary;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin: 0 0 0.2rem;
  }
}

.page-subtitle {
  font-size: 0.82rem;
  color: #aaa;
  margin: 0;
}
</style>
