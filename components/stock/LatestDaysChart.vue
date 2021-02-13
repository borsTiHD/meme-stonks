<template>
    <v-card
        class="flex d-flex flex-column"
        :color="stockProperties().color"
        dark
    >
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
                <v-col class="d-flex flex-sm-row justify-end">
                    <v-icon
                        large
                        :color="stockProperties().color + ' darken-3'"
                        class="align-self-center"
                    >
                        {{ stockProperties().icon }}
                    </v-icon>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
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
            return data.slice(length-limit, length).map((v) => {
                // const midpoint = (v.high + v.low) / 2 // Errechnet den Mittelpunkt vom Höchst-/Tiefstwert
                return v.close
            })
        },
        stockProperties() {
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
