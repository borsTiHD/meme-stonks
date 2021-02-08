<template>
    <v-app dark>
        <app-header :fetching="loadingData" />
        <app-sidebar />
        <app-settingsbar />

        <v-main>
            <v-container>
                <nuxt />
            </v-container>
        </v-main>

        <app-footer />
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
            loadingData: false
        }
    },
    computed: {
        ...mapGetters({
            getApiToken: 'getApiToken',
            getExchange: 'stock/getExchange',
            getStocks: 'stock/getStocks'
        }),
    },
    created() {
        // Client Side
        console.log('process.client', process.client)
        if (process.client) {
            this.fetchData()
        }
    },
    methods: {
        ...mapActions({
            setDrawer: 'layout/setDrawer',
            setRightDrawer: 'layout/setRightDrawer',
            setApiToken: 'setApiToken',
            setApiTokenLocalStorage: 'setApiTokenLocalStorage',
            setStocks: 'stock/setStocks'
        }),
        fetchData() {
            // Gibt es bereits Stocks, brauchen die nicht erneut gefetcht zu werden
            if (Array.isArray(this.getStocks && this.getStocks.length > 0)) {
                return false
            }


            // Loading State
            this.loadingData = true

            // Setzt ApiToken aus Env
            if (process.env.apiToken) {
                this.setApiToken(process.env.apiToken)
                // this.setApiTokenLocalStorage(process.env.apiToken)
            }

            const params = {
                access_key: this.getApiToken,
                limit: 1000
            }

            const url = `http://api.marketstack.com/v1/exchanges/${this.getExchange}/tickers`
            // const url = 'http://api.marketstack.com/v1/tickers'

            this.$axios.get(url, { params })
                .then((response) => {
                    const stocks = response.data.data.tickers
                    this.setStocks(stocks)
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.loadingData = false
                })
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
