<template>
    <v-app v-resize="onResize" dark>
        <app-header :fetching="loadingData" />
        <app-sidebar />
        <app-settingsbar />

        <v-main>
            <v-container
                id="container"
                fluid
                :style="`height: ${containerHeight}px;`"
            >
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
            getApiToken: 'getApiToken',
            getBaseUrl: 'getBaseUrl',
            getExchange: 'stock/getExchange',
            getStocks: 'stock/getStocks',
        }),
    },
    watch: {
        // Fetcht neue Daten wenn Token geändert wird
        getApiToken() {
            this.fetchData()
        }
    },
    created() {
        // Client Side
        if (process.client) {
            // Ermittelt Token aus LocalStorage und speichert im Store
            if (localStorage.getItem('apiToken')) {
                this.setApiToken(localStorage.getItem('apiToken'))
            }

            // Fetcht Daten -> werden auch über Watch gefetcht.
            // this.fetchData()
        }
    },
    methods: {
        ...mapActions({
            setDrawer: 'layout/setDrawer',
            setRightDrawer: 'layout/setRightDrawer',
            setApiToken: 'setApiToken',
            setExchangeDetails: 'stock/setExchangeDetails',
            setStocks: 'stock/setStocks'
        }),
        fetchData() {
            // Gibt es bereits Stocks, brauchen die nicht erneut gefetcht zu werden
            if (Array.isArray(this.getStocks && this.getStocks.length > 0)) {
                return false
            }

            // Kein ApiToken -> KEIN FETCHING!
            if (!this.getApiToken || this.getApiToken === 'null' || this.getApiToken === '') {
                return false
            }

            // Loading State
            this.loadingData = true

            const params = {
                access_key: this.getApiToken,
                limit: 1000
            }

            // Ermittelt Verfügbare Stock eines Exchanges
            const getStocks = `${this.getBaseUrl}/exchanges/${this.getExchange}/tickers`
            this.$axios.get(getStocks, { params })
                .then((response) => {
                    const stocks = response.data.data.tickers
                    this.setStocks(stocks)
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.loadingData = false
                })

            // Ermittelt Exchange Details
            const exchangeDetails = `${this.getBaseUrl}/exchanges/${this.getExchange}`
            this.$axios.get(exchangeDetails, { params })
                .then((response) => {
                    const data = response.data
                    this.setExchangeDetails(data)
                }).catch((error) => {
                    console.log(error)
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
