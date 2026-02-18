<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="masters_table">
    <div class="masters-header">
      <h1 class="masters-title">Tournament Winner Predictions</h1>
      <p class="masters-subtitle">2026 Masters Champion: <span class="highlight">TBD</span></p>
    </div>

    <div class="table-responsive">
      <b-table striped :data="tableData" :columns="columns"></b-table>
    </div>
  </div>
</template>

<script>
const playerData = require("../assets/data.json");

export default {
  data() {
    return {
      columns: [
        {
          field: "player",
          label: "Player",
        },
        {
          field: "masters_winner",
          label: "Golfer",
        },
      ],
    };
  },
  computed: {
    tableData() {
      return playerData.map((player) => ({
        player: `${player.user.first_name} ${player.user.last_name}`,
        masters_winner: player.choice_to_win_masters,
      }));
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

#masters_table {
  width: 100%;
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

