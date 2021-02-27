<template>
    <v-app v-resize="onResize" dark>
        <app-header :fetching="loadingExchanges || loadingStocks" />
        <app-sidebar />
        <app-settingsbar />

        <v-main>
            <v-container id="container" fluid :style="`height: ${containerHeight}px;`">
                <app-alerts />
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
import AppAlerts from '~/components/alerts/Alerts'

export default {
    components: {
        AppHeader,
        AppSidebar,
        AppSettingsbar,
        AppFooter,
        AppAlerts
    },
    data() {
        return {
            loadingExchanges: false,
            loadingStocks: false,
            containerHeight: 0
        }
    },
    computed: {
        ...mapGetters({
            getStockApiToken: 'tokens/getStockApiToken',
            getExchange: 'stock/getExchange'
        })
    },
    watch: {
        async getStockApiToken() {
            // Fetcht neue Daten wenn Token geändert wird
            this.loadingExchanges = true
            await this.$apiCalls.fetchExchanges().catch((err) => {
                console.error(err)
            })
            this.loadingExchanges = false
        },
        async getExchange() {
            // Fetcht neue Daten wenn Exchange geändert wird
            this.loadingStocks = true
            await this.$apiCalls.fetchStocks().catch((err) => {
                console.error(err)
            })
            this.loadingStocks = false
        }
    },
    created() {
        // Client Side
        if (process.client) {
            // Ermittelt Stock Api Token aus LocalStorage und speichert im Store
            if (localStorage.getItem('stockApiToken')) {
                this.setStockApiToken(localStorage.getItem('stockApiToken'))
            }

            // Ermittelt Stock Token Premium State
            const premiumCheck = localStorage.getItem('stockApiTokenPremium')
            if (premiumCheck === 'true') {
                this.setStockApiTokenPremium(true)
            } else if (premiumCheck === 'false') {
                this.setStockApiTokenPremium(false)
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
            setStockApiToken: 'tokens/setStockApiToken',
            setStockApiTokenPremium: 'tokens/setStockApiTokenPremium'
        }),
        async fetchData() {
            this.loadingExchanges = true
            this.loadingStocks = true

            // Fetcht verfügbare Börsen
            await this.$apiCalls.fetchExchanges().catch((err) => {
                console.error(err)
                this.loadingExchanges = false
                return false
            })

            // Fetcht verfügbare Aktien
            await this.$apiCalls.fetchStocks().catch((err) => {
                console.error(err)
                this.loadingStocks = false
                return false
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
