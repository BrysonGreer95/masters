<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="masters_table">
    <div class="masters-header">
      <h1 class="masters-title">Tournament Winner Predictions</h1>
      <p class="masters-subtitle">2026 Masters Champion: <span class="highlight">TBD</span></p>
    </div>

    <div class="table-responsive masters-table-vertical-lines">
      <b-table striped bordered :data="tableData" :columns="columns"></b-table>
    </div>
  </div>
</template>

<script>
const playerData = require("../assets/data.json");

export default {
  data() {
    return {
      columns: [
        { field: "player", label: "Player" },
        { field: "past_champ", label: "Past Champ" },
        { field: "us", label: "United States" },
        { field: "international", label: "International" },
        { field: "first_timer", label: "First Timer" },
        { field: "wild_card", label: "Wild Card" },
        { field: "total_putts", label: "Total Putts", numeric: true },
      ],
    };
  },
  computed: {
    tableData() {
      return playerData.map((player) => ({
        player: `${player.user.first_name} ${player.user.last_name}`,
        past_champ: player.fantasy_picks?.[0] || "",
        us: player.fantasy_picks?.[1] || "",
        international: player.fantasy_picks?.[2] || "",
        first_timer: player.fantasy_picks?.[3] || "",
        wild_card: player.fantasy_picks?.[4] || "",
        total_putts: player.total_putts ?? "",
      }));
    },
  },
};
</script>

<style lang="scss">
@import '../styles/_variables.scss';

/* Add vertical lines between table columns */
.masters-table-vertical-lines {
  width: 100%;
  overflow-x: auto;
}

.masters-table-vertical-lines ::v-deep table {
  width: 100%;
  border-collapse: collapse;
}

.masters-table-vertical-lines ::v-deep th,
.masters-table-vertical-lines ::v-deep td {
  border-right: 1px solid #dbdbdb;
  padding: 0.75em 0.5em !important;
}

.masters-table-vertical-lines ::v-deep th:last-child,
.masters-table-vertical-lines ::v-deep td:last-child {
  border-right: none;
}

.masters-table-vertical-lines ::v-deep thead th {
  border-bottom: 2px solid #dbdbdb;
}

.masters-header {
  text-align: center;
  padding: 2rem 1rem 2.5rem;
  border-bottom: 3px solid $masters-accent;
  margin-bottom: 2rem;
  background: linear-gradient(180deg, transparent 0%, rgba($masters-accent, 0.02) 100%);
}

.masters-title {
  font-size: 2rem;
  margin: 0 0 0.75rem 0;
  letter-spacing: 0.5px;
  font-weight: 700;
  color: $primary;
  font-family: $heading-font-stack;
}

.masters-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  letter-spacing: 0.3px;
}

.highlight {
  color: $masters-gold;
  font-weight: 700;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .masters-header {
    padding: 1.5rem 1rem 2rem;
  }

  .masters-title {
    font-size: 1.5rem;
  }

  .masters-subtitle {
    font-size: 1rem;
  }
}
</style>
