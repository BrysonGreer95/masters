<template>
  <div class="home">
    <h2 class="title is-2">
      Welcome to the 3rd Annual Masters Weekend Competition
    </h2>
    <br />
    <h4 class="subtitle is-4">
      More details, coming soon
    </h4>
    <br />
    <LeaderBoard id="leaderboard" />
    <!-- <div class="is-large">
      <h4 class="title is-4">Events:</h4>
      <ul>
        <li>Friday Night: Sully's Golf and Gather</li>
        <li>Saturday Morning: 2 man Scramble Tournament</li>
        <li>All Weekend: Masters Fantasy App</li>
      </ul>
      <br />

      <h4 class="title is-4">Check the About page for more details</h4>
      <br />
      <hr />
    </div> -->
    <!-- <LeaderBoard id="leaderboard" /> -->
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

<style lang="scss" scoped>
.home { padding: 1rem; text-align: center; }
.home img { width: 8rem; }
</style>
