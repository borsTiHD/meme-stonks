<template>
    <v-card class="flex d-flex flex-column" :color="color()" dark>
        <v-progress-linear v-if="loadingData" indeterminate color="white" />
        <v-card-text v-else class="pb-0">
            <v-row>
                <v-col>
                    <v-sheet color="rgba(0, 0, 0, .12)">
                        <v-sparkline
                            :value="stockValue()"
                            line-width="1"
                            color="rgba(255, 255, 255, .7)"
                            stroke-linecap="round"
                            smooth
                        />
                    </v-sheet>
                </v-col>
            </v-row>
            <v-row :class="'text-subtitle-1 ' + color() + '--text text--darken-4'">
                <v-col class="d-flex flex-sm-row pa-0 px-2">
                    <span>{{ openingValue() + ' ' + currency }}</span>
                </v-col>
                <v-col class="d-flex flex-sm-row pa-0 px-2 justify-end">
                    <span>{{ closingValue() + ' ' + currency }}</span>
                </v-col>
            </v-row>
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
                <v-col v-if="openingValue() !== 0 && closingValue() !== 0" class="d-flex flex-sm-row justify-end">
                    <percentage-sheet :opening-value="openingValue()" :closing-value="closingValue()" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
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
    computed: {
        ...mapGetters({
            getExchange: 'stock/getExchange'
        }),
        currency() {
            return this.getExchange?.currency?.symbol || ''
        }
    },
    methods: {
        filteredData() {
            // Wochentag zur Berechnung Anzahl Tage
            const weekDay = moment(Date.now()).isoWeekday()
            let days = null

            // Auswahl 2 Tage oder weniger wird der Wochentag geprüft
            // Daruch erhält man Samstags und Sonntags die Daten von "Do-Fr"
            if (this.days <= 2 && weekDay === 6) {
                // Samstag
                days = 2
            } else if (this.days <= 2 && weekDay === 7) {
                // Sonntag
                days = 3
            } else {
                // Montag bis Freitag
                days = this.days - 1 // Auswahl minus 1 Tag, weil der Heutige Tag mit dazu zählt
            }

            // Ermittelt Start- und Enddatum, sowie Stock Daten
            const startDate = moment(Date.now()).subtract(days, 'days').format('YYYY-MM-DD')
            const endDate = moment(Date.now()).format('YYYY-MM-DD')
            const data = this.stockData?.eod

            // Filtert Daten herraus, die sich innerhalb des gesetzten Zeitraums befinden
            if (!data) return []
            return data.filter((eod) => {
                return moment(eod?.date).isBetween(startDate, endDate, undefined, '[]')
            })
        },
        stockValue() {
            const data = this.filteredData()
            const length = data.length
            if (!Array.isArray(data) || length === 0) return []
            return data.map((v, index) => {
                // const midpoint = (v.high + v.low) / 2 // Errechnet den Mittelpunkt vom Höchst-/Tiefstwert
                if (index === 0) {
                    return v.open // Erstes Item bekommt Opening Wert!
                }
                return v.close // Jeder nachfolgende Tage bekommt Closing Wert
            })
        },
        openingValue() {
            const data = this.filteredData()
            const length = data.length
            if (!Array.isArray(data) || length === 0) return 0
            return data[0]?.open || 0
        },
        closingValue() {
            const data = this.filteredData()
            const length = data.length
            if (!Array.isArray(data) || length === 0) return 0
            return data[length - 1]?.close || 0
        },
        color() {
            if (this.openingValue() === 0 && this.closingValue() === 0) return ''
            if (this.openingValue() < this.closingValue()) {
                return 'green'
            }
            return 'red'
        }
    }
}
</script>
