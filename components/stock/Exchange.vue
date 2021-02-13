<template>
    <v-card class="flex d-flex flex-column">
        <v-card-title class="headline">Exchange</v-card-title>
        <v-card-text>
            <v-row dense class="text-no-wrap">
                <v-col col="12" lg="6" class="pb-0">
                    <div class="d-flex flex-row">
                        <div class="font-weight-medium">Name:</div>
                        <div class="pl-2">
                            {{ exchange.name }}
                        </div>
                    </div>
                </v-col>
                <v-col col="12" lg="6" class="pb-0">
                    <div class="d-flex flex-row">
                        <div class="font-weight-medium">Currency:</div>
                        <div class="pl-2">
                            {{ `${exchange.currency.symbol} (${exchange.currency.code})` }}
                        </div>
                    </div>
                </v-col>
                <v-col col="12" lg="6" class="pb-0">
                    <div class="d-flex flex-row">
                        <div class="font-weight-medium">MIC identification:</div>
                        <div class="pl-2">
                            {{ exchange.mic }}
                        </div>
                    </div>
                </v-col>
                <v-col col="12" lg="6" class="pb-0">
                    <div class="d-flex flex-row">
                        <div class="font-weight-medium">Country:</div>
                        <div class="pl-2">
                            {{ exchange.country }}
                        </div>
                    </div>
                </v-col>
                <v-col col="12" lg="6" class="pb-0">
                    <div class="d-flex flex-row">
                        <div class="font-weight-medium">Timezone:</div>
                        <div class="pl-2">
                            {{ `${exchange.timezone.abbr_dst} (${exchange.timezone.timezone})` }}
                        </div>
                    </div>
                </v-col>
                <v-col col="12" lg="6" class="pb-0">
                    <div class="d-flex flex-row">
                        <div class="font-weight-medium">Website:</div>
                        <div class="pl-2">
                            {{ exchange.website }}
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
            getExchange: 'stock/getExchange'
        }),
        exchange() {
            if (!this.getExchange) {
                return { name: '', currency: { symbol: '', code: '' }, mic: '', country: '', timezone: { abbr_dst: '', timezone: '' }, website: '' }
            }
            return this.getExchange
        }
    }
}
</script>
