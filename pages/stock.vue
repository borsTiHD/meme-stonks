<template>
    <v-row>
        <v-col cols="12" md="4" class="d-flex flex-column">
            <v-card class="flex d-flex flex-column">
                <v-card-title class="headline">Details</v-card-title>
                <v-card-text>
                    <v-row dense>
                        <v-col class="pb-0">
                            <div class="d-flex flex-row">
                                <div class="font-weight-medium">Name:</div>
                                <div class="pl-2">
                                    {{ stock.name }}
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col class="pb-0">
                            <div class="d-flex flex-row">
                                <div class="font-weight-medium">Symbol:</div>
                                <div class="pl-2">
                                    {{ stock.symbol }}
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="4" class="d-flex flex-column">
            <v-card class="flex d-flex flex-column">
                <v-card-title class="headline">Object</v-card-title>
                <v-card-text>
                    {{ stock }}
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="4" class="d-flex flex-column">
            <latest-days-chart
                :loading-data="loadingData"
                :stock-data="stockData"
            />
        </v-col>
        <v-col cols="12" class="d-flex flex-column">
            <big-line-chart
                :loading-data="loadingData"
                :stock-data="stockData"
            />
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

import LatestDaysChart from '~/components/stock/LatestDaysChart.vue'
import BigLineChart from '~/components/stock/BigLineChart.vue'

export default {
    components: {
        LatestDaysChart,
        BigLineChart
    },
    data() {
        return {
            stockData: null,
            loadingData: false,
            daysSelect: [2, 7, 14, 30, 60],
            days: 30
        }
    },
    computed: {
        ...mapGetters({
            getApiToken: 'getApiToken',
            getBaseUrl: 'getBaseUrl',
            getCurrentStock: 'stock/getCurrentStock',
            getExchange: 'stock/getExchange'
        }),
        stock() {
            if (!this.getCurrentStock) {
                return { name: '', symbol: '' }
            }
            return this.getCurrentStock
        }
    },
    watch: {
        // Fetcht neue Daten wenn Stock geändert wird
        getCurrentStock() {
            this.fetchData()
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            // Fetcht keine Daten, wenn keine Aktie ausgewählt wurde
            if (!this.getCurrentStock) {
                this.stockData = {}
                return false
            }

            this.loadingData = true

            const params = {
                access_key: this.getApiToken,
                exchange: this.getExchange,
                sort: 'ASC',
                limit: 1000
            }

            const symbol = this.getCurrentStock.symbol
            const url = `${this.getBaseUrl}/tickers/${symbol}/eod`
            // const url = 'http://api.marketstack.com/v1/intraday'

            this.$axios.get(url, { params })
                .then((res) => {
                    const stockData = res.data.data
                    console.log('[APP] -> Stock Data:', stockData)
                    this.stockData = stockData
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.loadingData = false
                })
        }
    }
}
</script>
