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
                    return reject(new Error('No Api Token found. Please go to settings and set an Api Token (Marketstack.com).'))
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
                    return reject(new Error('No Api Token found. Please go to settings and set an Api Token (Marketstack.com).'))
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
         * fetchStockData() : Fetcht Stock Details + End of Day Data
         */
        fetchStockData() {
            return new Promise((resolve, reject) => {
                console.log('[App] -> Fetching Stock Data')

                // Ermittelt Daten
                const currentStock = app.store.getters['stock/getCurrentStock']
                const stockApiToken = app.store.getters.getStockApiToken
                const exchange = app.store.getters['stock/getExchange']

                // Fetcht keine Daten, wenn keine Aktie ausgewählt wurde
                if (!currentStock) {
                    return reject(new Error('No Stock Selected. Please select a stock in the upper search field.'))
                }

                // Gibt es bereits Stock Data, wird nicht gefetcht
                const stockData = app.store.getters['stock/getStockData'](currentStock?.name)
                if (stockData) {
                    return resolve(true)
                }

                // Kein ApiToken -> KEIN FETCHING!
                if (!stockApiToken || stockApiToken === 'null' || stockApiToken === '') {
                    return reject(new Error('No Api Token found. Please go to settings and set an Api Token (Marketstack.com).'))
                }

                // Parameter für API Call
                const params = {
                    access_key: stockApiToken,
                    exchange: exchange.mic,
                    sort: 'ASC',
                    limit: 1000
                }

                // Ermittelt Stock Daten
                const symbol = currentStock.symbol
                const baseUrl = app.store.getters.getStockBaseUrl
                const url = `${baseUrl}/tickers/${symbol}/eod`
                app.$axios.get(url, { params })
                    .then((res) => {
                        const stockData = res.data.data
                        console.log('[APP] -> Stock Data:', stockData)
                        app.store.dispatch('stock/addStockData', stockData) // Store
                    }).catch((error) => {
                        console.log(error)
                        return reject(error)
                    }).finally(() => {
                        return resolve(true)
                    })
            })
        }
    }

    // Inject $apiCalls in Vue, context and store
    inject('apiCalls', apiCalls)
}
