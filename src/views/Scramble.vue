<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="scramble_table">
    <div class="scramble-header">
      <h1 class="scramble-title">Scramble Teams</h1>
      <p class="scramble-subtitle">Two-player teams competing for glory</p>
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
    tableData() {
      const teams = [];
      const teeTimes = ["10:04 AM", "10:04 AM", "10:08 AM", "10:08 AM", "10:12 AM", "10:12 AM", "10:16 AM", "10:16 AM", "10:20 AM", "10:20 AM"];
      
      for (let i = 0; i < playerData.length; i += 2) {
        const teamNum = Math.floor(i / 2) + 1;
        const member1 = playerData[i];
        const member2 = playerData[i + 1];
        
        teams.push({
          team: teamNum,
          member_1: `${member1.user.first_name} ${member1.user.last_name}`,
          member_2: member2 ? `${member2.user.first_name} ${member2.user.last_name}` : "TBD",
          tee_time: teeTimes[teamNum - 1] || "TBD",
        });
      }
      
      return teams;
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
