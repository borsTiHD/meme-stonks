<template>
    <v-row>
        <v-col cols="12" sm="8" md="6" class="d-flex flex-column">
            <v-card class="flex d-flex flex-column">
                <v-card-title class="headline">Details</v-card-title>
                <v-card-text>
                    <v-row dense>
                        <v-col class="pb-0">
                            <div class="d-flex flex-row">
                                <div class="font-weight-medium">Name:</div>
                                <div class="pl-2">
                                    {{ getCurrentStock.name }}
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col class="pb-0">
                            <div class="d-flex flex-row">
                                <div class="font-weight-medium">Symbol:</div>
                                <div class="pl-2">
                                    {{ getCurrentStock.symbol }}
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" sm="8" md="6" class="d-flex flex-column">
            <v-card class="flex d-flex flex-column">
                <v-card-title class="headline">Object</v-card-title>
                <v-card-text>
                    {{ getCurrentStock }}
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            getDrawer: 'layout/getDrawer',
            getRightDrawer: 'layout/getRightDrawer',
            getCurrentStock: 'stock/getCurrentStock'
        })
    }
}
</script>
