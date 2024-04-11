<!-- eslint-disable vue/no-unused-vars -->
<template>
  <h3 class="title is-3">Current Score</h3>
  <section>
    <b-table :data="currentScore">
      <b-table-column field="playerName" label="Player Name" v-slot="props">
        {{ props.row.lastName }}
      </b-table-column>
      <b-table-column field="position" label="Position" v-slot="props">
        {{ props.row.position }}
      </b-table-column>
      <b-table-column field="total_score" label="Total Score" v-slot="props">
        {{ props.row.total }}
      </b-table-column>
      <b-table-column
        field="current_round_score"
        label="Current Round Score"
        v-slot="props"
      >
        {{ props.row.currentRoundScore }}
      </b-table-column>
      <b-table-column field="thru" label="Through" v-slot="props">
        {{ props.row.thru }}
      </b-table-column>
    </b-table>
  </section>
</template>

<script>
import axios from "axios";

const options = {
  method: "GET",
  url: "https://live-golf-data.p.rapidapi.com/leaderboard",
  params: {
    orgId: "1",
    tournId: "014",
    year: "2024",
  },
  headers: {
    "X-RapidAPI-Key": "6df9d41375msh7ea88695de29f7bp1ad8a6jsnf5f951f3046f",
    "X-RapidAPI-Host": "live-golf-data.p.rapidapi.com",
  },
};

export default {
  created() {
    this.getScore();
  },
  methods: {
    getScore() {
      axios
        .request(options)
        .then((response) => (this.currentScore = response.data.leaderboardRows))
        .catch((error) => (this.currentScore = error.data));
    },
  },
  data() {
    return {
      tableDataKey: 0,
      defaultSortDirection: "asc",
      sortIcon: "arrow-up",
      sortIconSize: "is-small",
      hasInput: false,
      currentScore: [],
      columns: [
        {
          field: "player",
          label: "Player Name",
        },
        {
          field: "score",
          label: "Current Score",
        },
      ],
    };
  },
};
</script>
