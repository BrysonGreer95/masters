<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <h3 class="title is-3">This Year's Prize:</h3>
  <a
    id="bag_link"
    href="https://golf3r.com/en/products/sac-srixon-tour-staff-masters-edition-2023?srsltid=AfmBOorIbI4iY6Twy4a9r8a0pPW404LvxZgbcYk5ooXnNFnDVGaJyrXW"
    >Srixon Masters Staff Bag</a
  >
  <br />
  <hr />
  <img
    class="bag_pic"
    id="bag_pic_1"
    src="../../public/2025_prize/bag_pic.jpg"
    alt="Bag Pic 1"
  />
  <br />
  <img
    class="bag_pic"
    id="bag_pic_2"
    src="../../public/2025_prize/ethan_bag_1.png"
    alt="Bag Pic 3"
  />
  <br />
  <img
    class="bag_pic"
    id="bag_pic_3"
    src="../../public/2025_prize/ethan_bag_2.png"
    alt="Bag Pic 3"
  />
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
#bag_link:link {
  font-size: 2rem;
  text-decoration: underline;
}

.bag_pic {
  height: 30rem;
  width: 30rem;
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
