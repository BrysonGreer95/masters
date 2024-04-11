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

<style lang="scss">
#scramble_table {
  padding: 5px;
}
table.text-center * {
  text-align: center;
}

.b-table th {
  text-align: center;
}

.b-table .table th .th-wrap {
  display: block;
}
</style>
