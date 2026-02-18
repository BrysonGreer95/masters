<template>
  <h3 class="title is-3 mast-title">Players Leaderboard</h3>

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
  gap: 1rem;
  padding: 0;
}

.player-card {
  background: white;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border-left: 4px solid $masters-gold;
  border-top: 4px solid $masters-accent;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
    border-left: 4px solid $masters-accent;
  }
}

.card-header {
  background: linear-gradient(135deg, rgba($primary, 0.05) 0%, rgba($masters-accent, 0.04) 100%);
  padding: 1rem 0.9rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba($masters-accent, 0.2);
}

.position-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  border-radius: 0;
  background: linear-gradient(135deg, $primary, $masters-accent);
  color: $masters-gold;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
  box-shadow: 0 2px 4px rgba($primary, 0.15);
}

.player-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: $primary;
  flex: 1;
  letter-spacing: 0.3px;
}

.card-body {
  padding: 1rem 0.9rem;
}

.score-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  font-size: 0.95rem;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
}

.score-label {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

.score-value {
  font-weight: 700;
  color: $primary;
  letter-spacing: 0.5px;
  
  &.total {
    font-size: 1.25rem;
    background: linear-gradient(135deg, rgba($masters-accent, 0.1), rgba($masters-gold, 0.08));
    padding: 0.35rem 0.75rem;
    border-radius: 0;
    border-left: 3px solid $masters-accent;
    border-right: 3px solid $masters-accent;
    color: $primary;
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
