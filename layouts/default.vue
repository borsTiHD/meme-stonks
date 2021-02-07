<template>
    <v-app dark>
        <app-header :fetching="$fetchState.pending" />
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
import { mapActions } from 'vuex'

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
    async fetch() {
        const params = {
            access_key: process.env.apiToken
        }

        this.$axios.get('http://api.marketstack.com/v1/tickers', { params })
            .then((response) => {
                const stocks = response.data.data
                console.log('Stocks:', stocks)
                this.setStocks(stocks)
            }).catch((error) => {
                console.log(error)
            })
    },
    // call fetch only on client-side
    fetchOnServer: false,
    methods: {
        ...mapActions({
            setDrawer: 'layout/setDrawer',
            setRightDrawer: 'layout/setRightDrawer',
            setStocks: 'stock/setStocks'
        })
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
