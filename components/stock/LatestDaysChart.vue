<template>
    <v-card class="flex d-flex flex-column" :color="color()" dark>
        <v-card-text>
            <v-progress-linear v-if="loadingData" indeterminate color="white" />
            <v-sheet v-else color="rgba(0, 0, 0, .12)">
                <v-sparkline
                    :value="stockValue()"
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
                <v-col
                    v-if="openingValue() !== 0 && closingValue() !== 0"
                    class="d-flex flex-sm-row justify-end"
                >
                    <percentage-sheet
                        :opening-value="openingValue()"
                        :closing-value="closingValue()"
                    />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import PercentageSheet from '~/components/display/PercentageSheet.vue'

export default {
    components: {
        PercentageSheet
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
    data() {
        return {
            daysSelect: [2, 7, 14, 30, 60],
            days: 30
        }
    },
    methods: {
        stockValue() {
            const limit = this.days
            const data = this.stockData?.eod
            if (!Array.isArray(data)) return []
            const length = data.length
            return data.slice(length-limit, length).map((v, index) => {
                // const midpoint = (v.high + v.low) / 2 // Errechnet den Mittelpunkt vom Höchst-/Tiefstwert
                if (index === 0) {
                    return v.open // Erstes Item bekommt Opening Wert!
                }
                return v.close // Jeder nachfolgende Tage bekommt Closing Wert
            })
        },
        color() {
            if (this.openingValue() < this.closingValue()) {
                return 'green'
            }
            return 'red'
        },
        openingValue() {
            const limit = this.days
            const data = this.stockData?.eod
            if (!Array.isArray(data)) return 0

            const length = data.length
            const firstData = data[length-limit]
            return firstData?.open
        },
        closingValue() {
            const data = this.stockData?.eod
            if (!Array.isArray(data)) return 0

            const length = data.length
            const lastData = data[length-1]
            return lastData?.close
        }
    }
}
</script>