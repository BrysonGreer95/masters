<template>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css"
  />
  <link
    rel="stylesheet"
    href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
  />
  <img
    alt="Masters logo"
    src="../src/assets/masters.png"
    @click="isImageModalActive = true"
  />
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/scramble">Scramble Information</router-link>
  </nav>
  <router-view />

  <b-modal v-model="isImageModalActive">
    <p class="image is-4by3">
      <img src="../src/assets/pimento.png" />
    </p>
  </b-modal>
</template>

<style lang="scss">
#app {
  padding-top: 2rem;
  padding-bottom: 2rem;
  @import "~bulma/sass/utilities/_all";
  @import "~bulma";
  @import "~buefy/src/scss/buefy";
  $primary: #005e28;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #005e28;

  a {
    color: #005e28;

    &:hover {
      color: #faf400;
    }
  }

  .router-link-active {
    text-decoration: underline;
    text-decoration-color: #005e28;
  }

  button {
    background-color: #005e28;
  }

  .button.is-primary {
    background-color: #005e28;

    &:hover {
      background-color: #005e28;
    }

    &:active {
      background-color: #005e28;
      box-shadow: 0 0 0 0.125rem #faf400;
    }

    &:focus {
      background-color: #005e28;
      box-shadow: 0 0 0 0.125rem #faf400;
    }
  }
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #076652;
}

nav a.router-link-exact-active {
  color: #076652;
}
</style>

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
