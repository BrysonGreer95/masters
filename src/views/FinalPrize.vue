<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <h3 class="title is-3">This Year's Prize:</h3>
  <div class="prize-container">
    <p class="prize-text">Coming Soon</p>
  </div>
</template>

<script>
export default {
  name: "FinalPrize",
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.prize-container {
  text-align: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, rgba($primary, 0.05) 0%, rgba($primary, 0.02) 100%);
  border-radius: 8px;
  border: 2px dashed rgba($primary, 0.2);
}

.prize-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: $primary;
  margin: 0;
}
</style>
