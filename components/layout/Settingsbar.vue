<template>
    <v-navigation-drawer v-model="rightDrawer" right temporary fixed>
        <v-dialog v-model="apiTokenDialog" width="500">
            <v-card>
                <v-card-title class="headline">Set Api Token</v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="4">
                            <v-subheader>Marketstack.com</v-subheader>
                        </v-col>
                        <v-col cols="8">
                            <v-text-field
                                v-model="token"
                                label="Marketstack.com Api Key"
                                :value="getApiToken"
                                clearable
                                single-line
                                outlined
                            ></v-text-field>
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
                                :value="getRapidApiToken"
                                clearable
                                single-line
                                outlined
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider />

                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" text @click="setToken">Set Token</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="exchangeDialog" width="500">
            <v-card>
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
                    ></v-autocomplete>
                </v-card-text>

                <v-divider />

                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" text @click="submitExchange">Set Exchange</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-list nav>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">Application</v-list-item-title>
                    <v-list-item-subtitle>Settings</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider />

            <v-list-item @click="changeDarkMode">
                <v-list-item-action>
                    <v-icon>
                        {{ darkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
                    </v-icon>
                </v-list-item-action>
                <v-list-item-title>
                    {{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}
                </v-list-item-title>
            </v-list-item>
            <v-list-item @click="changeApiToken">
                <v-list-item-action>
                    <v-icon>mdi-key-variant</v-icon>
                </v-list-item-action>
                <v-list-item-title>Set Api Token</v-list-item-title>
            </v-list-item>
            <v-list-item @click="changeExchange">
                <v-list-item-action>
                    <v-icon>mdi-home-edit</v-icon>
                </v-list-item-action>
                <v-list-item-title>Exchange</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            apiTokenDialog: false,
            token: '',
            rapidApiToken: '',
            exchangeDialog: false,
            searchExchange: null,
            exchange: '',
            exchangeList: []
        }
    },
    computed: {
        ...mapGetters({
            getRightDrawer: 'layout/getRightDrawer',
            getAllExchanges: 'stock/getAllExchanges',
            getExchange: 'stock/getExchange'
        }),
        rightDrawer: {
            get() {
                return this.getRightDrawer
            },
            set(value) {
                this.setRightDrawer(value)
            }
        },
        darkMode() {
            return this.$vuetify.theme.dark
        },
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
            val && val !== this.selectedExchange && this.querySelections(val)
        }
    },
    methods: {
        ...mapGetters({
            getApiToken: 'getApiToken',
            getRapidApiToken: 'getRapidApiToken'
        }),
        ...mapActions({
            setRightDrawer: 'layout/setRightDrawer',
            setApiToken: 'setApiToken',
            setRapidApiToken: 'setRapidApiToken',
            setExchange: 'stock/setExchange'
        }),
        changeDarkMode() {
            if (this.darkMode) {
                this.$vuetify.theme.dark = false
            } else {
                this.$vuetify.theme.dark = true
            }
        },
        changeApiToken() {
            // Setzt aktuellen Tokens in Inputfelder
            this.token = this.getApiToken()
            this.rapidApiToken = this.getRapidApiToken()
            this.apiTokenDialog = true
        },
        setToken() {
            this.setApiToken(this.token)
            this.setRapidApiToken(this.rapidApiToken)
            this.apiTokenDialog = false
            this.setRightDrawer(false)
        },
        changeExchange() {
            // Setzt aktuellen Token ins Inputfeld
            this.exchangeDialog = true
        },
        submitExchange() {
            console.log('Set Exchange:', this.exchange)
            this.setExchange(this.exchange)
            this.exchangeDialog = false
            this.setRightDrawer(false)
        },
        querySelections(v) {
            this.loading = true
            this.exchangeList = this.getAllExchanges.filter((e) => {
                return (e.name || '').toLowerCase().includes((v || '').toLowerCase())
            })
            this.loading = false
        }
    }
}
</script>
