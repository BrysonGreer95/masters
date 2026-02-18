<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="final-prize">
    <div class="prize-header">
      <h1 class="prize-title">This Year's Prize</h1>
      <p class="prize-description">Championship Glory Awaits</p>
    </div>
    
    <div class="prize-container">
      <p class="prize-text">Coming Soon</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "FinalPrize",
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.final-prize {
  width: 100%;
}

.prize-header {
  text-align: center;
  padding: 2rem 1rem 2.5rem;
  border-bottom: 2px solid $masters-gold;
  margin-bottom: 2rem;
}

.prize-title {
  font-size: 2rem;
  margin: 0 0 0.75rem 0;
  letter-spacing: 0.5px;
  font-weight: 700;
  color: $primary;
  font-family: $heading-font-stack;
}

.prize-description {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  letter-spacing: 0.3px;
}

.prize-container {
  text-align: center;
  padding: 3rem 1.5rem;
  background: linear-gradient(135deg, rgba($masters-gold, 0.05) 0%, rgba($primary, 0.03) 100%);
  border: 2px solid $masters-gold;
  border-radius: 0;
}

.prize-text {
  font-size: 1.8rem;
  font-weight: 700;
  color: $masters-gold;
  margin: 0;
  letter-spacing: 1px;
  font-family: $heading-font-stack;
}

@media (max-width: 768px) {
  .prize-header {
    padding: 1.5rem 1rem 2rem;
  }

  .prize-title {
    font-size: 1.5rem;
  }

  .prize-description {
    font-size: 1rem;
  }

  .prize-container {
    padding: 2rem 1rem;
  }

  .prize-text {
    font-size: 1.4rem;
  }
}
</style>
