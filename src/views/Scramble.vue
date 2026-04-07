<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="scramble_table">
    <div class="scramble-header">
      <h1 class="scramble-title">Scramble Teams</h1>
    </div>

    <div class="rules-block">
      <h4 class="rules">Rules</h4>
      <ul>
        <li>- 1 Mulligan per 9 (can't save your front mulligan for two on the back 9)</li>
        <li>- Breakfast ball is allowed</li>

      </ul>
    </div>

    <div class="player-lists">
      <div class="list-section a-list">
        <h2 class="list-title">A List Players</h2>
        <div class="players-grid">
          <div v-for="player in aListPlayers" :key="player.id" class="player-badge">
            {{ player.user.first_name }} {{ player.user.last_name }}
          </div>
        </div>
      </div>

      <div class="list-section b-list">
        <h2 class="list-title">B List Players</h2>
        <div class="players-grid">
          <div v-for="player in bListPlayers" :key="player.id" class="player-badge">
            {{ player.user.first_name }} {{ player.user.last_name }}
          </div>
        </div>
      </div>
    </div>

    <div class="pairing-note">
      <p>Each team pairs one A List player with one B List player</p>
    </div>

    <div class="table-responsive">
      <b-table striped :data="tableData" :columns="columns"></b-table>
    </div>
  </div>
</template>

<script>
const playerData = require("../assets/data.json");

const TEE_TIMES = ['12:12 PM', '12:12 PM', '12:20 PM', '12:20 PM', '12:28 PM', '12:28 PM', '12:36 PM', '12:36 PM'];

export default {
  data() {
    return {
      columns: [
        {
          field: "team",
          label: "Team",
          numeric: true,
        },
        {
          field: "member_1",
          label: "Member 1",
        },
        {
          field: "member_2",
          label: "Member 2",
          sortable: false,
        },
        {
          field: "tee_time",
          label: "Tee Time",
        },
      ],
    };
  },
  computed: {
    aListPlayers() {
      return playerData.filter(player => player.list_designation === "A");
    },
    bListPlayers() {
      return playerData.filter(player => player.list_designation === "B");
    },
    tableData() {
      // Group players by team
      const teamMap = {};
      playerData.forEach(player => {
        if (player.team) {
          if (!teamMap[player.team]) {
            teamMap[player.team] = [];
          }
          teamMap[player.team].push(player);
        }
      });

      // Build table data from grouped teams
      return Object.keys(teamMap)
        .sort((a, b) => a - b)
        .map(teamNum => {
          const members = teamMap[teamNum];
          const teeTime = TEE_TIMES[teamNum - 1];
          return {
            team: teamNum,
            member_1: `${members[0].user.first_name} ${members[0].user.last_name}`,
            member_2: `${members[1].user.first_name} ${members[1].user.last_name}`,
            tee_time: teeTime,
          };
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

#scramble_table {
  width: 100%;
}

.scramble-header {
  text-align: center;
  padding: 2rem 1rem 2.5rem;
  border-bottom: 3px solid $masters-accent;
  margin-bottom: 2rem;
  background: linear-gradient(180deg, transparent 0%, rgba($masters-accent, 0.02) 100%);
}

.rules {
  margin: 0 0 0.75rem 0;
  letter-spacing: 0.5px;
  font-weight: 700;
  color: $primary;
  font-family: $heading-font-stack;
  text-decoration: underline;

}

.rules-block {
  text-align: center;
  font-size: 1.5rem;
}

.scramble-title {
  font-size: 2rem;
  margin: 0 0 0.75rem 0;
  letter-spacing: 0.5px;
  font-weight: 700;
  color: $primary;
  font-family: $heading-font-stack;
}

.scramble-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  letter-spacing: 0.3px;
}

.player-lists {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin: 1.5rem 1rem;
  }
}

.list-section {
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid $masters-accent;
}

.a-list {
  background-color: rgba($masters-accent, 0.08);
}

.b-list {
  background-color: rgba($primary, 0.05);
  border-color: $primary;
}

.list-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: $primary;
  margin: 0 0 1rem 0;
  font-family: $heading-font-stack;
  letter-spacing: 0.3px;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}

.player-badge {
  padding: 0.75rem;
  background-color: white;
  border: 1px solid $masters-accent;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  color: $primary;
}

.pairing-note {
  text-align: center;
  padding: 1rem;
  margin: 0 1rem 2rem 1rem;
  background-color: rgba($masters-accent, 0.1);
  border-left: 4px solid $masters-accent;
  border-radius: 4px;
  font-size: 1rem;
  color: #555;
  font-weight: 500;
}

.pairing-note p {
  margin: 0;
}

.table-responsive {
  margin: 0 1rem;
}

@media (max-width: 768px) {
  .scramble-header {
    padding: 1.5rem 1rem 2rem;
  }

  .scramble-title {
    font-size: 1.5rem;
  }

  .scramble-subtitle {
    font-size: 1rem;
  }
}
</style>
