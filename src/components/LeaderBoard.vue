<template>
    <section>   

        <b-table
            :data="data"
            :default-sort-direction="defaultSortDirection"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            default-sort="total"
            :page-input="hasInput"
            :page-input-position="inputPosition"
            :debounce-page-input="inputDebounce">

            <b-table-column field="user.first_name" label="First Name" sortable v-slot="props">
                {{ props.row.user.first_name }}
            </b-table-column>

            <b-table-column field="user.last_name" label="Last Name" sortable v-slot="props">
                {{ props.row.user.last_name }}
            </b-table-column>

            <b-table-column field="total" label="Total Points" sortable v-slot="props">
                {{ props.row.total }}
            </b-table-column>

            <b-table-column field="golden_tee" label="Golden Tee Points" sortable v-slot="props">
                {{ props.row.golden_tee }}
            </b-table-column>

            <b-table-column field="scramble" label="Scramble Points" sortable v-slot="props">
                {{ props.row.scramble }}
            </b-table-column>

            <b-table-column field="masters" label="Master's Bet Points" sortable v-slot="props">
                {{ props.row.masters_bet }}
            </b-table-column>

            <b-table-column field="rttm" label="Road To The Master's Points" sortable v-slot="props">
                {{ props.row.rttm }}
            </b-table-column>
        </b-table>
    </section>
</template>

<script>
    const data = require('../assets/data.json')

    export default {
        data() {
            return {
                data,
                defaultSortDirection: 'desc',
                sortIcon: 'arrow-up',
                sortIconSize: 'is-small',
                hasInput: false,
                inputPosition: '',
                inputDebounce: ''
            }
        }
    }
</script>