<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="about">
    <div class="page-header">
      <h1>Masters Week 2026</h1>
      <p class="page-subtitle">
        The 3rd Annual
      </p>
    </div>

    <!-- Intro -->
    <section class="intro">
      <div class="intro-inner">
        <p class="intro-text">
          Three events. One champion.
        </p>
      </div>
    </section>

    <!-- Event Cards -->
    <section class="events-section">
      <div class="events-grid">

        <!-- Event 1 -->
        <div class="event-card">
          <div class="event-number">01</div>
          <div class="event-card-body">
            <h3 class="event-title">ParTee Shack Mini Golf</h3>
            <div class="event-meta">
              <span class="event-date">Friday, April 10 &bull; 6–8 PM</span>
              <a class="event-location"
                href="https://maps.google.com/?q=6231+Triangle+Plantation+Drive+Raleigh+NC+27616" target="_blank"
                rel="noopener noreferrer">ParTee Shack North Raleigh &rarr;</a>
            </div>
            <p class="event-desc">
              Two full 18-hole courses (36 holes total). Lowest stroke total wins.
              Rankings determine points — every shot counts.
            </p>
            <b-collapse v-model="openParTee" aria-id="pts-partee">
              <template #trigger="props">
                <button class="points-toggle" :aria-expanded="props.open">
                  {{ props.open ? 'Hide' : 'View' }} Point Distribution
                  <span class="toggle-arrow">{{ props.open ? '▲' : '▼' }}</span>
                </button>
              </template>
              <div class="points-table">
                <div class="points-row" v-for="(pts, i) in parTeePoints" :key="i">
                  <span class="place">{{ pts.place }}</span>
                  <span class="pts">{{ pts.points }} pts</span>
                </div>
              </div>
            </b-collapse>
          </div>
        </div>

        <!-- Event 2 -->
        <div class="event-card">
          <div class="event-number">02</div>
          <div class="event-card-body">
            <h3 class="event-title">Scramble Tournament</h3>
            <div class="event-meta">
              <span class="event-date">Saturday, April 11 &bull; 12 PM</span>
              <a class="event-location" href="https://maps.google.com/?q=585+Reedy+Creek+Rd+Four+Oaks+NC+27524"
                target="_blank" rel="noopener noreferrer">Reedy Creek Golf Course &rarr;</a>
            </div>
            <p class="event-desc">
              Two-man scramble. Both teammates earn points based on team placement.
            </p>
            <div class="event-rules">
              <div class="rules-header">
                <span class="rules-icon">&#9965;</span>
                <span class="rules-label">Tournament Rules</span>
              </div>
              <ul class="rules-list">
                <li>1 mulligan per 9 holes &mdash; may not carry over to the back 9</li>
                <li>Breakfast ball on hole 1 only &mdash; must be called before leaving the tee box</li>
                <li>No gimmie putts &mdash; all putts must be holed out</li>
                <li>Each player must contribute a minimum of 2 drives per 9 holes</li>
                <li>All players must hit before the best ball is selected</li>
                <li>Ball placed within 1 club length of selected shot, no closer to the hole, same area of course</li>
              </ul>
            </div>
            <b-collapse v-model="openScramble" aria-id="pts-scramble">
              <template #trigger="props">
                <button class="points-toggle" :aria-expanded="props.open">
                  {{ props.open ? 'Hide' : 'View' }} Point Distribution
                  <span class="toggle-arrow">{{ props.open ? '▲' : '▼' }}</span>
                </button>
              </template>
              <div class="points-table">
                <div class="points-row" v-for="(pts, i) in scramblePoints" :key="i">
                  <span class="place">{{ pts.place }}</span>
                  <span class="pts">{{ pts.points }} pts each</span>
                </div>
              </div>
            </b-collapse>
          </div>
        </div>

        <!-- Event 3 -->
        <div class="event-card">
          <div class="event-number">03</div>
          <div class="event-card-body">
            <h3 class="event-title">Masters Fantasy League</h3>
            <div class="event-meta">
              <span class="event-date">Sunday, April 12 &bull; 2 PM</span>
              <span class="event-location-static">Watch Party @ Greer House</span>
            </div>
            <p class="event-desc">
              Pick your roster before the Masters begins. Your fantasy score follows your golfers through
              the tournament. Highest points wins.
            </p>
            <div class="fantasy-cta">
              <a href="https://www.masters.com/en_US/fantasy?leagueJoinToken=09a845f0e8&leagueId=13604" target="_blank"
                rel="noopener noreferrer" class="cta-button">Join the League</a>
              <p class="deadline-note">Lineups due by April 9th</p>
            </div>
            <b-collapse v-model="openFantasy" aria-id="pts-fantasy">
              <template #trigger="props">
                <button class="points-toggle" :aria-expanded="props.open">
                  {{ props.open ? 'Hide' : 'View' }} Point Distribution
                  <span class="toggle-arrow">{{ props.open ? '▲' : '▼' }}</span>
                </button>
              </template>
              <div class="points-table">
                <div class="points-row" v-for="(pts, i) in fantasyPoints" :key="i">
                  <span class="place">{{ pts.place }}</span>
                  <span class="pts">{{ pts.points }} pts</span>
                </div>
              </div>
            </b-collapse>
          </div>
        </div>

      </div>
    </section>

    <!-- Watch Party Banner -->
    <section class="watch-party">
      <div class="watch-party-inner">
        <p class="watch-label">Join Us</p>
        <h2 class="watch-title">Fantasy Watch Party</h2>
        <p class="watch-desc">
          Sunday, April 12 from 2 PM until the Masters concludes. The overall champion will be crowned
          and the prize awarded at the Greer's house.
        </p>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: "AboutView",
  data() {
    return {
      openParTee: false,
      openScramble: false,
      openFantasy: false,
      parTeePoints: [
        { place: "1st", points: 100 }, { place: "2nd", points: 95 },
        { place: "3rd", points: 90 }, { place: "4th", points: 85 },
        { place: "5th", points: 80 }, { place: "6th", points: 75 },
        { place: "7th", points: 70 }, { place: "8th", points: 65 },
        { place: "9th", points: 60 }, { place: "10th", points: 55 },
        { place: "11th", points: 50 }, { place: "12th", points: 45 },
        { place: "13th", points: 40 }, { place: "14th", points: 35 },
        { place: "DNS", points: 0 },
      ],
      scramblePoints: [
        { place: "1st", points: 200 }, { place: "2nd", points: 175 },
        { place: "3rd", points: 150 }, { place: "4th", points: 125 },
        { place: "5th", points: 100 }, { place: "6th", points: 75 },
        { place: "7th", points: 50 }, { place: "DNS", points: 0 },
      ],
      fantasyPoints: [
        { place: "1st", points: 300 }, { place: "2nd", points: 285 },
        { place: "3rd", points: 270 }, { place: "4th", points: 255 },
        { place: "5th", points: 240 }, { place: "6th", points: 225 },
        { place: "7th", points: 210 }, { place: "8th", points: 195 },
        { place: "9th", points: 180 }, { place: "10th", points: 165 },
        { place: "11th", points: 150 }, { place: "12th", points: 135 },
        { place: "13th", points: 120 }, { place: "14th", points: 105 },
        { place: "DNS", points: 0 },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.about {
  width: 100%;
}

// ─── Intro ────────────────────────────────────────────────────────────────────
.intro {
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.intro-inner {
  max-width: 640px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  text-align: center;
}

.intro-text {
  font-size: 1.15rem;
  color: #555;
  line-height: 1.8;
  margin: 0;
  font-family: $heading-font-stack;
  font-style: italic;
}

// ─── Event Cards Grid ─────────────────────────────────────────────────────────
.events-section {
  background: #f7f7f5;
  padding: 3rem 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: $bp-tablet) {
    grid-template-columns: 1fr;
    max-width: 560px;
  }
}

.event-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-top: 3px solid $masters-accent;
  display: flex;
  flex-direction: column;
}

.event-number {
  font-size: 3rem;
  font-weight: 700;
  font-family: $heading-font-stack;
  color: rgba($primary, 0.1);
  padding: 1.25rem 1.5rem 0;
  line-height: 1;
  letter-spacing: -1px;
}

.event-card-body {
  padding: 0.75rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.event-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: $primary;
  font-family: $heading-font-stack;
  margin: 0 0 0.75rem;
  letter-spacing: 0.3px;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.event-date {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  letter-spacing: 0.3px;
}

.event-location {
  font-size: 0.82rem;
  color: $masters-accent;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.event-location-static {
  font-size: 0.82rem;
  color: #777;
  font-weight: 500;
}

.event-desc {
  font-size: 0.92rem;
  color: #555;
  line-height: 1.65;
  margin: 0 0 1.25rem;
  flex: 1;
}

// ─── Rules Box ────────────────────────────────────────────────────────────────
.event-rules {
  margin-bottom: 1.25rem;
  border: 1px solid rgba($masters-accent, 0.2);
  border-top: 3px solid $masters-accent;
  background: #f9faf9;
}

.rules-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.85rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: white;
}

.rules-icon {
  font-size: 0.85rem;
  opacity: 0.6;
}

.rules-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: $primary;
}

.rules-list {
  margin: 0;
  padding: 0.6rem 0.85rem 0.6rem 1.75rem;
  list-style: disc;

  li {
    font-size: 0.8rem;
    color: #555;
    line-height: 1.6;
    padding: 0.15rem 0;
  }
}

// ─── Fantasy CTA ─────────────────────────────────────────────────────────────
.fantasy-cta {
  margin-bottom: 1.25rem;
}

.cta-button {
  display: inline-block;
  background: $primary;
  color: white;
  padding: 0.6rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: darken($primary, 6%);
  }
}

.deadline-note {
  font-size: 0.78rem;
  color: #999;
  margin: 0.5rem 0 0;
  font-style: italic;
}

// ─── Points Toggle / Table ────────────────────────────────────────────────────
.points-toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: $masters-accent;
  cursor: pointer;
  letter-spacing: 0.3px;
  font-family: $body-font-stack;

  &:hover {
    color: $primary;
  }
}

