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
            <v-card
                class="flex d-flex flex-column"
                :color="stockPropertiesLastDays().color"
                dark
            >
                <v-card-text>
                    <v-progress-linear
                        v-if="loadingData"
                        indeterminate
                        color="white"
                    />
                    <v-sheet v-else color="rgba(0, 0, 0, .12)">
                        <v-sparkline
                            :value="stockValueLastDays()"
                            line-width="1"
                            color="rgba(255, 255, 255, .7)"
                            stroke-linecap="round"
                            smooth
                        />
                    </v-sheet>
                </v-card-text>

                <v-card-text>
                    <v-row class="display-1 font-weight-thin">
                        <v-col class="d-flex flex-sm-row">
                            <span>Latest</span>
                            <v-select
                                v-model="days"
                                :items="daysSelect"
                                class="mx-3"
                                width="0"
                                hide-details
                                autowidth
                                dense
                                solo
                            />
                            <span>days</span>
                        </v-col>
                        <v-col class="d-flex flex-sm-row justify-end">
                            <v-icon
                                large
                                :color="stockPropertiesLastDays().color + ' darken-3'"
                                class="align-self-center"
                            >
                                {{ stockPropertiesLastDays().icon }}
                            </v-icon>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" class="d-flex flex-column">
            <v-card class="flex d-flex flex-column">
                <v-card-text>
                    <v-progress-linear
                        v-if="loadingData"
                        indeterminate
                        color="white"
                    />
                    <stock-line-chart
                        v-else
                        :chart-data="stockValue"
                        :chart-labels="stockLabels"
                        :line-color="chartColor"
                    />
                </v-card-text>

                <v-card-text>
                    <div class="display-1 font-weight-thin">Last Year</div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

import StockLineChart from '~/components/charts/StockLineChart.vue'

export default {
    components: {
        StockLineChart
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
            getDrawer: 'layout/getDrawer',
            getRightDrawer: 'layout/getRightDrawer',
            getApiToken: 'getApiToken',
            getCurrentStock: 'stock/getCurrentStock',
            getExchange: 'stock/getExchange'
        }),
        stock() {
            if (!this.getCurrentStock) {
                return { name: '', symbol: '' }
            }
            return this.getCurrentStock
        },
        stockValue() {
            const data = this.stockData?.eod
            if (!Array.isArray(data)) return []
            return data.map((v) => {
                // const midpoint = (v.high + v.low) / 2 // Errechnet den Mittelpunkt vom Höchst-/Tiefstwert
                return v.close
            })
        },
        stockLabels() {
            const data = this.stockData?.eod
            if (!Array.isArray(data)) return []
            return data.map((v) => {
                // return v.date
                return moment(v.date).format('YYYY.MM.DD')
            })
        },
        chartColor() {
            const data = this.stockData?.eod
            if (!Array.isArray(data)) return '#ffffffb3'

            // Ermittelt Data
            const length = data.length
            const firstData = data[0]
            const lastData = data[length-1]

            // Vergleicht 'Opening' mit 'Closing' Data
            if (firstData.open < lastData.close) {
                return '#03fc62'
            } else {
                return '#cc2929'
            }
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
                this.stockData = []
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
            const url = `http://api.marketstack.com/v1/tickers/${symbol}/eod`
            // const url = 'http://api.marketstack.com/v1/intraday'

            this.$axios.get(url, { params })
                .then((res) => {
                    const stockData = res.data.data
                    console.log('Stock Data:', stockData)
                    this.stockData = stockData
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.loadingData = false
                })
        },
        stockValueLastDays() {
            const limit = this.days
            const data = this.stockData?.eod
            if (!Array.isArray(data)) return []
            const length = data.length
            return data.slice(length-limit, length).map((v) => {
                // const midpoint = (v.high + v.low) / 2 // Errechnet den Mittelpunkt vom Höchst-/Tiefstwert
                return v.close
            })
        },
        stockLabelsLastDays() {
            const limit = this.days
            const data = this.stockData?.eod
            if (!Array.isArray(data)) return []
            const length = data.length
            return data.slice(length-limit, length).map((v) => {
                // return v.date
                return moment(v.date).format('YYYY.MM.DD')
            })
        },
        stockPropertiesLastDays() {
            const limit = this.days
            const data = this.stockData?.eod
            if (!Array.isArray(data)) return { color: '', icon: 'mdi-arrow-left-right' }

            // Ermittelt Data
            const length = data.length
            const firstData = data[length-limit]
            const lastData = data[length-1]

            // Vergleicht 'Opening' mit 'Closing' Data
            if (firstData.open < lastData.close) {
                return { color: 'green', icon: 'mdi-arrow-top-right' }
            } else {
                return { color: 'red', icon: 'mdi-arrow-bottom-right' }
            }
        }
    }
}
</script>
