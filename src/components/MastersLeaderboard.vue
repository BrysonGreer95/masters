<!-- eslint-disable vue/no-unused-vars -->
<template>
  <div class="masters-leaderboard">
    <div class="leaderboard-header">
      <h3 class="title is-3 mast-title">{{ tournamentDisplayName }}</h3>
      <p class="tournament-date" v-if="tournamentDate">{{ tournamentDate }}</p>
      <div class="tournament-meta">
        <span class="last-updated" v-if="lastUpdated">Last updated: {{ lastUpdated }}</span>
      </div>
    </div>

    <h4 class="score-section-title">Live Score</h4>
    
    <!-- Desktop table -->
    <div class="table-responsive is-hidden-mobile">
      <b-table striped :data="sortedScores">
        <b-table-column field="playerName" label="Player" v-slot="props">
          {{ props.row.firstName }} {{ props.row.lastName }}
        </b-table-column>
        <b-table-column field="position" label="Pos" numeric v-slot="props">
          {{ props.row.position }}
        </b-table-column>
        <b-table-column field="total_score" label="Score" numeric v-slot="props">
          <span class="points-badge">{{ props.row.total }}</span>
        </b-table-column>
        <b-table-column field="currentRoundScore" label="Today" numeric v-slot="props">
          {{ props.row.currentRoundScore }}
        </b-table-column>
        <b-table-column field="thru" label="Thru" v-slot="props">
          {{ props.row.thru }}
        </b-table-column>
      </b-table>
    </div>

    <!-- Mobile cards -->
    <div class="score-cards is-hidden-tablet">
      <div v-for="player in sortedScores" :key="`${player.id}-score`" class="score-card">
        <div class="score-card-header">
          <div class="player-info">
            <h5 class="score-player-name">{{ player.firstName }} {{ player.lastName }}</h5>
            <span class="score-position">{{ player.position }}</span>
          </div>
          <span class="score-badge">{{ player.total }}</span>
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
  },
  computed: {
    sortedScores() {
      if (!this.currentScore || !Array.isArray(this.currentScore)) return [];
      return [...this.currentScore].sort((a, b) => {
        if (!a.position || !b.position) return 0;
        const posA = parseInt(a.position);
        const posB = parseInt(b.position);
        return posA - posB;
      });
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
        const s = start
          ? new Date(start).toLocaleDateString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric" })
          : "";
        const e = end
          ? new Date(end).toLocaleDateString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: start && new Date(start).getFullYear() !== new Date(end).getFullYear() ? "numeric" : undefined })
          : "";
        return s && e ? `${s} - ${e}` : s || e;
      } catch (e) {
        return "";
      }
    },
  },
  methods: {
    async getSchedule() {
      try {
        const response = await axios.get("https://live-golf-data.p.rapidapi.com/schedule", {
          params: {
            orgId: "1",
            year: "2026",
          },
          headers: {
            "X-RapidAPI-Key": "6df9d41375msh7ea88695de29f7bp1ad8a6jsnf5f951f3046f",
            "X-RapidAPI-Host": "live-golf-data.p.rapidapi.com",
          },
        });

        const schedule = (response.data && response.data.schedule) || [];
        const today = new Date();

        const inProgress = schedule.find((s) => {
          if (!s.date) return false;
          const start = s.date.start ? new Date(s.date.start) : null;
          const end = s.date.end ? new Date(s.date.end) : null;
          if (!start || !end) return false;
          return today >= start && today <= end;
        });

        if (inProgress) {
          tournID = inProgress.tournId || tournID;
        } else {
          const upcoming = schedule
            .filter((s) => s.date && s.date.start && new Date(s.date.start) > today)
            .sort((a, b) => new Date(a.date.start) - new Date(b.date.start));

          if (upcoming.length) {
            tournID = upcoming[0].tournId || tournID;
          } else {
            const past = schedule
              .filter((s) => s.date && s.date.end && new Date(s.date.end) < today)
              .sort((a, b) => new Date(b.date.end) - new Date(a.date.end));
            if (past.length) {
              tournID = past[0].tournId || tournID;
            }
          }
        }

        this.selectedTournId = tournID;
        console.log("Selected tournID:", tournID);
        return tournID;
      } catch (error) {
        console.error("Error fetching schedule:", error);
        this.selectedTournId = tournID;
        return tournID;
      }
    },
    async getScore() {
      try {
        const response = await axios.get("https://live-golf-data.p.rapidapi.com/leaderboard", {
          params: {
            orgId: "1",
            tournId: tournID,
            year: "2026",
          },
          headers: {
            "X-RapidAPI-Key": "6df9d41375msh7ea88695de29f7bp1ad8a6jsnf5f951f3046f",
            "X-RapidAPI-Host": "live-golf-data.p.rapidapi.com",
          },
        });

        this.currentScore = response.data && response.data.leaderboardRows ? response.data.leaderboardRows : [];
        const lu = response.data && response.data.lastUpdated ? response.data.lastUpdated : new Date().toISOString();
        try {
          this.lastUpdated = new Date(lu).toLocaleString("en-US", { timeZone: "America/New_York" });
        } catch (e) {
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
          params: {
            orgId: "1",
            tournId: tournID,
            year: "2026",
          },
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
      this.refreshTimer = setInterval(() => {
        this.getScore();
      }, this.refreshIntervalMs);
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
      defaultSortDirection: "asc",
      sortIcon: "arrow-up",
      sortIconSize: "is-small",
      currentScore: [],
      tournament: {},
      columns: [
        { field: "player", label: "Player Name" },
        { field: "score", label: "Current Score" },
      ],
      selectedTournId: tournID,
      refreshIntervalMs: 30000,
      refreshTimer: null,
      lastUpdated: "",
    };
  },
  beforeUnmount() {
    this.stopAutoRefresh && this.stopAutoRefresh();
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.masters-leaderboard {
  width: 100%;
}

.leaderboard-header {
  text-align: center;
  padding: 1.5rem 1rem 2rem;
  border-bottom: 2px solid $masters-gold;
  margin-bottom: 1.5rem;
}

.mast-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  letter-spacing: 0.5px;
}

.tournament-date {
  margin: 0;
  color: #666;
  font-size: 1rem;
  letter-spacing: 0.3px;
}

.score-section-title {
  font-size: 1.25rem;
  margin: 1.5rem 0 1rem 0;
  color: $primary;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-family: $heading-font-stack;
}

/* Mobile score cards */
.score-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0;
}

.score-card {
  background: white;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border-left: 4px solid $masters-gold;
  border-top: 3px solid $primary;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
}

.score-card-header {
  background: linear-gradient(135deg, rgba($primary, 0.05) 0%, rgba($primary, 0.02) 100%);
  padding: 0.75rem 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba($masters-gold, 0.2);
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.score-player-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: $primary;
  letter-spacing: 0.3px;
}

.score-position {
  font-size: 0.8rem;
  color: #888;
  font-weight: 500;
}

.score-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border-radius: 0;
  background: $primary;
  color: $masters-gold;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.score-card-body {
  padding: 0.75rem 0.9rem;
  display: flex;
  gap: 1.5rem;
}

.score-detail {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 1rem;
  font-weight: 700;
  color: $primary;
  letter-spacing: 0.5px;
}

@media (min-width: 641px) {
  .score-cards {
    display: none;
  }
}

@media (max-width: 640px) {
  .table-responsive {
    display: none;
  }
}

@media (min-width: 641px) {
  .score-cards {
    display: none;
  }
}

@media (max-width: 640px) {
  .table-responsive {
    display: none;
  }
}
</style>
