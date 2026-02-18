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
      <p>&copy; 2026 Masters Competition. Home of Championship Excellence.</p>
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-bottom: 3px solid $masters-accent;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand .nav-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: $primary;
  white-space: nowrap;
  letter-spacing: 0.5px;
  font-family: $heading-font-stack;
}

.nav-links {
  display: flex;
  gap: 0;
  flex-wrap: wrap;
  align-items: center;
}

.nav-link {
  color: $primary;
  text-decoration: none;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 0;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  position: relative;

  &:hover {
    background: transparent;
    color: $masters-accent;
  }

  &.router-link-active {
    background: transparent;
    color: $masters-accent;
    font-weight: 700;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 1.2rem;
      right: 1.2rem;
      height: 2px;
      background: $masters-accent;
    }
  }
}

.app-container {
  flex: 1;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem 1rem;
}

.app-footer {
  background: linear-gradient(180deg, rgba($primary, 0.08) 0%, rgba($masters-accent, 0.05) 100%);
  border-top: 3px solid $masters-accent;
  padding: 2rem 1.5rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 2rem;

  p {
    margin: 0;
    letter-spacing: 0.3px;
  }
}

@media (max-width: 768px) {
  .app-nav {
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 0.75rem 1rem;
  }

  .nav-brand .nav-title {
    font-size: 1.4rem;
  }

  .nav-links {
    justify-content: center;
    width: 100%;
    gap: 0.25rem;
  }

  .nav-link {
    padding: 0.5rem 0.9rem;
    font-size: 0.9rem;
  }

  .app-container {
    padding: 1.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .app-nav {
    padding: 0.5rem 0.75rem;
    gap: 0.75rem;
  }

  .nav-brand .nav-title {
    font-size: 1.2rem;
  }

  .nav-links {
    gap: 0;
  }

  .nav-link {
    padding: 0.4rem 0.65rem;
    font-size: 0.8rem;
  }
  
  .app-container {
    padding: 1rem;
  }
}
</style>
