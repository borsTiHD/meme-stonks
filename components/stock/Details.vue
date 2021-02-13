<template>
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
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            getCurrentStock: 'stock/getCurrentStock',
            getExchange: 'stock/getExchange'
        }),
        stock() {
            if (!this.getCurrentStock) {
                return { name: '', symbol: '' }
            }
            return this.getCurrentStock
        }
    }
}
</script>
