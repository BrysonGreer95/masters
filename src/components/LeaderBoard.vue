<template>
  <h3 class="title is-3">Leaderboard</h3>

  <section>
    <b-table
      id="table"
      :key="tableDataKey"
      :data="data"
      :default-sort-direction="defaultSortDirection"
      :sort-icon="sortIcon"
      :sort-icon-size="sortIconSize"
      default-sort="total"
      striped
      :page-input="hasInput"
      :page-input-position="inputPosition"
      :debounce-page-input="inputDebounce"
    >
      <b-table-column
        :default-sort-direction="asc"
        field="id"
        numeric
        label="Player Number"
        sortable
        v-slot="props"
      >
        {{ props.row.id }}
      </b-table-column>
      <b-table-column
        :default-sort-direction="asc"
        field="user.first_name"
        label="First Name"
        sortable
        v-slot="props"
      >
        {{ props.row.user.first_name }}
      </b-table-column>

      <b-table-column
        :default-sort-direction="asc"
        field="user.last_name"
        label="Last Name"
        sortable
        v-slot="props"
      >
        {{ props.row.user.last_name }}
      </b-table-column>

      <b-table-column
        :default-sort-direction="desc"
        field="total"
        label="Total Points"
        sortable
        numeric
        v-slot="props"
      >
        {{
          (props.row.total =
            props.row.sullys +
            props.row.scramble +
            props.row.fantasy)
        }}
      </b-table-column>

      <b-table-column
        :default-sort-direction="desc"
        field="simulator"
        label="Simulator Points"
        sortable
        numeric
        v-slot="props"
      >
        {{ props.row.sullys }}
      </b-table-column>

      <b-table-column
        field="scramble"
        label="Scramble Points"
        sortable
        numeric
        v-slot="props"
      >
        {{ props.row.scramble }}
      </b-table-column>

      <b-table-column
        field="fantasy"
        label="Fantasy Points"
        sortable
        numeric
        v-slot="props"
      >
        {{ props.row.fantasy }}
      </b-table-column>
    </b-table>
  </section>
</template>

<script>
const data = require("../assets/data.json");

export default {
  data() {
    return {
      tableDataKey: 0,
      data,
      defaultSortDirection: "desc",
      sortIcon: "arrow-up",
      sortIconSize: "is-small",
      hasInput: false,
    };
  },
};
</script>
