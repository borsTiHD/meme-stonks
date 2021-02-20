<template>
    <v-app v-resize="onResize" dark>
        <app-header :fetching="loadingData" />
        <app-sidebar />
        <app-settingsbar />

        <v-main>
            <v-container id="container" fluid :style="`height: ${containerHeight}px;`">
                <nuxt keep-alive />
            </v-container>
        </v-main>

        <app-footer id="footer" />
    </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import AppHeader from '~/components/layout/Header.vue'
import AppSidebar from '~/components/layout/Sidebar.vue'
import AppSettingsbar from '~/components/layout/Settingsbar.vue'
import AppFooter from '~/components/layout/Footer.vue'

export default {
    components: {
        AppHeader,
        AppSidebar,
        AppSettingsbar,
        AppFooter
    },
    data() {
        return {
            loadingData: false,
            containerHeight: 0
        }
    },
    computed: {
        ...mapGetters({
            getStockApiToken: 'getStockApiToken',
            getStockBaseUrl: 'getStockBaseUrl',
            getAllExchanges: 'stock/getAllExchanges',
            getExchange: 'stock/getExchange',
            getStocks: 'stock/getStocks'
        })
    },
    watch: {
        async getStockApiToken() {
            // Fetcht neue Daten wenn Token geändert wird
            this.loadingData = true
            await this.fetchExchanges().catch((err) => {
                console.error(err)
            })
            this.loadingData = false
        },
        async getExchange() {
            // Fetcht neue Daten wenn Exchange geändert wird
            this.loadingData = true
            await this.fetchStocks().catch((err) => {
                console.error(err)
            })
            this.loadingData = false
        }
    },
    created() {
        // Client Side
        if (process.client) {
            // Ermittelt Token aus LocalStorage und speichert im Store
            if (localStorage.getItem('stockApiToken')) {
                this.setStockApiToken(localStorage.getItem('apiToken'))
            }

            // Ermittelt Rapid Api Token aus LocalStorage und speichert im Store
            if (localStorage.getItem('rapidApiToken')) {
                this.setRapidApiToken(localStorage.getItem('rapidApiToken'))
            }

            // Fetcht Daten -> werden auch über Watch gefetcht.
            // this.fetchData()

            // Setzt Container Größe
            setImmediate(() => {
                this.onResize()
            })
        }
    },
    methods: {
        ...mapActions({
            setDrawer: 'layout/setDrawer',
            setRightDrawer: 'layout/setRightDrawer',
            setStockApiToken: 'setStockApiToken',
            setRapidApiToken: 'setRapidApiToken',
            setAllExchanges: 'stock/setAllExchanges',
            setExchange: 'stock/setExchange',
            setStocks: 'stock/setStocks',
            setCurrentStock: 'stock/setCurrentStock'
        }),
        async fetchData() {
            this.loadingData = true

            // Fetcht verfügbare Börsen
            await this.fetchExchanges().catch((err) => {
                console.error(err)
                this.loadingData = false
                return false
            })

            // Fetcht verfügbare Aktien
            await this.fetchStocks().catch((err) => {
                console.error(err)
                this.loadingData = false
                return false
            })

            this.loadingData = false
        },
        fetchStocks() {
            return new Promise((resolve, reject) => {
                console.log('[App] -> Fetching Stocks')

                // Gibt es bereits Stocks, brauchen die nicht erneut gefetcht zu werden
                if (Array.isArray(this.getStocks && this.getStocks.length > 0)) {
                    return resolve(true)
                }

                // Kein ApiToken -> KEIN FETCHING!
                if (!this.getStockApiToken || this.getStockApiToken === 'null' || this.getStockApiToken === '') {
                    return reject(new Error('No Api Token'))
                }

                const params = {
                    access_key: this.getStockApiToken,
                    limit: 1000
                }

                // Ermittelt Verfügbare Stock eines Exchanges
                const url = `${this.getStockBaseUrl}/exchanges/${this.getExchange.mic}/tickers`
                this.$axios.get(url, { params })
                    .then((response) => {
                        const data = response.data.data.tickers
                        console.log('[App] -> All Stocks:', data)
                        this.setStocks(data) // Setzt Stocks
                        this.setCurrentStock(null) // Setzt aktive Aktie ggf. zurück
                    }).catch((error) => {
                        console.log(error)
                        return reject(error)
                    }).finally(() => {
                        return resolve(true)
                    })
            })
        },
        async fetchExchanges() {
            return new Promise((resolve, reject) => {
                console.log('[App] -> Fetching Exchanges')

                // Gibt es bereits Exchanges, brauchen die nicht erneut gefetcht werden
                if (Array.isArray(this.getAllExchanges && this.getAllExchanges.length > 0)) {
                    return reject(new Error('Data Exists'))
                }

                // Kein ApiToken -> KEIN FETCHING!
                if (!this.getStockApiToken || this.getStockApiToken === 'null' || this.getStockApiToken === '') {
                    return reject(new Error('No Api Token'))
                }

                const params = {
                    access_key: this.getStockApiToken,
                    limit: 1000
                }

                // Ermittelt Alle Exchanges
                const url = `${this.getStockBaseUrl}/exchanges`
                this.$axios.get(url, { params })
                    .then((response) => {
                        // Setzt Exchange Data
                        const data = response.data.data
                        console.log('[App] -> All Exchanges:', data)
                        this.setAllExchanges(data)

                        // Setzt default Exchange falls vorhanden aus LocalStorage
                        let defaultExchange = data.find((data) => data.acronym === 'XSTU') // (XSTU) Börse Stuttgart, (XFRA) Deutsche Börse, (XNAS) NASDAQ Stock Exchange
                        if (process.client && localStorage.getItem('currentExchange')) {
                            const localExchange = localStorage.getItem('currentExchange')
                            defaultExchange = JSON.parse(localExchange)
                        }
                        this.setExchange(defaultExchange)
                    }).catch((error) => {
                        console.log(error)
                        return reject(error)
                    }).finally(() => {
                        return resolve(true)
                    })
            })
        },
        async onResize() {
            // Setzt Container Höhe für Footer
            const container = document.getElementById('container')
            const footer = document.getElementById('footer')
            this.containerHeight = window.innerHeight - this.getOffset(container).top - this.getOffset(footer).height
        },
        getOffset(el) {
            /**
             * getOffset() - Ermittelt die X/Y Position eines HTML Elements
             *             -> // https://stackoverflow.com/a/28222246
             * @param   {string}    el  -> HTML Element
             * @returns {object}        -> Returns X/Y Koordinaten in 'px'
             */
            const rect = el.getBoundingClientRect()
            return {
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY,
                height: rect.height,
                width: rect.width
            }
        }
    }
}
</script>

<style>
/*****************************************************\
    No Scollbar on Page
    \*****************************************************/
html {
    overflow-y: hidden !important;
}
#container {
    height: 100vh;
    overflow-y: auto;
}

/*****************************************************\
    Scrollbar
    \*****************************************************/
::-webkit-scrollbar {
    width: 12px;
}
::-webkit-scrollbar-corner {
    background-color: transparent;
}
::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.3);
}

/*****************************************************\
    Unselectable Elements
    \*****************************************************/
.unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.selectable {
    -webkit-touch-callout: text !important;
    -webkit-user-select: text !important;
    -khtml-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
}
</style>
