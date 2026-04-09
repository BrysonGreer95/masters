<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="scramble_table">
    <div class="page-header">
      <h1>Scramble Teams</h1>
      <p class="page-subtitle">Saturday, April 11 &bull; 12 PM &bull; Reedy Creek Golf Course</p>
    </div>

    <div class="content-wrap">
      <!-- Rules -->
      <div class="rules-block">
        <div class="rules-header">
          <span class="rules-icon">&#9965;</span>
          <span class="rules-title">Tournament Rules</span>
        </div>
        <ul class="rules-list">
          <li>1 mulligan per 9 holes &mdash; may not carry over to the back 9</li>
          <li>Breakfast ball on hole 1 only &mdash; must be called before leaving the tee box</li>
          <li>No gimmie putts &mdash; all putts must be holed out</li>
          <li>Each player must contribute a minimum of 2 drives per 9 holes</li>
          <li>All players must hit before the best ball is selected</li>
          <li>Ball placed within 1 club length of selected shot, no closer to the hole, same area of course</li>
        </ul>
      </div>

      <!-- A/B Lists -->
      <div class="player-lists">
        <div class="list-section a-list">
          <h3 class="list-title">A List</h3>
          <div class="players-grid">
            <div v-for="player in aListPlayers" :key="player.id" class="player-badge">
              {{ player.user.first_name }} {{ player.user.last_name }}
            </div>
          </div>
        </div>
        <div class="list-section b-list">
          <h3 class="list-title">B List</h3>
          <div class="players-grid">
            <div v-for="player in bListPlayers" :key="player.id" class="player-badge">
              {{ player.user.first_name }} {{ player.user.last_name }}
            </div>
          </div>
        </div>
      </div>

      <p class="pairing-note">Each team pairs one A List player with one B List player.</p>

      <!-- Teams Table -->
      <div class="teams-table-wrap">
        <div class="table-responsive">
          <b-table striped :data="tableData" :columns="columns"></b-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import playerData from "../assets/data.json";

const TEE_TIMES = ['12:12 PM', '12:12 PM', '12:20 PM', '12:20 PM', '12:28 PM', '12:28 PM', '11:00 AM'];

export default {
  data() {
    return {
      columns: [
        { field: "team",     label: "Team",     numeric: true },
        { field: "member_1", label: "Member 1" },
        { field: "member_2", label: "Member 2", sortable: false },
        { field: "tee_time", label: "Tee Time" },
      ],
    };
  },
  computed: {
    aListPlayers() {
      return playerData.filter(p => p.list_designation === "A");
    },
    bListPlayers() {
      return playerData.filter(p => p.list_designation === "B");
    },
    tableData() {
      const teamMap = {};
      playerData.forEach(player => {
        if (player.team) {
          if (!teamMap[player.team]) teamMap[player.team] = [];
          teamMap[player.team].push(player);
        }
      });
      return Object.keys(teamMap)
        .sort((a, b) => a - b)
        .map(teamNum => ({
          team:     teamNum,
          member_1: `${teamMap[teamNum][0].user.first_name} ${teamMap[teamNum][0].user.last_name}`,
          member_2: `${teamMap[teamNum][1].user.first_name} ${teamMap[teamNum][1].user.last_name}`,
          tee_time: TEE_TIMES[teamNum - 1],
        }));
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

#scramble_table {
  width: 100%;
}

.content-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

// ─── Rules Block ──────────────────────────────────────────────────────────────
.rules-block {
  margin-bottom: 2rem;
  border: 1px solid rgba($masters-accent, 0.2);
  border-top: 3px solid $masters-accent;
  background: #f9faf9;
}

.rules-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.rules-icon {
  font-size: 0.9rem;
  opacity: 0.6;
}

.rules-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: $primary;
}

.rules-list {
  margin: 0;
  padding: 0.65rem 1rem 0.65rem 2rem;
  list-style: disc;

  li {
    font-size: 0.875rem;
    color: #555;
    line-height: 1.65;
    padding: 0.15rem 0;
  }
}

// ─── A/B Player Lists ─────────────────────────────────────────────────────────
.player-lists {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 0.75rem;

  @media (max-width: $bp-tablet) {
    grid-template-columns: 1fr;
  }
}

.list-section {
  padding: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
}

.a-list {
  border-top: 3px solid $masters-accent;
}

.b-list {
  border-top: 3px solid $primary;
}

.list-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #888;
  margin: 0 0 0.85rem;
  font-family: $body-font-stack;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.5rem;

  @media (max-width: $bp-mobile) {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  }
}

.player-badge {
  padding: 0.5rem 0.65rem;
  background: #f7f7f7;
  border: 1px solid rgba(0, 0, 0, 0.07);
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  color: $primary;
}

.pairing-note {
  font-size: 0.85rem;
  color: #888;
  text-align: center;
  margin: 0.5rem 0 2rem;
  font-style: italic;
}

// ─── Teams Table ──────────────────────────────────────────────────────────────
.teams-table-wrap {
  // Table is constrained by .content-wrap's max-width above
}
</style>
