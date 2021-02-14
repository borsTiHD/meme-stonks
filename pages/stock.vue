<template>
    <v-row>
        <v-col cols="12" class="d-flex flex-column">
            <stock-details />
        </v-col>
        <v-col cols="12" md="6" class="d-flex flex-column">
            <exchange-details />
        </v-col>
        <v-col cols="12" md="6" class="d-flex flex-column">
            <latest-days-chart :loading-data="loadingData" :stock-data="getCurrentStockData" />
        </v-col>
        <v-col cols="12" class="d-flex flex-column">
            <big-line-chart :loading-data="loadingData" :stock-data="getCurrentStockData" />
        </v-col>
        <v-col cols="12" class="d-flex flex-column">
            <news />
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import StockDetails from '~/components/stock/Details.vue'
import ExchangeDetails from '~/components/stock/Exchange.vue'
import LatestDaysChart from '~/components/stock/LatestDaysChart.vue'
import BigLineChart from '~/components/stock/BigLineChart.vue'
import News from '~/components/stock/News.vue'

export default {
    components: {
        StockDetails,
        ExchangeDetails,
        LatestDaysChart,
        BigLineChart,
        News
    },
    data() {
        return {
            loadingData: false
        }
    },
    computed: {
        ...mapGetters({
            getApiToken: 'getApiToken',
            getBaseUrl: 'getBaseUrl',
            getCurrentStock: 'stock/getCurrentStock',
            getStockData: 'stock/getStockData',
            getExchange: 'stock/getExchange'
        }),
        getCurrentStockData() {
            // Kein Current Stock, werden keine Daten zurück gegeben
            if (!this.getCurrentStock) {
                return {}
            }
            return this.getStockData(this.getCurrentStock.name)
        }
    },
    watch: {
        // Fetcht neue Daten wenn Stock geändert wird
        getCurrentStock() {
            this.fetchStockData().catch(() => {
                // console.error(err)
                this.loadingData = false
            })
        }
    },
    methods: {
        ...mapActions({
            addStockData: 'stock/addStockData'
        }),
        fetchStockData() {
            return new Promise((resolve, reject) => {
                console.log('[App] -> Fetching Stock Data')

                // Fetcht keine Daten, wenn keine Aktie ausgewählt wurde
                if (!this.getCurrentStock) {
                    return reject(new Error('No Stock Selected'))
                }

                // Gibt es bereits Stock Data, wird nicht gefetcht
                if (this.getCurrentStockData) {
                    return resolve(true)
                }

                this.loadingData = true

                const params = {
                    access_key: this.getApiToken,
                    exchange: this.getExchange.mic,
                    sort: 'ASC',
                    limit: 1000
                }

                const symbol = this.getCurrentStock.symbol
                const url = `${this.getBaseUrl}/tickers/${symbol}/eod`

                this.$axios.get(url, { params })
                    .then((res) => {
                        const stockData = res.data.data
                        console.log('[APP] -> Stock Data:', stockData)
                        this.addStockData(stockData)
                        this.loadingData = false
                    }).catch((error) => {
                        console.log(error)
                        this.loadingData = false
                        return reject(error)
                    }).finally(() => {
                        this.loadingData = false
                        return resolve(true)
                    })
            })
        }
    }
}
</script>
