<template>
  <div class="home">
    <h2 class="title is-2">
      Welcome to the 2nd Annual Masters Weekend Competition
    </h2>
    <br />
    <h4 class="subtitle is-4">
      This year's competition takes place from Friday, April 11th to Sunday,
      April 13th
    </h4>
    <br />
    <div class="is-large">
      <h4 class="title is-4">This year's events consist of</h4>
      <ul>
        <li>Friday Night: Drive Shack</li>
        <li>Saturday Morning: 2 man Scramble Tournament</li>
        <li>All Weekend: Masters Fantasy App</li>
      </ul>
      <br />

      <h4 class="title is-4">Check the About page for more details</h4>
      <br />
      <hr />
    </div>
    <LeaderBoard id="leaderboard" />
  </div>
</template>

<script>
// @ is an alias to /src
import LeaderBoard from "@/components/LeaderBoard.vue";

export default {
  name: "HomeView",
  components: {
    LeaderBoard,
  },
};
</script>

<style lang="scss">
.home {
  padding: 1rem;
}
template {
  padding: 1rem;
}
img {
  width: 8rem;
}
ul {
  list-style-type: none;
}
li {
  list-style-type: none;
}
div {
  align-items: center;
  text-align: center;
}

#leaderboard {
  padding: 5px;
}
</style>
