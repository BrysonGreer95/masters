<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="results">
    <div class="page-header">
      <h1>Event Results</h1>
      <p class="page-subtitle">Masters Week 2026 &bull; Scorecards &amp; Standings</p>
    </div>

    <div class="events-grid">
      <!-- ─── ParTee Shack Card ─────────────────────────────────── -->
      <div class="event-card">
        <div class="event-card-header">
          <div>
            <h2 class="event-title">ParTee Shack</h2>
            <p class="event-meta">Friday, April 10 &bull; Putt Putt &bull; 36 Holes</p>
          </div>
        </div>

        <div class="event-results">
          <div v-if="puttPuttPlayed" class="podium">
            <div v-for="(entry, i) in puttPuttPodium" :key="entry.id" class="podium-row">
              <span class="podium-rank">{{ i + 1 }}</span>
              <span class="podium-name">{{ entry.name }}</span>
              <span class="podium-score">{{ entry.total }}</span>
            </div>
          </div>
          <p v-else class="no-scores">Scores not yet entered</p>
        </div>

        <button class="scorecard-btn" @click="puttPuttOpen = true">
          View Scorecard
        </button>
      </div>

      <!-- ─── Scramble Card ─────────────────────────────────────── -->
      <div class="event-card">
        <div class="event-card-header">
          <div>
            <h2 class="event-title">Scramble</h2>
            <p class="event-meta">Saturday, April 11 &bull; 12 PM &bull; Reedy Creek Golf Course &bull; 18 Holes</p>
          </div>
        </div>

        <div class="event-results">
          <div v-if="scramblePlayed" class="podium">
            <div v-for="(entry, i) in scramblePodium" :key="entry.team" class="podium-row">
              <span class="podium-rank">{{ i + 1 }}</span>
              <span class="podium-name">{{ entry.label }}</span>
              <span class="podium-score">{{ entry.total }}</span>
            </div>
          </div>
          <p v-else class="no-scores">Scores not yet entered</p>
        </div>

        <button class="scorecard-btn" @click="scrambleOpen = true">
          View Scorecard
        </button>
      </div>

      <!-- ─── Fantasy Card ──────────────────────────────────────── -->
      <div class="event-card">
        <div class="event-card-header">
          <div>
            <h2 class="event-title">Masters Fantasy</h2>
            <p class="event-meta">Sunday, April 12 &bull; 2026 Masters</p>
          </div>
        </div>

        <div class="event-results">
          <p class="no-scores">View live standings and picks on the Fantasy page.</p>
        </div>

        <router-link to="/masters" class="scorecard-btn">
          View Standings
        </router-link>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- ParTee Shack Scorecard Modal                                   -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <b-modal v-model="puttPuttOpen" :width="960" scroll="keep" has-modal-card>
      <div class="modal-card scorecard-modal">
        <header class="modal-card-head">
          <p class="modal-card-title">ParTee Shack &mdash; Scorecard</p>
          <button class="delete" @click="puttPuttOpen = false" aria-label="close"></button>
        </header>
        <section class="modal-card-body scorecard-body">
          <div class="scorecard-wrap">
            <table class="scorecard-table">
              <thead>
                <tr class="sc-header-row">
                  <th class="sc-player-col sc-label">Player</th>
                  <th v-for="h in 36" :key="`h-${h}`" class="sc-hole-col">{{ h }}</th>
                  <th class="sc-subtotal-col">OUT</th>
                  <th class="sc-subtotal-col">IN</th>
                  <th class="sc-total-col">TOT</th>
                </tr>
                <tr class="sc-par-row">
                  <td class="sc-player-col sc-label">Par</td>
                  <td v-for="h in 36" :key="`p-${h}`" class="sc-hole-col">{{ puttPar }}</td>
                  <td class="sc-subtotal-col">{{ puttPar * 18 }}</td>
                  <td class="sc-subtotal-col">{{ puttPar * 18 }}</td>
                  <td class="sc-total-col">{{ puttPar * 36 }}</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="player in puttPuttRows" :key="player.id">
                  <td class="sc-player-col sc-name">{{ player.name }}</td>
                  <td
                    v-for="h in 36"
                    :key="`${player.id}-${h}`"
                    class="sc-hole-col"
                    :class="scoreHoleClass(player.scores[h - 1], puttPar)"
                  >
                    {{ player.scores[h - 1] !== null ? player.scores[h - 1] : '' }}
                  </td>
                  <td class="sc-subtotal-col">{{ holeSubtotal(player.scores, 0, 18) }}</td>
                  <td class="sc-subtotal-col">{{ holeSubtotal(player.scores, 18, 36) }}</td>
                  <td class="sc-total-col">{{ holeSubtotal(player.scores, 0, 36) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </b-modal>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- Scramble Scorecard Modal                                       -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <b-modal v-model="scrambleOpen" :width="960" scroll="keep" has-modal-card>
      <div class="modal-card scorecard-modal">
        <header class="modal-card-head">
          <p class="modal-card-title">Scramble &mdash; Scorecard</p>
          <button class="delete" @click="scrambleOpen = false" aria-label="close"></button>
        </header>
        <section class="modal-card-body scorecard-body">
          <div class="scorecard-wrap">
            <table class="scorecard-table">
              <thead>
                <tr class="sc-header-row">
                  <th class="sc-team-col sc-label">Team</th>
                  <th v-for="h in 18" :key="`h-${h}`" class="sc-hole-col">{{ h }}</th>
                  <th class="sc-subtotal-col">OUT</th>
                  <th class="sc-subtotal-col">IN</th>
                  <th class="sc-total-col">TOT</th>
                </tr>
                <tr class="sc-par-row">
                  <td class="sc-team-col sc-label">Par</td>
                  <td v-for="(p, i) in scramblePar" :key="`p-${i}`" class="sc-hole-col">{{ p }}</td>
                  <td class="sc-subtotal-col">{{ scrambleParOut }}</td>
                  <td class="sc-subtotal-col">{{ scrambleParIn }}</td>
                  <td class="sc-total-col">{{ scrambleParOut + scrambleParIn }}</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="team in scrambleRows" :key="team.num">
                  <td class="sc-team-col sc-name">
                    <span class="team-num">{{ team.num }}</span>
                    <span class="team-members">{{ team.members }}</span>
                  </td>
                  <td
                    v-for="h in 18"
                    :key="`${team.num}-${h}`"
                    class="sc-hole-col"
                    :class="scoreHoleClass(team.scores[h - 1], scramblePar[h - 1])"
                  >
                    {{ team.scores[h - 1] !== null ? team.scores[h - 1] : '' }}
                  </td>
                  <td class="sc-subtotal-col">{{ holeSubtotal(team.scores, 0, 9) }}</td>
                  <td class="sc-subtotal-col">{{ holeSubtotal(team.scores, 9, 18) }}</td>
                  <td class="sc-total-col sc-grand-total">{{ holeSubtotal(team.scores, 0, 18) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import playerData from '../assets/data.json';
import { PUTT_PAR, SCRAMBLE_PAR } from '../constants/scoring';

export default {
  name: 'ResultsView',

  data() {
    return {
      puttPuttOpen: false,
      scrambleOpen: false,
      puttPar:    PUTT_PAR,
      scramblePar: SCRAMBLE_PAR,
    };
  },

  computed: {
    ...mapGetters(['puttPuttHoles', 'scrambleHoles', 'puttPuttRankings', 'scrambleRankings']),

    // ─── Putt Putt ──────────────────────────────────────────────────
    puttPuttRows() {
      return playerData.map((p) => ({
        id:     p.id,
        name:   `${p.user.first_name} ${p.user.last_name}`,
        scores: this.puttPuttHoles[p.id] ?? Array(36).fill(null),
      }));
    },

    puttPuttPlayed() {
      return Object.values(this.puttPuttHoles).some((arr) => arr.some((s) => s !== null));
    },

    puttPuttPodium() {
      return [...this.puttPuttRows]
        .map((p) => ({ ...p, total: this.holeSubtotal(p.scores, 0, 36) }))
        .filter((p) => p.total !== '—')
        .sort((a, b) => Number(a.total) - Number(b.total))
        .slice(0, 3);
    },

    // ─── Scramble ───────────────────────────────────────────────────
    scrambleRows() {
      const teamMap = {};
      playerData.forEach((p) => {
        if (!p.team) return;
        if (!teamMap[p.team]) teamMap[p.team] = [];
        teamMap[p.team].push(`${p.user.first_name} ${p.user.last_name}`);
      });
      return Object.keys(teamMap)
        .sort((a, b) => Number(a) - Number(b))
        .map((num) => ({
          num:     Number(num),
          members: teamMap[num].join(' / '),
          scores:  this.scrambleHoles[num] ?? Array(18).fill(null),
        }));
    },

    scramblePlayed() {
      return Object.values(this.scrambleHoles).some((arr) => arr.some((s) => s !== null));
    },

    scramblePodium() {
      return [...this.scrambleRows]
        .map((t) => ({ ...t, label: `Team ${t.num} — ${t.members}`, total: this.holeSubtotal(t.scores, 0, 18) }))
        .filter((t) => t.total !== '—')
        .sort((a, b) => Number(a.total) - Number(b.total))
        .slice(0, 3);
    },

    scrambleParOut() {
      return this.scramblePar.slice(0, 9).reduce((s, v) => s + v, 0);
    },

    scrambleParIn() {
      return this.scramblePar.slice(9, 18).reduce((s, v) => s + v, 0);
    },
  },

  methods: {
    holeSubtotal(scores, from, to) {
      const slice = scores.slice(from, to);
      if (slice.every((s) => s === null)) return '—';
      return slice.reduce((sum, s) => sum + (s ?? 0), 0);
    },

    scoreHoleClass(score, par) {
      if (score === null || score === undefined) return '';
      if (score < par) return 'sc-under';
      if (score > par) return 'sc-over';
      return 'sc-even';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

#results {
  width: 100%;
}

// ─── Event Cards Grid ────────────────────────────────────────────────────────
.events-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding: 2rem 1.5rem 3rem;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: $bp-tablet) {
    grid-template-columns: 1fr;
    padding: 1.5rem 1rem 2rem;
  }
}

.event-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-top: 3px solid $masters-accent;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1rem;
}

.event-card-header {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.event-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: $primary;
  margin: 0 0 0.2rem;
  font-family: $heading-font-stack;
  letter-spacing: 0.3px;
}

.event-meta {
  font-size: 0.78rem;
  color: #999;
  margin: 0;
  line-height: 1.5;
}

// ─── Podium / No Scores ───────────────────────────────────────────────────────
.event-results {
  flex: 1;
}

.podium {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.podium-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
}

.podium-rank {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $primary;
  color: white;
  font-weight: 700;
  font-size: 0.7rem;
  flex-shrink: 0;
}

.podium-name {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.podium-score {
  font-weight: 700;
  color: $primary;
  font-size: 0.9rem;
}

.no-scores {
  font-size: 0.85rem;
  color: #bbb;
  font-style: italic;
  margin: 0;
}

// ─── Scorecard Button ────────────────────────────────────────────────────────
.scorecard-btn {
  display: block;
  background: $primary;
  color: white;
  border: none;
  padding: 0.6rem 1.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: $body-font-stack;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  transition: background 0.15s ease;

  &:hover {
    background: $masters-accent;
  }
}

// ─── Modal Shared ────────────────────────────────────────────────────────────
.scorecard-modal {
  width: 100%;
  max-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}

.scorecard-body {
  padding: 0;
  overflow-y: auto;
  overflow-x: auto;
  flex: 1;
  min-height: 0;
}

.scorecard-wrap {
  min-width: max-content;
}

// ─── Scorecard Table ─────────────────────────────────────────────────────────
.scorecard-table {
  border-collapse: collapse;
  width: max-content;
  min-width: 100%;
  font-size: 0.82rem;
  font-family: $body-font-stack;

  th, td {
    border: 1px solid rgba(0, 0, 0, 0.1);
    text-align: center;
    padding: 0.45rem 0.5rem;
    white-space: nowrap;
  }
}

// ─── Header Row ───────────────────────────────────────────────────────────────
.sc-header-row {
  th {
    background: $primary;
    color: white;
    font-weight: 700;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
  }


}

// ─── Par Row ──────────────────────────────────────────────────────────────────
.sc-par-row {
  td {
    background: rgba($masters-accent, 0.08);
    color: #666;
    font-size: 0.75rem;
    font-weight: 600;
  }
}

// ─── Column Widths ────────────────────────────────────────────────────────────
.sc-player-col,
.sc-team-col {
  text-align: left !important;
  min-width: 130px;
  position: sticky;
  left: 0;
  z-index: 1;
  background: white;

  &.sc-label {
    background: $primary !important;
    color: white;
  }
}

// The par row's sticky player cell needs its own background
.sc-par-row .sc-player-col,
.sc-par-row .sc-team-col {
  background: rgba($masters-accent, 0.08) !important;
}

.sc-hole-col {
  min-width: 32px;
  width: 32px;
}

.sc-subtotal-col {
  min-width: 38px;
  background: rgba(0, 0, 0, 0.03);
  font-weight: 600;
  border-left: 2px solid rgba($masters-accent, 0.3);
}

.sc-total-col {
  min-width: 42px;
  font-weight: 700;
  color: $primary;
  background: rgba($masters-accent, 0.06);
  border-left: 2px solid $masters-accent;
}

.sc-grand-total {
  font-size: 0.9rem;
}

// ─── Player / Team name cells ────────────────────────────────────────────────
.sc-name {
  font-weight: 600;
  color: $primary;
  background: white;
}

.sc-team-col.sc-name {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.team-num {
  font-weight: 700;
  color: $primary;
  flex-shrink: 0;
}

.team-members {
  font-weight: 500;
  color: #555;
  font-size: 0.78rem;
}

// ─── Score Cell Colors ────────────────────────────────────────────────────────
.sc-under {
  background: #dcfce7;  // birdie = green
  color: #166534;
  font-weight: 700;
}

.sc-even {
  background: #dbeafe;  // par = blue
  color: #1e40af;
  font-weight: 600;
}

.sc-over {
  background: #fee2e2;  // bogey/worse = red
  color: #b91c1c;
}
</style>
