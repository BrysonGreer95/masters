<template>
  <div class="home">
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
  padding: 5px;
}
</style>
