<template>
    <v-app-bar clipped-left fixed app>
        <v-btn icon @click.stop="drawer = !drawer">
            <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-toolbar-title v-text="title" />
        <v-spacer />
        <v-autocomplete
            v-model="selectedStock"
            :loading="fetching ? true : loading"
            :disabled="fetching"
            :items="items"
            :search-input.sync="search"
            cache-items
            clearable
            class="mx-4"
            flat
            hide-no-data
            hide-details
            item-text="name"
            item-value="symbol"
            return-object
            label="Which stock are you looking for?"
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
    props: {
        'fetching': {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            title: `${pkg.productName}`,
            loading: false,
            items: [],
            search: null
        }
    },
    computed: {
        ...mapGetters({
            getDrawer: 'layout/getDrawer',
            getRightDrawer: 'layout/getRightDrawer',
            getCurrentStock: 'stock/getCurrentStock',
            getStocks: 'stock/getStocks'
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
        },
        selectedStock: {
            get() {
                return this.getCurrentStock
            },
            set(value) {
                this.setCurrentStock(value)
            }
        }
    },
    watch: {
        search(val) {
            val && val !== this.selectedStock && this.querySelections(val)
        }
    },
    methods: {
        ...mapActions({
            setDrawer: 'layout/setDrawer',
            setRightDrawer: 'layout/setRightDrawer',
            setCurrentStock: 'stock/setCurrentStock'
        }),
        querySelections(v) {
            this.loading = true
            this.items = this.getStocks.filter((e) => {
                return (e.name || '').toLowerCase().includes((v || '').toLowerCase())
            })
            this.loading = false

            /*
            // Simulated ajax query
            setTimeout(() => {
                this.items = this.stocks.filter((e) => {
                    return (e.name || '').toLowerCase().includes((v || '').toLowerCase())
                })
                this.loading = false
            }, 500)
            */
        },
    }
}
</script>
