<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="masters_table">
    <div class="page-header">
      <h1>Tournament Winner Predictions</h1>
      <p class="page-subtitle">2026 Masters Champion: <span class="highlight">TBD</span></p>
    </div>

    <div class="league-bar">
      <a
        href="https://www.masters.com/en_US/fantasy?leagueJoinToken=09a845f0e8&leagueId=13604"
        target="_blank"
        rel="noopener noreferrer"
        class="league-link"
      >Join the Fantasy League &rarr;</a>
    </div>

    <div class="table-wrap">
      <div class="table-responsive masters-table-vertical-lines">
        <b-table striped bordered :data="tableData" :columns="columns"></b-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      columns: [
        { field: "id",            label: "#",            numeric: true, sortable: true },
        { field: "player",        label: "Player",       sortable: true },
        { field: "past_champ",    label: "Past Champ" },
        { field: "us",            label: "United States" },
        { field: "international", label: "International" },
        { field: "first_timer",   label: "First Timer" },
        { field: "wild_card",     label: "Wild Card" },
        { field: "total_putts",   label: "Total Putts",  numeric: true, sortable: true },
      ],
    };
  },
  computed: {
    ...mapGetters(['players']),
    tableData() {
      return this.players.map((player) => ({
        id:            player.id,
        player:        `${player.user.first_name} ${player.user.last_name}`,
        past_champ:    player.fantasy_picks?.[0] || "",
        us:            player.fantasy_picks?.[1] || "",
        international: player.fantasy_picks?.[2] || "",
        first_timer:   player.fantasy_picks?.[3] || "",
        wild_card:     player.fantasy_picks?.[4] || "",
        total_putts:   player.total_putts ?? "",
      }));
    },
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

// Bold the Player column (first td in each row)
.masters-table-vertical-lines tbody td:first-child {
  font-weight: 700;
  color: $primary;
}

.highlight {
  color: $masters-gold;
  font-weight: 700;
}
</style>
