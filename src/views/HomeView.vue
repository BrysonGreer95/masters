<template>
  <div class="home">
    <img alt="Masters logo" src="../assets/masters.png" />
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
img {
  width: 8rem;
}

div {
  align-items: center;
  text-align: center;
}

#leaderboard {
  padding-top: 2rem;
  padding: 2rem;
}
</style>
