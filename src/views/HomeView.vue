<template>
  <div class="home">
    <div class="hero-section">
      <h1 class="hero-title">The 3rd Annual Masters Weekend Competition</h1>
      <p class="hero-subtitle">
        Experience excellence in competition across ParTee Shack, Scramble, and Fantasy picks
      </p>
    </div>
    
    <div class="leaderboard-section">
      <LeaderBoard id="leaderboard" />
    </div>
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
@import '../styles/_variables.scss';

.home {
  width: 100%;
}

.hero-section {
  text-align: center;
  padding: 3rem 1rem 2rem;
  border-bottom: 3px solid $masters-accent;
  margin-bottom: 2rem;
  background: linear-gradient(180deg, transparent 0%, rgba($masters-accent, 0.02) 100%);
}

.hero-title {
  font-size: 2.5rem;
  font-family: $heading-font-stack;
  color: $primary;
  margin: 0 0 1rem 0;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: #666;
  margin: 0;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  letter-spacing: 0.3px;
}

.leaderboard-section {
  width: 100%;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem 1.5rem;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 1.5rem 1rem;
  }

  .hero-title {
    font-size: 1.4rem;
  }

  .hero-subtitle {
    font-size: 0.95rem;
  }
}
</style>
