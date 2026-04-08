<template>
  <div class="prize">
    <div class="page-header">
      <h1>This Year's Prize</h1>
      <p class="page-subtitle">Awarded to the Masters Weekend 2026 Overall Champion</p>
    </div>
    <div class="prize-body">
      <h2 class="prize-name">Scotty Cameron Select Newport 2</h2>
      <div class="prize-image-wrap">
        <img :src="require('@/assets/scotty.jpg')" alt="Scotty Cameron Select Newport 2" class="prize-image" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinalPrize',
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.prize {
  width: 100%;
}

.prize-body {
  max-width: 640px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
  text-align: center;
}

.prize-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: $primary;
  font-family: $heading-font-stack;
  margin: 0 0 0.75rem;
  letter-spacing: 0.5px;
}

.prize-desc {
  font-size: 1rem;
  color: #666;
  line-height: 1.7;
  margin: 0 0 2.5rem;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.prize-image-wrap {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: white;
  padding: 1.5rem;
}

.prize-image {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

@media (max-width: $bp-mobile) {
  .prize-body {
    padding: 2rem 1rem 3rem;
  }

  .prize-name {
    font-size: 1.4rem;
  }
}
</style>
