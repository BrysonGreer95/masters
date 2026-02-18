<template>
  <div id="app" class="app-wrapper">
    <!-- Navigation Header -->
    <nav class="app-nav">
      <div class="nav-brand">
        <h2 class="nav-title">Masters 2026</h2>
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/masters" class="nav-link">Masters Pick</router-link>
        <router-link to="/scramble" class="nav-link">Scramble</router-link>
        <router-link to="/masters-score" class="nav-link">Live Score</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="app-container">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p>&copy; 2026 Masters Competition. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";

// eslint-disable-next-line no-unused-vars
const counter = ref(0);
</script>

<script>
export default {
  data() {
    return {
      isImageModalActive: false,
    };
  },
};
</script>

<style lang="scss" scoped>
@import './styles/_variables.scss';

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-nav {
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border-bottom: 2px solid rgba($primary, 0.1);
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.nav-brand .nav-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: $primary;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  align-items: center;
}

.nav-link {
  color: $primary;
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba($primary, 0.08);
    color: darken($primary, 10%);
  }

  &.router-link-active {
    background: rgba($primary, 0.15);
    color: darken($primary, 5%);
    border-bottom: 2px solid $primary;
  }
}

.app-container {
  flex: 1;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  padding: 1.5rem 1rem;
}

.app-footer {
  background: rgba($primary, 0.04);
  border-top: 1px solid rgba($primary, 0.1);
  padding: 1rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 2rem;

  p {
    margin: 0;
  }
}

@media (max-width: 768px) {
  .app-nav {
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .nav-brand .nav-title {
    font-size: 1.25rem;
  }

  .nav-links {
    justify-content: center;
    width: 100%;
  }

  .nav-link {
    padding: 0.4rem 0.75rem;
    font-size: 0.9rem;
  }

  .app-container {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .app-nav {
    padding: 0.5rem 0.75rem;
  }

  .nav-brand .nav-title {
    font-size: 1.1rem;
  }

  .nav-links {
    gap: 0.15rem;
  }

  .nav-link {
    padding: 0.35rem 0.5rem;
    font-size: 0.8rem;
  }
}
</style>
