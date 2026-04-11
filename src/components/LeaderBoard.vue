<template>
  <section class="leaderboard-container">
    <h3 class="leaderboard-heading">Overall Standings</h3>

    <!-- Desktop table -->
    <div class="table-responsive is-hidden-mobile">
      <b-table bordered id="table" :key="tableDataKey" :data="sortedByTotal"
        :default-sort-direction="defaultSortDirection" :sort-icon="sortIcon" :sort-icon-size="sortIconSize"
        default-sort="_rank" striped>
        <b-table-column field="_rank" numeric label="Pos" sortable v-slot="props">
          <span class="pos-num">{{ props.row._rank }}</span>
        </b-table-column>
        <b-table-column field="user.first_name" label="Player" sortable v-slot="props">
          {{ props.row.user.first_name }} {{ props.row.user.last_name }}
        </b-table-column>
        <b-table-column field="total" label="Total" sortable numeric v-slot="props">
          <span class="score-total">{{
            props.row.parTeeShack + props.row.scramble + props.row.fantasy
          }}</span>
        </b-table-column>
        <b-table-column field="parTeeShack" sortable numeric>
          <template #header><span :class="{ 'col--completed': completedEvents.parTeeShack }">ParTee
              Shack</span></template>
          <template #default="props"><span :class="{ 'score--completed': completedEvents.parTeeShack }">{{
            props.row.parTeeShack }}</span></template>
        </b-table-column>
        <b-table-column field="scramble" sortable numeric>
          <template #header><span :class="{ 'col--completed': completedEvents.scramble }">Scramble</span></template>
          <template #default="props"><span :class="{ 'score--completed': completedEvents.scramble }">{{
            props.row.scramble }}</span></template>
        </b-table-column>
        <b-table-column field="fantasy" sortable numeric>
          <template #header><span :class="{ 'col--completed': completedEvents.fantasy }">Fantasy</span></template>
          <template #default="props"><span
              :class="{ 'score--completed': completedEvents.fantasy, 'score--no-picks': !hasFantasyPicks(props.row) }">{{
                props.row.fantasy }}</span></template>
        </b-table-column>
      </b-table>
    </div>

    <!-- Mobile card view -->
    <div class="leaderboard-cards is-hidden-tablet">
      <div v-for="player in sortedByTotal" :key="`${player.id}-card`" class="player-card">
        <div class="card-header">
          <span class="position-badge">{{ player._rank }}</span>
          <span class="player-name">{{ player.user.first_name }} {{ player.user.last_name }}</span>
          <span class="card-total">{{ player.parTeeShack + player.scramble + player.fantasy }}</span>
        </div>
        <div class="card-body">
          <div class="score-row" :class="{ 'row--completed': completedEvents.parTeeShack }">
            <span class="score-label">ParTee Shack</span>
            <span class="score-value">{{ player.parTeeShack }}</span>
          </div>
          <div class="score-row" :class="{ 'row--completed': completedEvents.scramble }">
            <span class="score-label">Scramble</span>
            <span class="score-value">{{ player.scramble }}</span>
          </div>
          <div class="score-row" :class="{ 'row--completed': completedEvents.fantasy }">
            <span class="score-label">Fantasy</span>
            <span class="score-value" :class="{ 'score--no-picks': !hasFantasyPicks(player) }">{{ player.fantasy
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['sortedByTotal', 'completedEvents']),
  },
  methods: {
    hasFantasyPicks(player) {
      return player.fantasy_picks && player.fantasy_picks.some((pick) => pick.trim() !== '');
    },
  },
  data() {
    return {
      tableDataKey: 0,
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'is-small',
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.leaderboard-container {
  width: 100%;
  padding: 2rem 1.5rem;
}

.leaderboard-heading {
  font-size: 0.75rem;
  font-weight: 700;
  color: #aaa;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 1.25rem;
  font-family: $body-font-stack;
}

.pos-num {
  font-weight: 600;
  color: #999;
  font-size: 0.9rem;
}

// ─── Mobile Cards ─────────────────────────────────────────────────────────────
.leaderboard-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.player-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-left: 3px solid $masters-accent;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.card-header {
  background: #fafafa;
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.position-badge {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $primary;
  color: white;
  font-weight: 700;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.player-name {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 600;
  color: $primary;
}

.card-total {
  font-size: 1.1rem;
  font-weight: 700;
  color: $primary;
}

.card-body {
  padding: 0.75rem 1rem;
}

.score-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0;
  font-size: 0.9rem;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  }
}

.score-label {
  color: #777;
  font-weight: 500;
}

.score-value {
  font-weight: 600;
  color: #333;
}

.score--no-picks {
  color: #bbb;
}

.col--completed {
  color: #bbb;
}

:deep(.score--completed) {
  color: #bbb;
}

.row--completed {

  .score-label,
  .score-value {
    color: #bbb;
  }
}

// ─── Show/Hide ────────────────────────────────────────────────────────────────
@media (min-width: 641px) {
  .leaderboard-cards {
    display: none;
  }
}

@media (max-width: 640px) {
  .leaderboard-container {
    padding: 1.5rem 1rem;
  }

  :deep(.table-responsive) {
    display: none;
  }
}
</style>
