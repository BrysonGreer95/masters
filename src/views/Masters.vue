<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="masters_table">
    <h3 class="title is-3">Masters 2025 Winner:</h3>
    <p class="subtitle is-4"></p>

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
          member_1:
            playerData[0].user.first_name + " " + playerData[0].user.last_name,
          masters_winner: playerData[0].choice_to_win_masters,
        },
        {
          member_1:
            playerData[1].user.first_name + " " + playerData[1].user.last_name,
          masters_winner: playerData[1].choice_to_win_masters,
        },
        {
          member_1:
            playerData[2].user.first_name + " " + playerData[2].user.last_name,
          masters_winner: playerData[2].choice_to_win_masters,
        },
        {
          member_1:
            playerData[3].user.first_name + " " + playerData[3].user.last_name,
          masters_winner: playerData[3].choice_to_win_masters,
        },
        {
          member_1:
            playerData[4].user.first_name + " " + playerData[4].user.last_name,
          masters_winner: playerData[4].choice_to_win_masters,
        },
        {
          member_1:
            playerData[5].user.first_name + " " + playerData[5].user.last_name,
          masters_winner: playerData[5].choice_to_win_masters,
        },
        {
          member_1:
            playerData[6].user.first_name + " " + playerData[6].user.last_name,
          masters_winner: playerData[6].choice_to_win_masters,
        },
        {
          member_1:
            playerData[7].user.first_name + " " + playerData[7].user.last_name,
          masters_winner: playerData[7].choice_to_win_masters,
        },
      ],
      columns: [
        {
          field: "member_1",
          label: "Player",
        },
        {
          field: "masters_winner",
          label: "Masters Winner",
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
