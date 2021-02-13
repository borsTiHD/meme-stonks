<template>
    <v-card class="flex d-flex flex-column">
        <v-card-text>
            <v-progress-linear v-if="loadingData" indeterminate color="white" />
            <stock-line-chart
                v-else
                :chart-data="stockValue"
                :chart-labels="stockLabels"
                :line-color="chartColor.line"
                :bg-color="chartColor.bg"
            />
        </v-card-text>

        <v-card-text>
            <div class="display-1 font-weight-thin">Last Year Performance</div>
        </v-card-text>
    </v-card>
</template>

<script>
import moment from 'moment'
import StockLineChart from '~/components/charts/StockLineChart.vue'

export default {
    components: {
        StockLineChart
    },
    props: {
        stockData: {
            type: Object,
            required: true,
            default: () => {
                return {}
            }
        },
        loadingData: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed: {
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
            if (!Array.isArray(data)) return { line: '#ffffffb3', bg: '#FFFFFF1A' }

            // Ermittelt Data
            const length = data.length
            const firstData = data[0]
            const lastData = data[length-1]

            // Vergleicht 'Opening' mit 'Closing' Data
            if (firstData.open < lastData.close) {
                return { line: '#03fc62', bg: '#03fc621A' } // 'bg' ist 10% transparency
            } else {
                return { line: '#cc2929', bg: '#cc29291A' } // 'bg' ist 10% transparency
            }
        }
    }
}
</script>
