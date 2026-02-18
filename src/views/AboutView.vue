<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="about">
    <div class="about-header">
      <h1 class="about-title">Masters 2026 Competition</h1>
      <p class="about-subtitle">
        The 3rd Annual Championship Weekend - Experience Excellence in Competition
      </p>
    </div>

    <section class="intro-section">
      <p class="intro-text">
        Join us for the 3rd Annual Masters Competition! We're hosting three exciting events centered around the Masters golf tournament. Compete in multiple events for points and championship glory!
      </p>
    </section>

    <hr />
    <br />

    <section>
      <h3 class="title is-3">General Information</h3>
      <br />
      <h4 class="subtitle is-5">
        This year's competition features three distinct events: ParTee Shack mini golf, a competitive scramble tournament, and the Masters Fantasy League. Points earned across all events will be aggregated for final rankings.
      </h4>
      <br />
    </section>

    <hr />
    <br />

    <section>
      <h3 class="title is-3">Event 1: ParTee Shack - Mini Golf</h3>
      <br />
      <h4 class="subtitle is-4">Test Your Short Game</h4>
      <br />
      Compete in a friendly mini-golf competition. Each player will complete a course of 18 holes, and scores will be ranked. The player with the lowest score will earn the most points.
      <br />
      <br />
      <b-collapse class="collapse" v-model="openParTee" aria-id="contentIdForA11y2">
        <template #trigger="props">
          <b-button
            label="Points for ParTee Shack"
            type="is-primary"
            aria-controls="contentIdForA11y2"
            :aria-expanded="props.open"
          />
        </template>
        <div class="notification">
          <div class="content">
            <p>
              1st place - 100 points<br />
              2nd place - 95 points<br />
              3rd place - 90 points<br />
              4th place - 85 points<br />
              5th place - 80 points<br />
              6th place - 75 points<br />
              7th place - 70 points<br />
              8th place - 65 points<br />
              9th place - 60 points<br />
              10th place - 55 points<br />
              11th place - 50 points<br />
              12th place - 45 points<br />
              13th place - 40 points<br />
              14th place - 35 points<br />
              15th place - 30 points<br />
              16th place - 25 points<br />
              17th place - 20 points<br />
              18th place - 15 points<br />
              19th place - 10 points<br />
              20th+ place - 0 points
            </p>
          </div>
        </div>
      </b-collapse>
    </section>

    <hr />
    <br />

    <section>
      <h3 class="title is-3">Event 2: Scramble Tournament</h3>
      <br />
      <h4 class="subtitle is-4">2-Player Team Competition</h4>
      <br />
      Teams of 2 will compete in a best-ball scramble format at a local golf course. Both players score points based on team placement. Contact Bryson Greer to request a specific teammate if desired.
      <br />
      <br />
      <b-collapse class="collapse" v-model="openScramble" aria-id="contentIdForA11y3">
        <template #trigger="props">
          <b-button
            label="Points for Scramble"
            type="is-primary"
            aria-controls="contentIdForA11y3"
            :aria-expanded="props.open"
          />
        </template>
        <div class="notification">
          <div class="content">
            <p>
              1st place - 200 points each<br />
              2nd place - 190 points each<br />
              3rd place - 180 points each<br />
              4th place - 170 points each<br />
              5th place - 160 points each<br />
              6th place - 150 points each<br />
              7th place - 140 points each<br />
              8th place - 130 points each<br />
              9th place - 120 points each<br />
              10th place - 110 points each<br />
              11th place - 100 points each<br />
              12th place - 90 points each<br />
              13th place - 80 points each<br />
              14th place - 70 points each<br />
              15th place - 60 points each<br />
              16th place - 50 points each<br />
              17th place - 40 points each<br />
              18th place - 30 points each<br />
              19th place - 20 points each<br />
              20th+ place - 0 points<br />
              Did not participate - 0 points
            </p>
          </div>
        </div>
      </b-collapse>
    </section>

    <hr />
    <br />

    <section>
      <h3 class="title is-3">Event 3: Masters Fantasy League</h3>
      <br />
      <h4 class="subtitle is-4">Pick Your Winners</h4>
      <br />
      <p>
        Create your fantasy lineup using the 
        <span class="fantasy-link-wrapper">
          <a 
            href="https://www.masters.com/en_US/fantasy/index.html" 
            target="_blank" 
            rel="noopener noreferrer"
            class="fantasy-link"
          >Masters Official Fantasy Site</a>
        </span>. 
        Your fantasy score is determined by how well your selected golfers perform during the Masters tournament. Highest total fantasy points wins!
      </p>
      <br />
      <b-collapse class="collapse" v-model="openFantasy" aria-id="contentIdForA11y4">
        <template #trigger="props">
          <b-button
            label="Points for Masters Fantasy"
            type="is-primary"
            aria-controls="contentIdForA11y4"
            :aria-expanded="props.open"
          />
        </template>
        <div class="notification">
          <div class="content">
            <p>
              1st place - 300 points<br />
              2nd place - 285 points<br />
              3rd place - 270 points<br />
              4th place - 255 points<br />
              5th place - 240 points<br />
              6th place - 225 points<br />
              7th place - 210 points<br />
              8th place - 195 points<br />
              9th place - 180 points<br />
              10th place - 165 points<br />
              11th place - 150 points<br />
              12th place - 135 points<br />
              13th place - 120 points<br />
              14th place - 105 points<br />
              15th place - 90 points<br />
              16th place - 75 points<br />
              17th place - 60 points<br />
              18th place - 45 points<br />
              19th place - 30 points<br />
              20th+ place - 0 points
            </p>
          </div>
        </div>
      </b-collapse>
    </section>

    <hr />
    <br />
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.about { 
  padding: 0;
}

