<!-- eslint-disable vue/no-unused-vars -->
<template>
  <div class="masters-leaderboard">
    <h3 class="title is-3 mast-title">{{ tournament.tournamentName || "Current Tournament" }}</h3>
    <h4 class="title is-4 mast-subtitle" v-if="tournament.tournamentName">April 9 - April 12, 2026</h4>

    <h4 class="title is-4">Current Score</h4>
    
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

const leaderboardOptions = {
  method: "GET",
  url: "https://live-golf-data.p.rapidapi.com/leaderboard",
  params: {
    orgId: "1",
    tournId: tournID,
    year: "2026",
  },
  headers: {
    "X-RapidAPI-Key": "6df9d41375msh7ea88695de29f7bp1ad8a6jsnf5f951f3046f",
    "X-RapidAPI-Host": "live-golf-data.p.rapidapi.com",
  },
};

const tournamentOptions = {
  method: "GET",
  url: "https://live-golf-data.p.rapidapi.com/tournament",
  params: {
    orgId: "1",
    tournId: tournID,
    year: "2026",
  },
  headers: {
    "x-rapidapi-key": "6df9d41375msh7ea88695de29f7bp1ad8a6jsnf5f951f3046f",
    "x-rapidapi-host": "live-golf-data.p.rapidapi.com",
  },
};

export default {
  async created() {
    await this.getDate().then(() => {
      this.getTournament().then(() => {
        this.getScore();
      });
    });
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
  },
  methods: {
    async getDate() {
      let date = new Date();
      console.log(date);
      if (date > new Date("2026-03-05") && date < new Date("2026-03-10")) {
        console.log("1 triggered");
        tournID = "010";
      } else {
        console.log("2 triggered");
        tournID = "009";
      }
    },
    async getScore() {
      axios
        .request(leaderboardOptions)
        .then((response) => (this.currentScore = response.data.leaderboardRows))
        .catch((error) => {
          console.error("Error fetching leaderboard:", error);
          this.currentScore = [];
        });
    },
    async getTournament() {
      axios
        .request(tournamentOptions)
        .then((response) => (this.tournament = response.data))
        .catch((error) => {
          console.error("Error fetching tournament:", error);
          this.tournament = {};
        });
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
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.masters-leaderboard {
  width: 100%;
}

/* Mobile score cards */
.score-cards {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
}

.score-card {
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.score-card-header {
  background: linear-gradient(135deg, rgba(23, 64, 56, 0.08) 0%, rgba(23, 64, 56, 0.03) 100%);
  padding: 0.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(23, 64, 56, 0.06);
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
}

.score-player-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: $primary;
}

.score-position {
  font-size: 0.8rem;
  color: #888;
}

.score-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 35px;
  height: 35px;
  border-radius: 50%;
  background: $primary;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
}

.score-card-body {
  padding: 0.5rem 0.6rem;
  display: flex;
  gap: 1rem;
}

.score-detail {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: $primary;
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
