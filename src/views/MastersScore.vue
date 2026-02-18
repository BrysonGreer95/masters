<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="rankings">
    <MastersLeaderboard id="mastersLeaderboard" />
  </div>
</template>

<script>
import MastersLeaderboard from "@/components/MastersLeaderboard.vue";

export default {
  name: "MastersScore",
  components: {
    MastersLeaderboard,
  },
  data() {
    return {};
  },
};
</script>

