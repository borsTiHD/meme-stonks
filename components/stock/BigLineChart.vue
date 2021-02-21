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
            <v-row dense>
                <v-col class="pb-0">
                    <div class="d-flex">
                        <div class="align-self-center mr-auto display-1 font-weight-thin">{{ performanceText }}</div>
                        <div class="align-self-center">
                            <v-menu
                                ref="startDate"
                                v-model="startDate.dateMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template #activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="startDate.date"
                                        label="Start Date"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    />
                                </template>
                                <v-date-picker
                                    v-model="startDate.date"
                                    no-title
                                    scrollable
                                    :min="minDate"
                                    :max="maxDate"
                                    @input="startDate.dateMenu = false"
                                />
                            </v-menu>
                        </div>
                        <div class="align-self-center ml-2">
                            <v-menu
                                ref="endDate"
                                v-model="endDate.dateMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template #activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="endDate.date"
                                        label="End Date"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    />
                                </template>
                                <v-date-picker
                                    v-model="endDate.date"
                                    no-title
                                    scrollable
                                    :min="minDate"
                                    :max="maxDate"
                                    @input="endDate.dateMenu = false"
                                />
                            </v-menu>
                        </div>
                        <div class="align-self-center ml-2">
                            <!-- <v-btn small outlined @click="changeDate(1, 'days')">1D</v-btn> -->
                            <v-btn small outlined @click="changeDate(1, 'week')">1W</v-btn>
                            <v-btn small outlined @click="changeDate(1, 'months')">1M</v-btn>
                            <v-btn small outlined @click="changeDate(6, 'months')">6M</v-btn>
                            <v-btn small outlined @click="changeDate(1, 'years')">1J</v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row>
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
    data() {
        return {
            periodText: null,
            startDate: {
                dateMenu: false,
                date: null
            },
            endDate: {
                dateMenu: false,
                date: null
            },
            minDate: moment(new Date()).subtract(1, 'years').format('YYYY-MM-DD'),
            maxDate: moment(new Date()).format('YYYY-MM-DD')
        }
    },
    computed: {
        stockValue() {
            const data = this.filteredData()
            if (!Array.isArray(data) || data.length === 0) return []
            return data.map((v) => {
                // const midpoint = (v.high + v.low) / 2 // Errechnet den Mittelpunkt vom Höchst-/Tiefstwert
                return v.close
            })
        },
        stockLabels() {
            const data = this.filteredData()
            if (!Array.isArray(data) || data.length === 0) return []
            return data.map((v) => {
                // return v.date
                return moment(v.date).format('YYYY.MM.DD')
            })
        },
        chartColor() {
            const data = this.filteredData()
            if (!Array.isArray(data) || data.length === 0) return { line: '#ffffffb3', bg: '#FFFFFF1A' }

            // Ermittelt Data
            const length = data.length
            const firstData = data[0]
            const lastData = data[length - 1]

            // Vergleicht 'Opening' mit 'Closing' Data
            if (firstData.open < lastData.close) {
                return { line: '#03fc62', bg: '#03fc621A' } // 'bg' ist 10% transparency
            } else {
                return { line: '#cc2929', bg: '#cc29291A' } // 'bg' ist 10% transparency
            }
        },
        performanceText() {
            return `Last ${this.periodText} Performance`
        }
    },
    created() {
        // Setzt Start- / Enddatum
        this.startDate.date = moment(new Date()).subtract(1, 'years').format('YYYY-MM-DD')
        this.endDate.date = moment(new Date()).format('YYYY-MM-DD')

        // Setzt Text Zeitraum
        this.periodText = 'Year'
    },
    methods: {
        filteredData() {
            // Start- und Enddatum, sowie Stock Daten
            const startDate = this.startDate.date
            const endDate = this.endDate.date
            const data = this.stockData?.eod

            // Filtert Daten herraus, die sich innerhalb des gesetzten Zeitraums befinden
            if (!data || data.length === 0) return []
            return data.filter((eod) => {
                return moment(eod?.date).isBetween(startDate, endDate, undefined, '[]')
            })
        },
        changeDate(quantity, type) {
            // Setzt Start- / Enddatum
            this.startDate.date = moment(new Date()).subtract(quantity, type).format('YYYY-MM-DD')
            this.endDate.date = moment(new Date()).format('YYYY-MM-DD')

            // Ändert Text Zeitraum
            switch (type) {
                case 'week':
                    this.periodText = 'Week'
                    break

                case 'months':
                    this.periodText = quantity > 1 ? `${quantity} Months` : 'Month'
                    break

                case 'years':
                    this.periodText = 'Year'
                    break

                default:
                    this.periodText = 'Year'
                    break
            }
        }
    }
}
</script>
