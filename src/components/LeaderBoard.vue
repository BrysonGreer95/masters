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
            props.row.scramble +
            props.row.golden_tee +
            props.row.rttm +
            props.row.masters_bet)
        }}
      </b-table-column>

      <b-table-column
        :default-sort-direction="desc"
        field="golden_tee"
        label="Golden Tee Points"
        sortable
        numeric
        v-slot="props"
      >
        {{ props.row.golden_tee }}
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
        field="masters"
        label="Masters Bet Points"
        sortable
        numeric
        v-slot="props"
      >
        {{ props.row.masters_bet }}
      </b-table-column>

      <b-table-column
        field="rttm"
        label="Road To The Masters Points"
        sortable
        numeric
        v-slot="props"
      >
        {{ props.row.rttm }}
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
