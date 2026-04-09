<template>
  <div id="app" class="app-wrapper">
    <!-- Navigation -->
    <nav class="app-nav">
      <div class="nav-brand">
        <span class="nav-title">Masters 2026</span>
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
        <router-link to="/scramble" class="nav-link">Scramble</router-link>
        <router-link to="/masters" class="nav-link">Masters Fantasy</router-link>
        <router-link to="/masters-score" class="nav-link">Live Score</router-link>
        <router-link to="/final-prize" class="nav-link">Prize</router-link>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="app-container">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p>&copy; 2026 Masters Competition &mdash; Home of Championship Excellence</p>
      <router-link to="/admin" class="admin-link">Score Entry</router-link>
    </footer>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import './styles/_variables.scss';

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

// ─── Navigation ───────────────────────────────────────────────────────────────
.app-nav {
  background: $primary;
  padding: 0 2rem;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
}

.nav-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  font-family: $heading-font-stack;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  align-items: center;
  height: 60px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 0 1rem;
  height: 60px;
  display: flex;
  align-items: center;
  position: relative;
  transition: color 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: white;
  }

  &.router-link-active {
    color: $masters-gold;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 1rem;
      right: 1rem;
      height: 3px;
      background: $masters-gold;
    }
  }
}

// ─── Main Content ─────────────────────────────────────────────────────────────
.app-container {
  flex: 1;
  width: 100%;
  padding: 0;
}

// ─── Footer ───────────────────────────────────────────────────────────────────
.app-footer {
  background: $primary;
  padding: 1.25rem 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  letter-spacing: 0.3px;

  p {
    margin: 0 0 0.4rem;
  }
}

.admin-link {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.25);
  text-decoration: none;
  letter-spacing: 0.5px;

  &:hover {
    color: rgba(255, 255, 255, 0.5);
  }
}

// ─── Responsive ───────────────────────────────────────────────────────────────
@media (max-width: $bp-tablet) {
  .app-nav {
    height: auto;
    flex-direction: column;
    align-items: stretch;
    padding: 0.75rem 0 0;
    gap: 0;
  }

  .nav-brand {
    padding: 0 1.25rem 0.6rem;
  }

  // Single scrollable row — no wrapping, no cluttered grid
  .nav-links {
    height: 40px;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    touch-action: pan-x;
    -webkit-overflow-scrolling: touch;
    padding: 0 0.5rem;
    gap: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);

    // Hide scrollbar visually — still scrollable
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }

  .nav-link {
    height: 40px;
    flex-shrink: 0;
    padding: 0 1rem;
    font-size: 0.78rem;
    letter-spacing: 0.3px;
    border-bottom: none;
    position: relative;

    &.router-link-active {
      color: $masters-gold;

      // Gold underline on active, matching desktop language
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 1rem;
        right: 1rem;
        height: 2px;
        background: $masters-gold;
      }
    }
  }
}

@media (max-width: $bp-mobile) {
  .nav-title {
    font-size: 1.05rem;
  }

  .nav-link {
    padding: 0 0.85rem;
    font-size: 0.75rem;
  }

  .app-footer {
    padding: 1rem;
    font-size: 0.8rem;
  }
}
</style>
