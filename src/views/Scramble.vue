<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <b-table :data="data" :columns="columns"></b-table>
</template>

<script>
    export default {
        data() {
            return {
                data: [
                    { 'team': 1, 'member_1': 'Bryson Greer', 'member_2': 'Steven Welsh', "tee_time": "10:04"},
                    { 'team': 2, 'member_1': 'Andy Jones', 'member_2': 'Blake Jones', "tee_time": "10:04"},
                    { 'team': 3, 'member_1': 'Brad Barbour', 'member_2': 'Lee Chatham', "tee_time": "10:12"},
                    { 'team': 4, 'member_1': 'Markell Quinn', 'member_2': 'Wyatt Dershem', "tee_time": "10:12"},
                    { 'team': 5, 'member_1': 'Erin Leon', 'member_2': 'Brandon Massie', "tee_time": "10:20"},
                    { 'team': 6, 'member_1': 'N/A', 'member_2': 'N/A', "tee_time": "10:20"},

                ],
                columns: [
                    {
                        field: 'team',
                        label: 'Team',
                        numeric: true
                    },
                    {
                        field: 'member_1',
                        label: 'Team Member 1',
                    },
                    {
                        field: 'member_2',
                        label: 'Team Member 2',
                    }
                ]
            }
        }
    }
</script>