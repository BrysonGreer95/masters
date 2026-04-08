<template>
  <div class="home">
    <div class="page-header">
      <h1>The 3rd Annual Masters Weekend Competition</h1>
      <p class="page-subtitle">
        Experience excellence in competition across ParTee Shack, Scramble, and Fantasy picks
      </p>
    </div>
    <div class="leaderboard-section">
      <LeaderBoard id="leaderboard" />
    </div>
  </div>
</template>

<script>
import LeaderBoard from "@/components/LeaderBoard.vue";

export default {
  name: "HomeView",
  components: { LeaderBoard },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
}

.leaderboard-section {
  padding: 0 1.5rem 2rem;
}
</style>
