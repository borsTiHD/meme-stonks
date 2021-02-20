export default ({ app }, inject) => {
    const apiCalls = {
        /**
         * fetchExchanges() : Fetcht verfügbare Börsen
         */
        fetchExchanges() {
            return new Promise((resolve, reject) => {
                console.log('[App] -> Fetching Exchanges')

                // Ermittelt Daten
                const exchanges = app.store.getters['stock/getAllExchanges']
                const stockApiToken = app.store.getters.getStockApiToken

                // Gibt es bereits Exchanges, brauchen die nicht erneut gefetcht werden
                if (Array.isArray(exchanges && exchanges.length > 0)) {
                    return reject(new Error('Data Exists'))
                }

                // Kein ApiToken -> KEIN FETCHING!
                if (!stockApiToken || stockApiToken === 'null' || stockApiToken === '') {
                    return reject(new Error('No Api Token found. Please go to settings and set an Api Token for Marketstack.com'))
                }

                // Parameter für API Call
                const params = {
                    access_key: stockApiToken,
                    limit: 1000
                }

                // Ermittelt Alle Exchanges
                const baseUrl = app.store.getters.getStockBaseUrl
                const url = `${baseUrl}/exchanges`
                app.$axios.get(url, { params })
                    .then((response) => {
                        // Setzt Exchange Data
                        const data = response.data.data
                        console.log('[App] -> All Exchanges:', data)
                        app.store.dispatch('stock/setAllExchanges', data) // Setzt Store

                        // Setzt default Exchange falls vorhanden aus LocalStorage
                        let defaultExchange = data.find((data) => data.acronym === 'XSTU') // (XSTU) Börse Stuttgart, (XFRA) Deutsche Börse, (XNAS) NASDAQ Stock Exchange
                        if (process.client && localStorage.getItem('currentExchange')) {
                            const localExchange = localStorage.getItem('currentExchange')
                            defaultExchange = JSON.parse(localExchange)
                        }
                        app.store.dispatch('stock/setExchange', defaultExchange) // Setzt Store
                    }).catch((error) => {
                        console.log(error)
                        return reject(error)
                    }).finally(() => {
                        return resolve(true)
                    })
            })
        },

        /**
         * fetchStocks() : Fetcht Stocks einer Börse
         */
        fetchStocks() {
            return new Promise((resolve, reject) => {
                console.log('[App] -> Fetching Stocks')

                // Ermittelt Daten
                const stocks = app.store.getters['stock/getStocks']
                const stockApiToken = app.store.getters.getStockApiToken

                // Gibt es bereits Stocks, brauchen die nicht erneut gefetcht zu werden
                if (Array.isArray(stocks && stocks.length > 0)) {
                    return resolve(true)
                }

                // Kein ApiToken -> KEIN FETCHING!
                if (!stockApiToken || stockApiToken === 'null' || stockApiToken === '') {
                    return reject(new Error('No Api Token found. Please go to settings and set an Api Token for Marketstack.com'))
                }

                // Parameter für API Call
                const params = {
                    access_key: stockApiToken,
                    limit: 1000
                }

                // Ermittelt Verfügbare Stocks eines Exchanges
                const baseUrl = app.store.getters.getStockBaseUrl
                const exchange = app.store.getters['stock/getExchange']
                const url = `${baseUrl}/exchanges/${exchange?.mic}/tickers`
                app.$axios.get(url, { params })
                    .then((response) => {
                        const data = response.data.data.tickers
                        console.log('[App] -> All Stocks:', data)
                        app.store.dispatch('stock/setStocks', data) // Setzt Stocks
                        app.store.dispatch('stock/setCurrentStock', null) // Setzt aktive Aktie ggf. zurück
                    }).catch((error) => {
                        console.log(error)
                        return reject(error)
                    }).finally(() => {
                        return resolve(true)
                    })
            })
        },

        /**
         * fetchStockDataEod() : Fetcht EOD Data eines Stocks
         */
        fetchStockDataEod() {
            return new Promise((resolve, reject) => {
                console.log('[App] -> Fetching Stock Data')

                // Fetcht keine Daten, wenn keine Aktie ausgewählt wurde
                if (!this.getCurrentStock) {
                    return reject(new Error('No Stock Selected'))
                }

                // Gibt es bereits Stock Data, wird nicht gefetcht
                if (this.getCurrentStockData) {
                    return resolve(true)
                }

                // Kein ApiToken -> KEIN FETCHING!
                if (!this.getStockApiToken || this.getStockApiToken === 'null' || this.getStockApiToken === '') {
                    return reject(new Error('No Api Token'))
                }

                this.loadingData = true

                const params = {
                    access_key: this.getStockApiToken,
                    exchange: this.getExchange.mic,
                    sort: 'ASC',
                    limit: 1000
                }

                const symbol = this.getCurrentStock.symbol
                const url = `${this.getStockBaseUrl}/tickers/${symbol}/eod`

                this.$axios.get(url, { params })
                    .then((res) => {
                        const stockData = res.data.data
                        console.log('[APP] -> Stock Data:', stockData)
                        this.addStockData(stockData)
                        this.loadingData = false
                    }).catch((error) => {
                        console.log(error)
                        this.loadingData = false
                        return reject(error)
                    }).finally(() => {
                        this.loadingData = false
                        return resolve(true)
                    })
            })
        }
    }

    // Inject $apiCalls in Vue, context and store
    inject('apiCalls', apiCalls)
}
