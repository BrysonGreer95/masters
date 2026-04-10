<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="masters_table">
    <div class="page-header">
      <h1>Masters Fantasy</h1>
      <p class="page-subtitle">Overall standings &bull; {{ cfg.year }} Masters</p>
    </div>

    <div class="league-bar">
      <a
        :href="cfg.events.fantasy.league_url"
        target="_blank"
        rel="noopener noreferrer"
        class="league-link"
      >Join the Fantasy League &rarr;</a>
    </div>

    <div class="table-wrap">
      <div class="table-responsive masters-table-vertical-lines">
        <b-table
          striped
          bordered
          :data="tableData"
          default-sort="totalNum"
          default-sort-direction="asc"
        >
          <b-table-column field="_rank" label="Pos" numeric v-slot="props">
            <span class="pos-num">{{ props.row._rank }}</span>
          </b-table-column>
          <b-table-column field="player" label="Player" sortable v-slot="props">
            {{ props.row.player }}
          </b-table-column>
          <b-table-column field="totalNum" label="Total" numeric sortable v-slot="props">
            <span v-if="!props.row.hasPicks" class="dns-label">DNS</span>
            <span v-else-if="scoresLoaded" :class="scoreClass(props.row.totalNum)" class="fantasy-total">
              {{ formatScore(props.row.totalNum) }}
            </span>
            <span v-else class="score-loading">—</span>
          </b-table-column>
          <b-table-column field="past_champ" label="Past Champ" v-slot="props">
            <div class="pick-cell">
              <span>{{ props.row.past_champ.name }}</span>
              <span v-if="props.row.past_champ.score !== null" :class="scoreClass(props.row.past_champ.score)" class="pick-score">
                {{ formatScore(props.row.past_champ.score) }}
              </span>
            </div>
          </b-table-column>
          <b-table-column field="us" label="United States" v-slot="props">
            <div class="pick-cell">
              <span>{{ props.row.us.name }}</span>
              <span v-if="props.row.us.score !== null" :class="scoreClass(props.row.us.score)" class="pick-score">
                {{ formatScore(props.row.us.score) }}
              </span>
            </div>
          </b-table-column>
          <b-table-column field="international" label="International" v-slot="props">
            <div class="pick-cell">
              <span>{{ props.row.international.name }}</span>
              <span v-if="props.row.international.score !== null" :class="scoreClass(props.row.international.score)" class="pick-score">
                {{ formatScore(props.row.international.score) }}
              </span>
            </div>
          </b-table-column>
          <b-table-column field="first_timer" label="First Timer" v-slot="props">
            <div class="pick-cell">
              <span>{{ props.row.first_timer.name }}</span>
              <span v-if="props.row.first_timer.score !== null" :class="scoreClass(props.row.first_timer.score)" class="pick-score">
                {{ formatScore(props.row.first_timer.score) }}
              </span>
            </div>
          </b-table-column>
          <b-table-column field="wild_card" label="Wild Card" v-slot="props">
            <div class="pick-cell">
              <span>{{ props.row.wild_card.name }}</span>
              <span v-if="props.row.wild_card.score !== null" :class="scoreClass(props.row.wild_card.score)" class="pick-score">
                {{ formatScore(props.row.wild_card.score) }}
              </span>
            </div>
          </b-table-column>
          <b-table-column field="total_putts" label="Total Putts" numeric sortable v-slot="props">
            {{ props.row.total_putts || '—' }}
          </b-table-column>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getCurrentTournId, fetchLeaderboard, parseScore, formatScore, scoreClass, isTournamentComplete } from '@/api/golf.js';
import config from '@/assets/config.json';

export default {
  data() {
    return {
      leaderboard: [],
      scoresLoaded: false,
      cfg: config,
    };
  },

  computed: {
    ...mapGetters(['players', 'completedEvents']),

    tableData() {
      const rows = this.players.map((player) => {
        const picks = (player.fantasy_picks ?? []).slice(0, 5).map((name) => ({
          name: name || '',
          score: name?.trim() ? this.lookupScore(name) : null,
        }));
        while (picks.length < 5) picks.push({ name: '', score: null });

        const hasPicks = picks.some((p) => p.name.trim());
        const totalNum = hasPicks
          ? picks.reduce((sum, p) => p.name.trim() && p.score !== null ? sum + p.score : sum, 0)
          : Infinity;

        return {
          player:        `${player.user.first_name} ${player.user.last_name}`,
          totalNum,
          hasPicks,
          past_champ:    picks[0],
          us:            picks[1],
          international: picks[2],
          first_timer:   picks[3],
          wild_card:     picks[4],
          total_putts:   player.total_putts || '',
        };
      });

      return rows
        .sort((a, b) => {
          if (a.hasPicks !== b.hasPicks) return a.hasPicks ? -1 : 1;
          return a.totalNum - b.totalNum;
        })
        .map((r, i) => ({ ...r, _rank: i + 1 }));
    },
  },

  methods: {
    lookupScore(name) {
      if (!name?.trim() || !this.leaderboard.length) return null;
      const normalized = name.toLowerCase().trim();
      const golfer = this.leaderboard.find(
        (g) => `${g.firstName} ${g.lastName}`.toLowerCase() === normalized,
      );
      return golfer ? parseScore(golfer.total) : null;
    },

    formatScore,
    scoreClass,

    async loadScores() {
      try {
        const tournId = await getCurrentTournId();
        const { rows, currentRound, roundStatus } = await fetchLeaderboard(tournId);
        this.leaderboard = rows;
        this.scoresLoaded = true;

        // Auto-apply fantasy points once when the tournament is officially over
        if (!this.completedEvents.fantasy && isTournamentComplete(rows, currentRound, roundStatus)) {
          const scoreTotals = this.players.map((player) => {
            const picks = (player.fantasy_picks ?? []).slice(0, 5);
            const hasPicks = picks.some((n) => n.trim());
            if (!hasPicks) return { id: player.id, total: null };
            const total = picks.reduce((sum, name) => sum + (this.lookupScore(name) ?? 0), 0);
            return { id: player.id, total };
          });
          this.$store.commit('applyFantasyPoints', scoreTotals);
        }
      } catch (err) {
        console.error('Masters fantasy score fetch error:', err);
      }
    },
  },

  async created() {
    await this.loadScores();
  },
};
</script>

<style lang="scss">
@import '../styles/_variables.scss';

.league-bar {
  text-align: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.league-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: $masters-accent;
  text-decoration: none;
  letter-spacing: 0.3px;

  &:hover {
    color: $primary;
    text-decoration: underline;
  }
}

.table-wrap {
  padding: 0 1.5rem 2rem;
}

.masters-table-vertical-lines th,
.masters-table-vertical-lines td {
  border-right: 1px solid rgba($masters-accent, 0.15);
  padding: 0.75em 0.75em !important;
}

.masters-table-vertical-lines th:last-child,
.masters-table-vertical-lines td:last-child {
  border-right: none;
}

.masters-table-vertical-lines thead th {
  border-bottom: 2px solid $masters-accent;
}

.pos-num {
  font-weight: 600;
  color: #999;
  font-size: 0.9rem;
}

.highlight {
  color: $masters-gold;
  font-weight: 700;
}

.pick-cell {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.pick-score {
  font-size: 0.78rem;
}

.fantasy-total {
  font-size: 1rem;
  font-weight: 700;
}

.score-loading {
  color: #ccc;
}

.dns-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #bbb;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
</style>
