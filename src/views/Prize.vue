<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <h3 class="title is-3">This Year's Prize:</h3>
  <h4 class="title is-4">Coming Soon</h4>
  <img id="blur_img" src="../../public/bagblur.png" alt="Blur" />
</template>

<script>
export default {
  data() {
    return {
      data: [],
    };
  },
};
</script>

<style lang="scss">
#blur_img {
  height: 50rem;
  width: 50rem;
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
