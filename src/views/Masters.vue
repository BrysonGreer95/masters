<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="masters_table">
    <h3 class="title is-3">Masters 2025 Winner: TBD</h3>
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
          id: playerData[0].id,
          player:
            playerData[0].user.first_name + " " + playerData[0].user.last_name,
          masters_winner: playerData[0].choice_to_win_masters,
        },
        {
          id: playerData[1].id,
          player:
            playerData[1].user.first_name + " " + playerData[1].user.last_name,
          masters_winner: playerData[1].choice_to_win_masters,
        },
        {
          id: playerData[2].id,
          player:
            playerData[2].user.first_name + " " + playerData[2].user.last_name,
          masters_winner: playerData[2].choice_to_win_masters,
        },
        {
          id: playerData[3].id,
          player:
            playerData[3].user.first_name + " " + playerData[3].user.last_name,
          masters_winner: playerData[3].choice_to_win_masters,
        },
        {
          id: playerData[4].id,
          player:
            playerData[4].user.first_name + " " + playerData[4].user.last_name,
          masters_winner: playerData[4].choice_to_win_masters,
        },
        {
          id: playerData[5].id,
          player:
            playerData[5].user.first_name + " " + playerData[5].user.last_name,
          masters_winner: playerData[5].choice_to_win_masters,
        },
        {
          id: playerData[6].id,
          player:
            playerData[6].user.first_name + " " + playerData[6].user.last_name,
          masters_winner: playerData[6].choice_to_win_masters,
        },
        {
          id: playerData[7].id,
          player:
            playerData[7].user.first_name + " " + playerData[7].user.last_name,
          masters_winner: playerData[7].choice_to_win_masters,
        },
        {
          id: playerData[8].id,
          player:
            playerData[8].user.first_name + " " + playerData[8].user.last_name,
          masters_winner: playerData[8].choice_to_win_masters,
        },
        {
          id: playerData[9].id,
          player:
            playerData[9].user.first_name + " " + playerData[9].user.last_name,
          masters_winner: playerData[9].choice_to_win_masters,
        },
        {
          id: playerData[10].id,
          player:
            playerData[10].user.first_name +
            " " +
            playerData[10].user.last_name,
          masters_winner: playerData[10].choice_to_win_masters,
        },
        {
          id: playerData[11].id,
          player:
            playerData[11].user.first_name +
            " " +
            playerData[11].user.last_name,
          masters_winner: playerData[11].choice_to_win_masters,
        },
      ],
      columns: [
        {
          field: "id",
          label: "Player ID",
        },
        {
          field: "player",
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
