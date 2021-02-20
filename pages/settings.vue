<template>
    <div>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="8" md="6">
                <v-card>
                    <v-card-title class="headline">Set Api Tokens</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-subheader>Marketstack.com</v-subheader>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="stockApiToken"
                                    label="set api token for stock requests"
                                    hide-details="auto"
                                    clearable
                                    single-line
                                    outlined
                                />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-tooltip bottom>
                                    <template #activator="{ on }">
                                        <span v-on="on">
                                            <v-checkbox
                                                v-model="stockApiPremiumCheckbox"
                                                label="Premium"
                                            />
                                        </span>
                                    </template>
                                    <span>Premium Key: Provides Intraday market data & real-time updates for 125,000+ tickers.</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-subheader>Rakuten Rapid API</v-subheader>
                            </v-col>
                            <v-col cols="12" md="8">
                                <v-text-field
                                    v-model="rapidApiToken"
                                    label="english.api.rakuten.net Api Key"
                                    hide-details="auto"
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
                        <v-btn color="primary" text @click="setTokens">Set Tokens</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="8" md="6">
                <v-card><v-card>
                    <v-card-title class="headline">Set Exchange</v-card-title>

                    <v-card-text>
                        <v-autocomplete
                            v-model="selectedExchange"
                            :items="exchangeList"
                            :search-input.sync="searchExchange"
                            cache-items
                            clearable
                            class="mx-4"
                            flat
                            hide-no-data
                            hide-details
                            item-text="name"
                            item-value="mic"
                            return-object
                            label="Which exchange are you looking for?"
                            solo-inverted
                        />
                    </v-card-text>

                    <v-divider />

                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="primary" text @click="submitExchange">Set Exchange</v-btn>
                    </v-card-actions>
                </v-card>
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
            stockApiPremiumCheckbox: false,
            rapidApiToken: '',
            searchExchange: null,
            exchange: '',
            exchangeList: []
        }
    },
    computed: {
        ...mapGetters({
            getAllExchanges: 'stock/getAllExchanges',
            getExchange: 'stock/getExchange'
        }),
        selectedExchange: {
            get() {
                return this.getExchange
            },
            set(value) {
                this.exchange = value
            }
        }
    },
    watch: {
        searchExchange(val) {
            val && val !== this.selectedExchange && this.exchangeQuerySelections(val)
        }
    },
    created() {
        this.loadData()
    },
    activated() {
        this.loadData()
    },
    methods: {
        ...mapGetters({
            getStockApiToken: 'getStockApiToken',
            getRapidApiToken: 'getRapidApiToken'
        }),
        ...mapActions({
            setStockApiToken: 'setStockApiToken',
            setRapidApiToken: 'setRapidApiToken',
            setExchange: 'stock/setExchange'
        }),
        loadData() {
            // Setzt aktuellen Tokens in Inputfelder
            this.stockApiToken = this.getStockApiToken()
            this.rapidApiToken = this.getRapidApiToken()

            // Setzt ggf. gespeicherten Exchange in Suche
            this.searchExchange = this.getExchange?.name
        },
        setTokens() {
            this.setStockApiToken(this.stockApiToken)
            this.setRapidApiToken(this.rapidApiToken)
        },
        exchangeQuerySelections(v) {
            this.loading = true
            this.exchangeList = this.getAllExchanges.filter((e) => {
                return (e.name || '').toLowerCase().includes((v || '').toLowerCase())
            })
            this.loading = false
        },
        submitExchange() {
            this.setExchange(this.exchange)
        }
    }
}
</script>
