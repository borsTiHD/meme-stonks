<template>
    <v-tooltip bottom>
        <template #activator="{ on, attrs }">
            <v-sheet
                rounded="lg"
                class="d-flex align-content-center px-2 font-weight-black subtitle-1 pointer"
                :color="color() + ' lighten-1'"
                v-bind="attrs"
                v-on="on"
                @click="showPercentage = !showPercentage"
            >
                <v-icon
                    :color="color() + ' darken-3'"
                    class="align-self-center"
                >
                    {{ icon() }}
                </v-icon>
                <span
                    :class="color() + '--text text--darken-3'"
                    class="align-self-center"
                >
                    {{ showPercentage ? percentageIncrease()+' %' : valueIncrease()+' €' }}
                </span>
            </v-sheet>
        </template>
        <span>Click to change</span>
    </v-tooltip>
</template>

<script>
export default {
    props: {
        openingValue: {
            type: Number,
            required: true,
            default: 0
        },
        closingValue: {
            type: Number,
            required: true,
            default: 0
        },
    },
    data() {
        return {
            showPercentage: true
        }
    },
    methods: {
        color() {
            if (this.openingValue < this.closingValue) {
                return 'green'
            }
            return 'red'
        },
        icon() {
            if (this.openingValue < this.closingValue) {
                return 'mdi-menu-up'
            }
            return 'mdi-menu-down'
        },
        percentageIncrease() {
            if (this.openingValue === 0 && this.closingValue === 0) return 0

            // Absolute Erhöhung in Prozent bestimmen
            const diff = this.closingValue - this.openingValue
            const percentage = Math.round(((diff / this.closingValue) * 100) * 100) / 100 // Runden auf zwei Nachkommastellen: 'Math.round(217.4325 * 100) / 100'

            /*
            console.log('Closing:', this.closingValue)
            console.log('Opening:', this.openingValue)
            console.log('Diff:', diff)
            console.log('Percentage:', percentage)
            */

            return percentage
        },
        valueIncrease() {
            if (this.openingValue === 0 && this.closingValue === 0) return 0
            const diff = this.closingValue - this.openingValue
            return Math.round(diff * 100) / 100
        }
    }
}
</script>

<style scoped>
.pointer {
    cursor: pointer;
}
</style>
