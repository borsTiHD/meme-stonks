<template>
    <v-app-bar clipped-left fixed app>
        <v-btn icon @click.stop="drawer = !drawer">
            <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-toolbar-title v-text="title" />
        <v-spacer />
        <v-autocomplete
            v-model="select"
            :loading="loading"
            :items="items"
            :search-input.sync="search"
            cache-items
            class="mx-4"
            flat
            hide-no-data
            hide-details
            label="What state are you from?"
            solo-inverted
        ></v-autocomplete>
        <v-spacer />
        <v-btn icon @click.stop="rightDrawer = !rightDrawer">
            <v-icon>mdi-menu</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import pkg from './../../package.json'
export default {
    data() {
        return {
            title: `${pkg.productName}`,
            loading: false,
            items: [],
            search: null,
            select: null,
            states: [
                'Alabama',
                'Alaska',
                'American Samoa',
                'Arizona',
                'Arkansas',
                'California',
                'Colorado',
                'Connecticut',
                'Delaware',
                'District of Columbia',
                'Federated States of Micronesia',
                'Florida',
                'Georgia',
                'Guam',
                'Hawaii',
                'Idaho',
                'Illinois',
                'Indiana',
                'Iowa',
                'Kansas',
                'Kentucky',
                'Louisiana',
                'Maine',
                'Marshall Islands',
                'Maryland',
                'Massachusetts',
                'Michigan',
                'Minnesota',
                'Mississippi',
                'Missouri',
                'Montana',
                'Nebraska',
                'Nevada',
                'New Hampshire',
                'New Jersey',
                'New Mexico',
                'New York',
                'North Carolina',
                'North Dakota',
                'Northern Mariana Islands',
                'Ohio',
                'Oklahoma',
                'Oregon',
                'Palau',
                'Pennsylvania',
                'Puerto Rico',
                'Rhode Island',
                'South Carolina',
                'South Dakota',
                'Tennessee',
                'Texas',
                'Utah',
                'Vermont',
                'Virgin Island',
                'Virginia',
                'Washington',
                'West Virginia',
                'Wisconsin',
                'Wyoming',
            ],
        }
    },
    computed: {
        ...mapGetters({
            getDrawer: 'layout/getDrawer',
            getRightDrawer: 'layout/getRightDrawer'
        }),
        drawer: {
            get() {
                return this.getDrawer
            },
            set(value) {
                this.setDrawer(value)
            }
        },
        rightDrawer: {
            get() {
                return this.getRightDrawer
            },
            set(value) {
                this.setRightDrawer(value)
            }
        }
    },
    watch: {
        search(val) {
            val && val !== this.select && this.querySelections(val)
        }
    },
    created() {
        const token = process.env.apiToken
        console.log('TOKEN!!!', token)
    },
    methods: {
        ...mapActions({
            setDrawer: 'layout/setDrawer',
            setRightDrawer: 'layout/setRightDrawer'
        }),
        querySelections(v) {
            this.loading = true
            // Simulated ajax query
            setTimeout(() => {
                this.items = this.states.filter((e) => {
                    return (e || '').toLowerCase().includes((v || '').toLowerCase())
                })
                this.loading = false
            }, 500)
        },
    }
}
</script>
