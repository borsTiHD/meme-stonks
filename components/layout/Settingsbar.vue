<template>
    <v-navigation-drawer v-model="rightDrawer" right temporary app>
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
                    />
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
                <v-list-item-avatar>
                    <v-icon>mdi-cogs</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="title">Quick Settings</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider class="pa-1" />

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
        ...mapActions({
            setRightDrawer: 'layout/setRightDrawer',
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
