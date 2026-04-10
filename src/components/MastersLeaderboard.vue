<!-- eslint-disable vue/no-unused-vars -->
<template>
  <div class="masters-leaderboard">
    <div class="page-header">
      <h1>{{ tournamentDisplayName }}</h1>
      <p class="page-subtitle" v-if="tournamentDate">{{ tournamentDate }}</p>
      <p class="last-updated" v-if="lastUpdated">Updated {{ lastUpdated }}</p>
    </div>

    <div class="leaderboard-body">
      <div class="loading-container" v-if="isLoading">
        <div class="spinner" aria-hidden="true"></div>
      </div>

      <div v-else>
        <!-- Search bar -->
        <div class="search-bar-wrap">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search player..."
            class="player-search"
          />
          <span v-if="searchQuery" class="search-clear" @click="searchQuery = ''">&times;</span>
        </div>

        <!-- Desktop table -->
        <div class="content-centered table-responsive is-hidden-mobile">
          <b-table bordered striped :data="filteredScores" default-sort="positionNum" default-sort-direction="asc">
            <b-table-column field="playerName" label="Player" sortable v-slot="props">
              {{ props.row.firstName }} {{ props.row.lastName }}
            </b-table-column>
            <b-table-column field="positionNum" label="Pos" numeric sortable v-slot="props">
              {{ props.row.position }}
            </b-table-column>
            <b-table-column field="totalNum" label="Score" numeric sortable v-slot="props">
              <span :class="scoreClass(props.row.total)">{{ props.row.total }}</span>
            </b-table-column>
            <b-table-column field="currentRoundScore" label="Today" numeric sortable v-slot="props">
              {{ props.row.currentRoundScore }}
            </b-table-column>
            <b-table-column field="thru" label="Thru" sortable v-slot="props">
              {{ props.row.thru }}
            </b-table-column>
          </b-table>
        </div>

        <!-- Mobile cards -->
        <div class="score-cards is-hidden-tablet">
          <div v-for="player in filteredScores" :key="`${player.id}-score`" class="score-card">
            <div class="score-card-header">
              <div class="player-info">
                <span class="score-player-name">{{ player.firstName }} {{ player.lastName }}</span>
                <span class="score-position">{{ player.position }}</span>
              </div>
              <span :class="['score-display', scoreClass(player.total)]">{{ player.total }}</span>
            </div>
            <div class="score-card-body">
              <div class="score-detail">
                <span class="detail-label">Today</span>
                <span class="detail-value">{{ player.currentRoundScore }}</span>
              </div>
              <div class="score-detail">
                <span class="detail-label">Through</span>
                <span class="detail-value">{{ player.thru }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let tournID = "014";
import axios from "axios";

export default {
  async created() {
    await this.getSchedule();
    await this.getTournament();
    await this.getScore();
    this.startAutoRefresh();
    this.isLoading = false;
  },
  computed: {
    sortedScores() {
      if (!this.currentScore || !Array.isArray(this.currentScore)) return [];
      const parsePos = (pos) => {
        const n = parseInt(String(pos ?? '').replace(/\D/g, ''), 10);
        return isNaN(n) || n <= 0 ? 9999 : n;
      };
      return [...this.currentScore]
        .sort((a, b) => parsePos(a.position) - parsePos(b.position))
        .map(p => ({
          ...p,
          playerName: `${p.firstName} ${p.lastName}`,
          positionNum: parsePos(p.position),
          totalNum: p.total === "E" || !p.total ? 0 : (parseInt(p.total) || 0),
        }));
    },
    filteredScores() {
      if (!this.searchQuery.trim()) return this.sortedScores;
      const q = this.searchQuery.toLowerCase();
      return this.sortedScores.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
      );
    },
    tournamentDisplayName() {
      return this.tournament && (this.tournament.name || this.tournament.tournamentName)
        ? (this.tournament.name || this.tournament.tournamentName)
        : "Current Tournament";
    },
    tournamentDate() {
      if (!this.tournament || !this.tournament.date) return "";
      const { start, end } = this.tournament.date;
      if (!start && !end) return "";
      try {
        const opts = { timeZone: "America/New_York", month: "long", day: "numeric" };
        const s = start ? new Date(start).toLocaleDateString("en-US", opts) : "";
        const e = end   ? new Date(end).toLocaleDateString("en-US", { ...opts, year: "numeric" }) : "";
        return s && e ? `${s} – ${e}` : s || e;
      } catch {
        return "";
      }
    },
  },
  methods: {
    scoreClass(score) {
      if (!score || score === "E") return "golf-score even-par";
      const n = parseInt(score);
      if (isNaN(n)) return "golf-score even-par";
      if (n < 0) return "golf-score under-par";
      if (n > 0) return "golf-score over-par";
      return "golf-score even-par";
    },
    async getSchedule() {
      try {
        const response = await axios.get("https://live-golf-data.p.rapidapi.com/schedule", {
          params: { orgId: "1", year: "2026" },
          headers: {
            "X-RapidAPI-Key": "6df9d41375msh7ea88695de29f7bp1ad8a6jsnf5f951f3046f",
            "X-RapidAPI-Host": "live-golf-data.p.rapidapi.com",
          },
        });
        const schedule = (response.data && response.data.schedule) || [];
        const today = new Date();
        const inProgress = schedule.find(s => {
          if (!s.date) return false;
          const start = s.date.start ? new Date(s.date.start) : null;
          const end   = s.date.end   ? new Date(s.date.end)   : null;
          return start && end && today >= start && today <= end;
        });
        if (inProgress) {
          tournID = inProgress.tournId || tournID;
        } else {
          const upcoming = schedule
            .filter(s => s.date && s.date.start && new Date(s.date.start) > today)
            .sort((a, b) => new Date(a.date.start) - new Date(b.date.start));
          if (upcoming.length) {
            tournID = upcoming[0].tournId || tournID;
          } else {
            const past = schedule
              .filter(s => s.date && s.date.end && new Date(s.date.end) < today)
              .sort((a, b) => new Date(b.date.end) - new Date(a.date.end));
            if (past.length) tournID = past[0].tournId || tournID;
          }
        }
        this.selectedTournId = tournID;
      } catch (error) {
        console.error("Error fetching schedule:", error);
        this.selectedTournId = tournID;
      }
    },
    async getScore() {
      try {
        const response = await axios.get("https://live-golf-data.p.rapidapi.com/leaderboard", {
          params: { orgId: "1", tournId: tournID, year: "2026" },
          headers: {
            "X-RapidAPI-Key": "6df9d41375msh7ea88695de29f7bp1ad8a6jsnf5f951f3046f",
            "X-RapidAPI-Host": "live-golf-data.p.rapidapi.com",
          },
        });
        this.currentScore = response.data?.leaderboardRows ?? [];
        const lu = response.data?.lastUpdated ?? new Date().toISOString();
        try {
          this.lastUpdated = new Date(lu).toLocaleString("en-US", { timeZone: "America/New_York" });
        } catch {
          this.lastUpdated = lu;
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        this.currentScore = [];
      }
    },
    async getTournament() {
      try {
        const response = await axios.get("https://live-golf-data.p.rapidapi.com/tournament", {
          params: { orgId: "1", tournId: tournID, year: "2026" },
          headers: {
            "X-RapidAPI-Key": "6df9d41375msh7ea88695de29f7bp1ad8a6jsnf5f951f3046f",
            "X-RapidAPI-Host": "live-golf-data.p.rapidapi.com",
          },
        });
        this.tournament = response.data || {};
      } catch (error) {
        console.error("Error fetching tournament:", error);
        this.tournament = {};
      }
    },
    startAutoRefresh() {
      this.stopAutoRefresh();
      this.refreshTimer = setInterval(() => this.getScore(), this.refreshIntervalMs);
    },
    stopAutoRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
      }
    },
  },
  data() {
    return {
      currentScore: [],
      tournament: {},
      selectedTournId: tournID,
      refreshIntervalMs: 30000,
      refreshTimer: null,
      lastUpdated: "",
      isLoading: true,
      searchQuery: "",
    };
  },
  beforeUnmount() {
    this.stopAutoRefresh();
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.masters-leaderboard {
  width: 100%;
}

.last-updated {
  font-size: 0.8rem;
  color: #aaa;
  margin: 0.5rem 0 0;
  letter-spacing: 0.3px;
}

.leaderboard-body {
  padding: 2rem 1.5rem;
}

.content-centered {
  max-width: 800px;
  margin: 0 auto;
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
.search-bar-wrap {
  position: relative;
  max-width: 320px;
  margin: 0 auto 1.25rem;
}

.player-search {
  width: 100%;
  padding: 0.55rem 2.2rem 0.55rem 0.85rem;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  font-size: 0.875rem;
  font-family: $body-font-stack;
  color: #333;
  background: white;
  box-sizing: border-box;
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: $masters-accent;
    box-shadow: 0 0 0 2px rgba($masters-accent, 0.12);
  }

  &::placeholder {
    color: #bbb;
  }
}

.search-clear {
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
  color: #bbb;
  cursor: pointer;
  line-height: 1;
  user-select: none;

  &:hover {
    color: #888;
  }
}

// ─── Score Display ────────────────────────────────────────────────────────────
.score-display {
  font-size: 1.2rem;
  min-width: 40px;
  text-align: center;
}

// ─── Mobile Cards ─────────────────────────────────────────────────────────────
.score-cards {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.score-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-left: 3px solid $masters-accent;
}

.score-card-header {
  background: #fafafa;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.score-player-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: $primary;
}

.score-position {
  font-size: 0.75rem;
  color: #999;
  font-weight: 500;
}

.score-card-body {
  padding: 0.6rem 1rem;
  display: flex;
  gap: 2rem;
}

.score-detail {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.detail-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
.loading-container {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.08);
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// ─── Show/Hide ────────────────────────────────────────────────────────────────
@media (min-width: 641px) {
  .score-cards { display: none; }
}

@media (max-width: 640px) {
  .leaderboard-body { padding: 1.25rem 1rem; }
  :deep(.table-responsive) { display: none; }
}
</style>