.about-header {
  text-align: center;
  padding: 2rem 1rem 2.5rem;
  border-bottom: 3px solid $masters-accent;
  margin-bottom: 2rem;
  background: linear-gradient(180deg, transparent 0%, rgba($masters-accent, 0.02) 100%);
}

.about-title {
  font-size: 2rem;
  margin: 0 0 0.75rem 0;
  letter-spacing: 0.5px;
  font-weight: 700;
  color: $primary;
  font-family: $heading-font-stack;
}

.about-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  letter-spacing: 0.3px;
}

.intro-section {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba($masters-accent, 0.03) 0%, rgba($primary, 0.02) 100%);
  border-left: 4px solid $masters-accent;
  border-top: 2px solid $masters-gold;
  margin-bottom: 2rem;
}

.intro-text {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.7;
  color: #333;
  letter-spacing: 0.3px;
}

.about h1 { 
  font-size: 2rem; 
  font-weight: 700;
  color: $primary;
  font-family: $heading-font-stack;
  letter-spacing: 0.5px;
}

.about h3,
.about h4 {
  color: $primary;
  font-family: $heading-font-stack;
  letter-spacing: 0.5px;
}

.about h3 {
  margin: 1.5rem 0 1rem 0;
  font-size: 1.5rem;
}

.about h4 {
  margin: 0.75rem 0 0.5rem 0;
  font-size: 1.1rem;
}

.about p { 
  font-size: 1rem; 
  color: #333;
  line-height: 1.6;
  letter-spacing: 0.3px;
}

.fantasy-link-wrapper {
  display: inline;
}

.fantasy-link {
  color: $primary;
  text-decoration: underline;
  font-weight: 700;
  transition: color 0.3s ease;

  &:hover {
    color: $masters-gold;
  }
}

.notification {
  background-color: rgba($masters-accent, 0.05) !important;
  border-left: 4px solid $masters-accent !important;
  border-radius: 0 !important;
}

.collapse {
  margin: 1rem 0;
}

.button.is-primary {
  background: $primary !important;
  border: none !important;
  border-radius: 0 !important;
  letter-spacing: 0.5px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    background: darken($primary, 5%) !important;
    box-shadow: 0 4px 8px rgba($primary, 0.2) !important;
  }
}

@media (max-width: 768px) {
  .about-header {
    padding: 1.5rem 1rem 2rem;
  }

  .about-title {
    font-size: 1.5rem;
  }

  .about-subtitle {
    font-size: 1rem;
  }

  .about h3 {
    font-size: 1.25rem;
  }

  .about h4 {
    font-size: 1rem;
  }
}
</style>

<script>
export default {
  name: "AboutView",
  data() {
    return {
      openParTee: false,
      openScramble: false,
      openFantasy: false,
    };
  },
};
</script>
