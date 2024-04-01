<template>
  <div class="home">
    <img alt="Masters logo" src="../assets/masters.png">
    <LeaderBoard/>
  </div>
</template>

<script>
// @ is an alias to /src
import LeaderBoard from '@/components/LeaderBoard.vue';

export default {
  name: 'HomeView',
  components: {
    LeaderBoard
  }
}
</script>

<style>
img {
  width: 8rem;
}</style>