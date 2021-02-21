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

        <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            :elevation="snackbar.elevation"
        >
            {{ snackbar.text }}
            <template #action="{ attrs }">
                <v-btn
                    :color="snackbar.btnColor"
                    text
                    v-bind="attrs"
                    @click="snackbar.show = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
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
            exchangeList: [],
            snackbar: {
                show: false,
                text: 'Lorem ipsum dolor sit amet',
                color: '',
                btnColor: 'primary',
                elevation: 24
            }
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
        },
        getExchange() {
            // Wurde ein API Key gesetzt, bewirkt die Beobachtung das Setzen der Börse in der Auswahl
            this.exchangeList = this.getAllExchanges
            this.selectedExchange = this.getExchange
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
            getStockApiTokenPremium: 'getStockApiTokenPremium',
            getRapidApiToken: 'getRapidApiToken'
        }),
        ...mapActions({
            setStockApiToken: 'setStockApiToken',
            setStockApiTokenPremium: 'setStockApiTokenPremium',
            setRapidApiToken: 'setRapidApiToken',
            setExchange: 'stock/setExchange'
        }),
        loadData() {
            // Setzt aktuelle Tokens in Inputfelder
            this.stockApiToken = this.getStockApiToken()
            this.stockApiPremiumCheckbox = this.getStockApiTokenPremium()
            this.rapidApiToken = this.getRapidApiToken()

            // Setzt ggf. gespeicherten Exchange in Suche
            this.searchExchange = this.getExchange?.name
        },
        setTokens() {
            this.setStockApiToken(this.stockApiToken)
            this.setStockApiTokenPremium(this.stockApiPremiumCheckbox)
            this.setRapidApiToken(this.rapidApiToken)
            this.snackbar.text = 'Set api keys...' // User Feedback
            this.snackbar.show = true // User Feedback
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
            this.snackbar.text = 'Set stock exchange...' // User Feedback
            this.snackbar.show = true // User Feedback
        }
    }
}
</script>
