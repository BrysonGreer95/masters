<template>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css"
  />
  <link
    rel="stylesheet"
    href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
  />
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/scramble">Scramble Information</router-link>
  </nav>
  <router-view />
</template>

<style lang="scss">
#app {
  @import "~bulma/sass/utilities/_all";
  $primary: #076652;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #076652;

  @import "~bulma";
  @import "~buefy/src/scss/buefy";
}

nav {
  padding: 30px;
}

button {
  background-color: #076652;
}

nav a {
  font-weight: bold;
  color: #076652;
}

nav a.router-link-exact-active {
  color: #076652;
}
</style>
