<template>
    <div>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="8" md="6">
                <v-card>
                    <v-card-title class="headline">Set Api Token</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="3">
                                <v-subheader>Marketstack.com</v-subheader>
                            </v-col>
                            <v-col>
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
                                    <span>Differs between free/premium key.</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col col="12">
                                <v-alert
                                    icon="mdi-shield-lock-outline"
                                    prominent
                                    text
                                    type="info"
                                >
                                    <span>
                                        All stock calls are made via this. The api key will be stored on your local device (indexxeddb).
                                    </span>
                                    <span>
                                        You can set up a free, or premium key via the following link. The link is an affiliate program, I get a commission if a purchase is made. The prices remain the same.
                                    </span>

                                    <v-divider
                                        class="my-4 info"
                                        style="opacity: 0.22"
                                    />

                                    <v-tooltip bottom>
                                        <template #activator="{ on }">
                                            <v-btn
                                                color="blue-grey"
                                                class="ma-2 white--text"
                                                :href="stockApiAffiliateUrl"
                                                target="_blank"
                                                v-on="on"
                                            >
                                                Get a Key
                                            </v-btn>
                                        </template>
                                        <span>Sends you to marketstack.com</span>
                                    </v-tooltip>
                                </v-alert>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col col="6">
                                <v-alert
                                    color="blue-grey"
                                    dark
                                    dense
                                    icon="mdi-school"
                                    prominent
                                    text
                                >
                                    <span>Free key:</span>
                                    <ul>
                                        <li v-for="(plan, index) in stockApiPlanDescription.free" :key="index">
                                            {{ plan }}
                                        </li>
                                    </ul>
                                </v-alert>
                            </v-col>

                            <v-col col="6">
                                <v-alert
                                    color="success"
                                    dark
                                    dense
                                    icon="mdi-school"
                                    prominent
                                    text
                                >
                                    <span>Premium key (in addition):</span>
                                    <ul>
                                        <li v-for="(plan, index) in stockApiPlanDescription.premium" :key="index">
                                            {{ plan }}
                                        </li>
                                    </ul>
                                </v-alert>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-divider />

                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="primary" text @click="setTokens">Set Token</v-btn>
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
                            :items="getAllExchanges"
                            :filter="exchangeFilter"
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
                        >
                            <template slot="selection" slot-scope="data">
                                <!-- HTML that describe how select should render selected items -->
                                {{ data.item.name }} - {{ data.item.mic }}
                            </template>
                            <template slot="item" slot-scope="data">
                                <!-- HTML that describe how select should render items when the select is open -->
                                {{ data.item.name }} - {{ data.item.mic }}
                            </template>
                        </v-autocomplete>
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
            stockApiAffiliateUrl: 'https://marketstack.com?fpr=meme-stonks',
            stockApiPlanDescription: {
                free: [
                    'limited to 1,000 Requests / mo',
                    '1 Year History',
                    'End-of-Day Data'
                ],
                premium: [
                    '10,000 Requests / mo',
                    'Intraday Data',
                    'HTTPS Encryption'
                ]
            },
            exchange: '',
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
        getExchange() {
            // Wurde ein API Key gesetzt, bewirkt die Beobachtung das Setzen der Börse in der Auswahl
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
            getStockApiTokenPremium: 'getStockApiTokenPremium'
        }),
        ...mapActions({
            setStockApiToken: 'setStockApiToken',
            setStockApiTokenPremium: 'setStockApiTokenPremium',
            setExchange: 'stock/setExchange'
        }),
        loadData() {
            // Setzt aktuelle Tokens in Inputfelder
            this.stockApiToken = this.getStockApiToken()
            this.stockApiPremiumCheckbox = this.getStockApiTokenPremium()
        },
        setTokens() {
            this.setStockApiToken(this.stockApiToken)
            this.setStockApiTokenPremium(this.stockApiPremiumCheckbox)
            this.snackbar.text = 'Set api keys...' // User Feedback
            this.snackbar.show = true // User Feedback
        },
        exchangeFilter(item, queryText, itemText) {
            // Filtert welche Items im DropDown angezeigt werden sollen
            const name = item.name.toLowerCase()
            const mic = item.mic.toLowerCase()
            const search = queryText.toLowerCase()
            return name.includes(search) || mic.includes(search)
        },
        submitExchange() {
            this.setExchange(this.exchange)
            this.snackbar.text = 'Set stock exchange...' // User Feedback
            this.snackbar.show = true // User Feedback
        }
    }
}
</script>