.toggle-arrow {
  font-size: 0.65rem;
}

.points-table {
  margin-top: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.07);
  background: #fafafa;
}

.points-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:last-child {
    border-bottom: none;
  }
}

.place {
  color: #555;
  font-weight: 500;
  min-width: 50px;
}

.pts {
  font-weight: 700;
  color: $primary;
}

// ─── Watch Party Banner ───────────────────────────────────────────────────────
// ─── Watch Party Banner ───────────────────────────────────────────────────────
// Cream/warm background intentionally contrasts with the dark green nav/footer
.watch-party {
  background: #f9f5e8;
  border-top: 3px solid $masters-gold;
  border-bottom: 3px solid $masters-gold;
  padding: 4rem 2rem;
}

.watch-party-inner {
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
}

.watch-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: darken($masters-gold, 15%);
  margin: 0 0 0.75rem;
}

.watch-title {
  font-size: 2rem;
  font-weight: 700;
  color: $primary;
  font-family: $heading-font-stack;
  margin: 0 0 1rem;
  letter-spacing: 0.5px;
}

.watch-desc {
  font-size: 1rem;
  color: #555;
  line-height: 1.7;
  margin: 0;
}

@media (max-width: $bp-mobile) {
  .events-section {
    padding: 2rem 1rem;
  }

  .watch-party {
    padding: 2.5rem 1.25rem;
  }

  .watch-title {
    font-size: 1.5rem;
  }
}
</style>
