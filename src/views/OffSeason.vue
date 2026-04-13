<template>
  <div class="offseason">
    <div class="offseason-card">
      <div class="logo-mark">⛳</div>
      <h1 class="headline">See You Next Year</h1>
      <p class="subhead">Masters Week 2027</p>
      <div class="divider" />
      <p class="body-text">
        Thanks for playing. Another year, another champion crowned.<br />
        We'll see you back on the course next April.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OffSeason',
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.offseason {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: $primary;
  padding: 2rem;
}

.offseason-card {
  text-align: center;
  max-width: 520px;
  width: 100%;
}

.logo-mark {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.headline {
  font-family: $heading-font-stack;
  font-size: 3rem;
  font-weight: 700;
  color: $masters-gold;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 0.5rem;

  @media (max-width: $bp-mobile) {
    font-size: 2.1rem;
  }
}

.subhead {
  font-family: $heading-font-stack;
  font-size: 1.35rem;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin: 0 0 2rem;
}

.divider {
  width: 60px;
  height: 2px;
  background: $masters-gold;
  margin: 0 auto 2rem;
  opacity: 0.6;
}

.body-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.8;
  margin: 0;
}
</style>
