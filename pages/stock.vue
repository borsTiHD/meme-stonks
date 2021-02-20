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
        <!--
        <v-col cols="12" class="d-flex flex-column">
            <news />
        </v-col>
        -->
    </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

import StockDetails from '~/components/stock/Details.vue'
import ExchangeDetails from '~/components/stock/Exchange.vue'
import LatestDaysChart from '~/components/stock/LatestDaysChart.vue'
import BigLineChart from '~/components/stock/BigLineChart.vue'
// import News from '~/components/stock/News.vue'

export default {
    components: {
        StockDetails,
        ExchangeDetails,
        LatestDaysChart,
        BigLineChart
        // News
    },
    middleware: 'checkApiKey',
    data() {
        return {
            loadingData: false
        }
    },
    computed: {
        ...mapGetters({
            getCurrentStock: 'stock/getCurrentStock',
            getStockData: 'stock/getStockData'
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
        async getCurrentStock() {
            // Fetcht neue Daten wenn Stock geändert wird
            this.fetchStockData()
        }
    },
    created() {
        this.fetchStockData()
    },
    activated() {
        this.fetchStockData()
    },
    methods: {
        async fetchStockData() {
            // Fetcht Stock Daten
            this.loadingData = true
            await this.$apiCalls.fetchStockData().catch((err) => {
                console.error(err)
            })
            this.loadingData = false
        }
    }
}
</script>
