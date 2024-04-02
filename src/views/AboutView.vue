<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="about">
    <h1 class="title is-2">Ultimate Masters Competition</h1>
    <br />
    <hr />
    <p>
      The Ultimate Masters Competition is our way of adding an extra layer of
      fun to the already exciting week of the Masters! We hope that you’ll join
      us in a multi-event competition, focused around various aspects of the
      game of golf and a celebration on Sunday.
    </p>
    <hr />
    <br />

    <section>
      <h3 class="title is-3">
        Friday, April 12th, 7:00pm<br />First Street Tavern, Clayton
      </h3>
      <p class="subtitle is-4">Golden Tee</p>
      <h4 class="title is-5">
        <br />
        ADDRESS: 115 EAST FIRST STREET, CLAYTON, NC 27520
      </h4>
      <p>
        This will either be an individual or team based event, depending on how
        many people attend.
      </p>
      <br />
      <b-collapse :open="false" aria-id="contentIdForA11y1">
        <template #trigger="props">
          <b-button
            label="Points for Golden Tee"
            type="is-primary"
            aria-controls="contentIdForA11y1"
            :aria-expanded="props.open"
          />
        </template>
        <div class="notification">
          <div class="content">
            <p>
              1st = 20 points (or 20 per person if it is a team event)<br />
              2nd = 15 points<br />
              3rd = 10 points<br />
              4th = 5 points<br />
              Do not attend = auto 3 points
            </p>
          </div>
        </div>
      </b-collapse>
    </section>

    <hr />
    <br />

    <section>
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
    </section>

    <hr />
    <br />

    <section>
      <h3 class="title is-3">Sunday, April 14th, 2:00pm</h3>
      <p class="subtitle is-4">Masters watch party at The Greer’s</p>
      Spouses, families, etc. are invited! Please just let us know how many
      expect when you RSVP for food.
      <br />
      <br />
      <h4 class="title is-5">ADDRESS: 27 EASTLAND CT, SMITHFIELD, NC 27577</h4>
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
    </section>
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
