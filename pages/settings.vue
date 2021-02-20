<template>
    <div>
        <v-row justify="center" align="center">
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title class="headline">Set Api Token</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="4">
                                <v-subheader>Marketstack.com</v-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-model="stockApiToken"
                                    label="Marketstack.com Api Key"
                                    clearable
                                    single-line
                                    outlined
                                />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="4">
                                <v-subheader>Rakuten Rapid API</v-subheader>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field
                                    v-model="rapidApiToken"
                                    label="english.api.rakuten.net Api Key"
                                    clearable
                                    single-line
                                    outlined
                                />
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-divider />

                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="primary" text @click="setToken">Set Token</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="center" align="center">
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title class="headline">Exchange</v-card-title>
                    <v-card-text>
                        <p>BÖRSE AUSWAHL</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            stockApiToken: '',
            rapidApiToken: ''
        }
    },
    computed: {
        ...mapGetters({
            getRightDrawer: 'layout/getRightDrawer',
            getAllExchanges: 'stock/getAllExchanges',
            getExchange: 'stock/getExchange'
        })
    },
    created() {
        this.loadData()
    },
    activated() {
        this.loadData()
    },
    methods: {
        ...mapGetters({
            getApiToken: 'getApiToken',
            getRapidApiToken: 'getRapidApiToken'
        }),
        ...mapActions({
            setApiToken: 'setApiToken',
            setRapidApiToken: 'setRapidApiToken'
        }),
        loadData() {
            // Setzt aktuellen Tokens in Inputfelder
            this.stockApiToken = this.getApiToken()
            this.rapidApiToken = this.getRapidApiToken()
        },
        setToken() {
            this.setApiToken(this.stockApiToken)
            this.setRapidApiToken(this.rapidApiToken)
        }
    }
}
</script>
