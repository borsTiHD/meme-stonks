<template>
    <v-app-bar clipped-left fixed app>
        <v-btn icon @click.stop="drawer = !drawer">
            <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-toolbar-title style="cursor: pointer" @click="$router.push('/')" v-text="title" />
        <v-spacer />
        <v-autocomplete
            v-model="selectedStock"
            :loading="fetching ? true : loading"
            :disabled="fetching"
            :items="getCurrentStocks"
            :filter="stockFilter"
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
        >
            <template slot="selection" slot-scope="data">
                <!-- HTML that describe how select should render selected items -->
                {{ data.item.name }} - {{ data.item.symbol }}
            </template>
            <template slot="item" slot-scope="data">
                <!-- HTML that describe how select should render items when the select is open -->
                {{ data.item.name }} - {{ data.item.symbol }}
            </template>
        </v-autocomplete>
        <v-spacer />
        <v-btn icon @click.stop="rightDrawer = !rightDrawer">
            <v-icon>mdi-cogs</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import pkg from './../../package.json'
export default {
    props: {
        fetching: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            title: `${pkg.productName}`,
            loading: false
        }
    },
    computed: {
        ...mapGetters({
            getDrawer: 'layout/getDrawer',
            getRightDrawer: 'layout/getRightDrawer',
            getCurrentStock: 'stock/getCurrentStock',
            getStocks: 'stock/getStocks',
            getExchange: 'stock/getExchange'
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
        },
        getCurrentStocks() {
            const exchange = this.getExchange
            const stocks = this.getStocks(exchange?.mic)
            if (stocks) {
                return stocks
            }
            return []
        }
    },
    methods: {
        ...mapActions({
            setDrawer: 'layout/setDrawer',
            setRightDrawer: 'layout/setRightDrawer',
            setCurrentStock: 'stock/setCurrentStock'
        }),
        stockFilter(item, queryText, itemText) {
            // Filtert welche Items im DropDown angezeigt werden sollen
            const name = item?.name?.toLowerCase()
            const symbol = item?.symbol?.toLowerCase()
            const search = queryText?.toLowerCase()
            return name?.includes(search) || symbol?.includes(search)
        }
    }
}
</script>
