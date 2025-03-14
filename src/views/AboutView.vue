<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="about">
    <h2 class="title is-2">Ultimate Masters Competition</h2>
    <br />
    <hr />
    <h5 class="subtitle is-5">
      The Ultimate Masters Competition is our way of adding an extra layer of
      fun to the already exciting week of the Masters! We hope that you’ll join
      us in a multi-event competition, focused around various aspects of the
      game of golf and a celebration on Sunday.
    </h5>
    <hr />
    <br />

    <section>
      <h3 class="title is-3">
        Friday, April 11th, 2025; 6:30pm <br />Drive Shack
      </h3>
      <br />
      <h4 class="subtitle is-4">PGA National Sim</h4>
      <br />
      <h4 class="title is-5">6901 Play Golf Wy, Raleigh, NC 27607</h4>
      <br />
      Spouses invited! We will be renting bays of 4-6 people, playing the PGA
      National Course at Drive Shack. Every group will set up their game to play
      9 holes, but only the score after the first 5 will go towards your total
      points for the event.
      <br />
      <br />
      <b-collapse :open="false" aria-id="contentIdForA11y1">
        <template #trigger="props">
          <b-button
            label="Points for Drive Shack"
            type="is-primary"
            aria-controls="contentIdForA11y1"
            :aria-expanded="props.open"
          />
        </template>
        <div class="notification">
          <div class="content">
            <p>
              1st place - 20 points<br />
              2nd place - 18 points<br />
              3rd place - 16 points<br />
              4th place- 15 points<br />
              5th place- 14 points<br />
              6th place- 13 points<br />
              7th place- 12 points<br />
              8th place- 11 points<br />
              9th place- 10 points<br />
              10th place- 9 points<br />
              11th place- 8 points<br />
              12th place- 7 points<br />
              13th place- 6 points<br />
              14th place- 5 points<br />
              15th place- 4 points<br />
              16th place- 3 points<br />
              17th place- 2 points<br />
              18th place- 1 point
            </p>
          </div>
        </div>
      </b-collapse>
    </section>

    <hr />
    <br />

    <section>
      <h3 class="title is-3">
        Saturday, April 12th, TIME: TBD<br />Reedy Creek Golf Course
      </h3>
      <br />
      <p class="subtitle is-4">Team Scramble tournament</p>
      <br />
      <h4 class="title is-5">
        ADDRESS: 585 REEDY CREEK RD, FOUR OAKS, NC 27524
      </h4>
      <br />
      2 people per team. If you have someone that you’d like to be paired with,
      reach out to Bryson prior to April 5th. Points are for each team member.
      Mulligans will be available for purchase at the competition. This money
      goes towards our grand prize.
      <br />
      <br />
      <b-collapse :open="false" aria-id="contentIdForA11y1">
        <template #trigger="props">
          <b-button
            label="Points for Scramble"
            type="is-primary"
            aria-controls="contentIdForA11y1"
            :aria-expanded="props.open"
          />
        </template>
        <div class="notification">
          <div class="content">
            <p>
              1st = 40 points each<br />
              2nd = 35 points<br />
              3rd = 30 points<br />
              4th = 25 points<br />
              5th = 20 points<br />
              6th = 15 points<br />
              7th = 10 points<br />
              8th = 5 points<br />
              9th = 0 points<br />
              Do not attend = 0 points
            </p>
          </div>
        </div>
      </b-collapse>
    </section>

    <hr />
    <br />

    <section>
      <h3 class="title is-3">
        Sunday, April 13th, TIME: 1:30pm<br />Greer House Watch Party
      </h3>
      <br />
      <p class="subtitle is-4">Masters Fantasy Scoring</p>
      <br />
      <h4 class="title is-5">ADDRESS: Sent out via RSVP</h4>
      <br />
      <h4 class="title is-4">
        Fantasy Link: <a>https://www.masters.com/en_US/fantasy/index.html</a>
      </h4>
      Watch party at our house! The fantasy lineup will need to be set BEFORE
      the Masters starts, so by the night of Wednesday the 9th. We will be
      providing food but encourage guests to bring a covered dish or appetizer
      (not required). Points will be awarded based on how well you do within the
      fantasy app.
      <br />
      <br />
      <h4 class="title is-4">
        NOTE: Attendance is not required to this event to get points for Fantasy
      </h4>
      <br />
      <b-collapse :open="false" aria-id="contentIdForA11y1">
        <template #trigger="props">
          <b-button
            label="Points for Fantasy"
            type="is-primary"
            aria-controls="contentIdForA11y1"
            :aria-expanded="props.open"
          />
        </template>
        <div class="notification">
          <div class="content">
            <p>
              1st = 50 points each<br />
              2nd = 45 points<br />
              3rd = 40 points<br />
              4th = 35 points<br />
              5th = 30 points<br />
              6th = 25 points<br />
              7th = 20 points<br />
              8th = 15 points<br />
              9th = 10 points<br />
              10th = 5 points<br />
              11th+ = 0 points<br />
            </p>
          </div>
        </div>
      </b-collapse>
    </section>

    <!-- <section>
      <h3 class="title is-3">
        Saturday, April 13th, 10:00am<br />Reedy Creek Golf Course
      </h3>
      <p class="subtitle is-4">Team Scramble tournament</p>
      <br />
      <h4 class="title is-5">
        ADDRESS: 585 REEDY CREEK RD, FOUR OAKS, NC 27524
      </h4>
      <br />
      2 people per team. If you have someone that you’d like to be paired with,
      reach out to Bryson prior to Saturday. Points are for each team member.
      Mulligans and 1 possible “throw” will be available for purchase at the
      competition. This money goes towards our grand prize. Our tee times are:
      10:04, 10:12 and 10:20
      <br />
      <br />
      <b-collapse :open="false" aria-id="contentIdForA11y1">
        <template #trigger="props">
          <b-button
            label="Points for Scramble"
            type="is-primary"
            aria-controls="contentIdForA11y1"
            :aria-expanded="props.open"
          />
        </template>
        <div class="notification">
          <div class="content">
            <p>
              1st = 40 points each<br />
              2nd = 30 points<br />
              3rd = 20 points<br />
              4th = 10 points<br />
              5th = 5 points<br />
              Do not attend = 0 points
            </p>
          </div>
        </div>
      </b-collapse>
    </section> -->

    <!-- <hr />
    <br /> -->

    <!-- <section>
      <h3 class="title is-3">Sunday, April 14th, 2:00pm</h3>
      <p class="subtitle is-4">Masters watch party at The Greer’s</p>
      Spouses, families, etc. are invited! Please just let us know how many to
      expect when you RSVP for food.
      <br />
      <br />
      We will be watching the Masters tournament and having Master’s themed
      snacks. There will likely be a small putting green, corn hole, (possibly a
      chipping contest), and an additional TV with Xbox set up with the game PGA
      Tour, Road to the Masters. If you’d like additional points, you can play 9
      holes on the game and log your score. 4 players at a time, should take
      about 20-30 minutes for 9 holes.

      <br />
      <br />
      <b-collapse :open="false" aria-id="contentIdForA11y1">
        <template #trigger="props">
          <b-button
            label="Points for Masters Bet"
            type="is-primary"
            aria-controls="contentIdForA11y1"
            :aria-expanded="props.open"
          />
        </template>
        <div class="notification">
          <div class="content">
            <p>
              Chosen golfer gets 1st = 50 points<br />
              Chosen golfer gets top 5 = 30 points<br />
              Chosen golfer gets top 10 = 15 points
            </p>
          </div>
        </div>
      </b-collapse>

      <br />

      <b-collapse :open="false" aria-id="contentIdForA11y1">
        <template #trigger="props">
          <b-button
            label="Points for Road To The Masters"
            type="is-primary"
            aria-controls="contentIdForA11y1"
            :aria-expanded="props.open"
          />
        </template>
        <div class="notification">
          <div class="content">
            <p>
              1st = 20 points<br />
              2nd = 16<br />
              3rd = 12<br />
              4th = 8<br />
              5th = 6<br />
              6th = 4<br />
              7th = 2<br />
            </p>
          </div>
        </div>
      </b-collapse>
    </section> -->
  </div>
</template>

<style lang="scss">
.about {
  padding: 3rem;
}
h1 {
  font-size: 2rem;
  font-weight: 700;
}
h2 {
  font-size: 1.5rem;
  font-weight: 500;
}
button {
  background-color: #174038;
}
.button.is-primary {
  background-color: #174038;
}
p {
  font-size: 1rem;
}
</style>

<script>
export default {
  open: false,
};
</script>
