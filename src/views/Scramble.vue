<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <h3 class="title is-3">Scramble Teams</h3>

  <div id="scramble_table">
    <b-table striped :data="data" :columns="columns"></b-table>
  </div>
</template>

<script>
const playerData = require("../assets/data.json");

export default {
  data() {
    return {
      data: [
        {
          team: 1,
          name: "PLACEHOLDER",
          member_1:
            playerData[8].user.first_name + " " + playerData[8].user.last_name,
          member_2:
            playerData[11].user.first_name +
            " " +
            playerData[11].user.last_name,
          tee_time: "9:00",
        },
        {
          team: 2,
          name: "PLACEHOLDER",
          member_1:
            playerData[1].user.first_name + " " + playerData[1].user.last_name,
          member_2:
            playerData[9].user.first_name + " " + playerData[9].user.last_name,
          tee_time: "9:00",
        },
        {
          team: 3,
          name: "PLACEHOLDER",
          member_1:
            playerData[6].user.first_name + " " + playerData[6].user.last_name,
          member_2:
            playerData[7].user.first_name + " " + playerData[7].user.last_name,
          tee_time: "9:08",
        },
        {
          team: 4,
          name: "PLACEHOLDER",
          member_1:
            playerData[0].user.first_name + " " + playerData[0].user.last_name,
          member_2:
            playerData[4].user.first_name + " " + playerData[4].user.last_name,
          tee_time: "9:08",
        },
        {
          team: 5,
          name: "PLACEHOLDER",
          member_1:
            playerData[3].user.first_name + " " + playerData[3].user.last_name,
          member_2:
            playerData[5].user.first_name + " " + playerData[5].user.last_name,
          tee_time: "9:16",
        },
        {
          team: 6,
          name: "PLACEHOLDER",
          member_1:
            playerData[2].user.first_name + " " + playerData[2].user.last_name,
          member_2:
            playerData[10].user.first_name +
            " " +
            playerData[10].user.last_name,
          tee_time: "9:16",
        }
      ],
      columns: [
        {
          field: "team",
          label: "Team",
          numeric: true
        },
        {
          field: "name",
          label: "Team Name"
        },
        {
          field: "member_1",
          label: "Member 1",
        },
        {
          field: "member_2",
          label: "Member 2",
        },
        {
          field: "tee_time",
          label: "Tee Time",
        },
      ],
    };
  },
};
</script>

<style lang="scss">
#scramble_table {
  padding: 5px;
}
table.text-center * {
  text-align: center;
}

.b-table th {
  text-align: center;
}

.b-table .table th .th-wrap {
  display: block;
}
</style>
