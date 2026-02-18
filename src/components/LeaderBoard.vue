<template>
  <h3 class="title is-3 mast-title">Leaderboard</h3>

  <section class="leaderboard-container">
    <!-- Desktop table view -->
    <div class="table-responsive is-hidden-mobile">
      <b-table
        id="table"
        :key="tableDataKey"
        :data="sortedData"
        :default-sort-direction="defaultSortDirection"
        :sort-icon="sortIcon"
        :sort-icon-size="sortIconSize"
        default-sort="total"
        striped
        :page-input="hasInput"
        :page-input-position="inputPosition"
        :debounce-page-input="inputDebounce"
      >
        <b-table-column
          :default-sort-direction="asc"
          field="id"
          numeric
          label="Pos"
          sortable
          v-slot="props"
        >
          {{ data.indexOf(props.row) + 1 }}
        </b-table-column>
        <b-table-column
          :default-sort-direction="asc"
          field="user.first_name"
          label="Player"
          sortable
          v-slot="props"
        >
          {{ props.row.user.first_name }} {{ props.row.user.last_name }}
        </b-table-column>

        <b-table-column
          :default-sort-direction="desc"
          field="total"
          label="Total"
          sortable
          numeric
          v-slot="props"
        >
          <span class="points-badge">{{
            (props.row.total =
              props.row.parTeeShack +
              props.row.scramble +
              props.row.fantasy)
          }}</span>
        </b-table-column>

        <b-table-column
          :default-sort-direction="desc"
          field="simulator"
          label="ParTee Shack"
          sortable
          numeric
          v-slot="props"
        >
          {{ props.row.parTeeShack }}
        </b-table-column>

        <b-table-column
          field="scramble"
          label="Scramble"
          sortable
          numeric
          v-slot="props"
        >
          {{ props.row.scramble }}
        </b-table-column>

        <b-table-column
          field="fantasy"
          label="Fantasy"
          sortable
          numeric
          v-slot="props"
        >
          {{ props.row.fantasy }}
        </b-table-column>
      </b-table>
    </div>

    <!-- Mobile card view -->
    <div class="leaderboard-cards is-hidden-tablet">
      <div
        v-for="(player, idx) in sortedData"
        :key="`${player.id}-card`"
        class="player-card"
      >
        <div class="card-header">
          <span class="position-badge">{{ idx + 1 }}</span>
          <h4 class="player-name">{{ player.user.first_name }} {{ player.user.last_name }}</h4>
        </div>
        <div class="card-body">
          <div class="score-row">
            <span class="score-label">Total</span>
            <span class="score-value total">{{
              (player.total = player.parTeeShack + player.scramble + player.fantasy)
            }}</span>
          </div>
          <div class="score-row">
            <span class="score-label">ParTee Shack</span>
            <span class="score-value">{{ player.parTeeShack }}</span>
          </div>
          <div class="score-row">
            <span class="score-label">Scramble</span>
            <span class="score-value">{{ player.scramble }}</span>
          </div>
          <div class="score-row">
            <span class="score-label">Fantasy</span>
            <span class="score-value">{{ player.fantasy }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const data = require("../assets/data.json");

export default {
  computed: {
    sortedData() {
      return [...this.data].sort((a, b) => {
        const totalA = a.parTeeShack + a.scramble + a.fantasy;
        const totalB = b.parTeeShack + b.scramble + b.fantasy;
        return totalB - totalA;
      });
    },
  },
  data() {
    return {
      tableDataKey: 0,
      data,
      defaultSortDirection: "desc",
      sortIcon: "arrow-up",
      sortIconSize: "is-small",
      hasInput: false,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.leaderboard-container {
  width: 100%;
}

/* Mobile cards */
.leaderboard-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.5rem;
}

.player-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border-left: 4px solid $primary;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}

.card-header {
  background: linear-gradient(135deg, rgba(23, 64, 56, 0.06) 0%, rgba(23, 64, 56, 0.02) 100%);
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(23, 64, 56, 0.08);
}

.position-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  border-radius: 50%;
  background: $primary;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
}

.player-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: $primary;
  flex: 1;
}

.card-body {
  padding: 0.75rem;
}

.score-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0;
  font-size: 0.9rem;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
}

.score-label {
  font-weight: 500;
  color: #666;
}

.score-value {
  font-weight: 600;
  color: $primary;
  
  &.total {
    font-size: 1.1rem;
    background: rgba($primary, 0.08);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }
}

/* Desktop table stays as is, but with minor tweaks */
@media (min-width: 641px) {
  .leaderboard-cards {
    display: none;
  }
}

@media (max-width: 640px) {
  .table-responsive {
    display: none;
  }
}
</style>
