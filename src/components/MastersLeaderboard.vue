<!-- eslint-disable vue/no-unused-vars -->
<template>
  <h3 class="title is-3">Current Tournament:</h3>
  <h4 class="title is-4">{{ tournament.name }}</h4>

  <h4 class="title is-4">Current Score</h4>
  <section>
    <b-table striped :data="currentScore">
      <b-table-column field="playerName" label="Player Name" v-slot="props">
        {{ props.row.firstName + " " + props.row.lastName }}
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
let tournID = "012";
import axios from "axios";

const leaderboardOptions = {
  method: "GET",
  url: "https://live-golf-data.p.rapidapi.com/leaderboard",
  params: {
    orgId: "1",
    tournId: tournID,
    year: "2025",
  },
  headers: {
    "X-RapidAPI-Key": "6df9d41375msh7ea88695de29f7bp1ad8a6jsnf5f951f3046f",
    "X-RapidAPI-Host": "live-golf-data.p.rapidapi.com",
  },
};

const tournamentOptions = {
  method: "GET",
  url: "https://live-golf-data.p.rapidapi.com/tournament",
  params: {
    orgId: "1",
    tournId: tournID,
    year: "2025",
  },
  headers: {
    "x-rapidapi-key": "6df9d41375msh7ea88695de29f7bp1ad8a6jsnf5f951f3046f",
    "x-rapidapi-host": "live-golf-data.p.rapidapi.com",
  },
};

export default {
  async created() {
    await this.getDate().then(() => {
      this.getTournament().then(() => {
        this.getScore();
      });
    });
  },
  methods: {
    async getDate() {
      let date = new Date();
      console.log(date);
      if (date > new Date("2025-03-05") && date < new Date("2025-03-10")) {
        console.log("1 triggered");
        tournID = "010";
      } else {
        console.log("2 triggered");
        tournID = "009";
      }
    },
    async getScore() {
      axios
        .request(leaderboardOptions)
        .then((response) => (this.currentScore = response.data.leaderboardRows))
        .catch((error) => (this.currentScore = error.data));
    },
    async getTournament() {
      axios
        .request(tournamentOptions)
        .then((response) => (this.tournament = response.data))
        .catch((error) => (this.tournament = error.data));
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
      tournament: [],
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
