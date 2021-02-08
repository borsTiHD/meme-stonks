<template>
    <v-row>
        <v-col cols="12" md="6" class="d-flex flex-column">
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
        <v-col cols="12" md="6" class="d-flex flex-column">
            <v-card class="flex d-flex flex-column">
                <v-card-title class="headline">Object</v-card-title>
                <v-card-text>
                    {{ stock }}
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" class="d-flex flex-column">
            <v-card class="flex d-flex flex-column" color="green" dark>
                <v-card-text>
                    <v-progress-linear
                        v-if="loadingData"
                        indeterminate
                        color="white"
                    />
                    <v-sheet v-else color="rgba(0, 0, 0, .12)">
                        <v-sparkline
                            :value="stockValue"
                            line-width="1"
                            color="rgba(255, 255, 255, .7)"
                            height="100"
                            stroke-linecap="round"
                            smooth
                        />
                    </v-sheet>
                </v-card-text>

                <v-card-text>
                    <div class="display-1 font-weight-thin">Latest data</div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            stockData: null,
            loadingData: false
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
            if (!Array.isArray(this.stockData.eod)) return [0]
            return this.stockData.eod.map((v) => {
                // Errechnet den Mittelpunkt vom Höchst-/Tiefstwert
                // const midpoint = (v.high + v.low) / 2
                return v.close
            })
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
        }
    }
}
</script>
