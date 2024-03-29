// Error Message bei fehlendem API Key
const MISSING_API_KEY = 'No Api Token found. Please go to settings and set an Api Token (Marketstack.com).'
const MISSING_STOCK = 'No Stock Selected. Please select a stock in the upper search field.'

export default ({ app, isDev }, inject) => {
    const apiCalls = {
        /**
         * getStockApiKey() : Ermittelt API Key für Stock Abfragen
         * @returns     {string|boolean}    -> API Key, oder false
         */
        getStockApiKey() {
            const stockApiToken = app.store.getters['tokens/getStockApiToken']
            if (!stockApiToken || stockApiToken === 'null' || stockApiToken === 'undefined' || stockApiToken === '') {
                return false
            }
            return stockApiToken
        },

        /**
         * fetchExchanges() : Fetcht verfügbare Börsen
         */
        async fetchExchanges() {
            const setDefault = (exchanges) => {
                // Setzt default Exchange falls vorhanden aus IndexedDb
                // Ansonsten wird 'default' Exchange gesetzt
                app.$idb.getKeyValue('userSettings', 'selectedExchange', 'exchange').then((res) => {
                    let defaultExchange = exchanges.find((data) => data.acronym === 'NYSE') // (XSTU) Börse Stuttgart, (XFRA) Deutsche Börse (Frankfurt), (NYSE) New York Stock Exchange, (XNAS) NASDAQ Stock Exchange
                    if (res !== undefined && res !== null && res !== '') { defaultExchange = res }
                    app.store.dispatch('stock/setExchange', defaultExchange) // Setzt Store
                })
            }

            // Prüft IndexedDb nach gespeicherten Daten
            const db = await app.$idb.getDb('app')
            const result = await db.getAll('exchanges')

            // Prüft DB Ergebnis und setzt in internen Store, sowie 'default' Exchange
            if (Array.isArray(result) && result.length > 0) {
                console.log('[App] -> Loaded Exchange Data from IndexedDb:', result)
                app.store.dispatch('stock/setAllExchanges', result) // Setzt Store

                // Setzt Default Exchange
                setDefault(result)

                // Return, damit kein Fetching stattfindet
                return true
            }

            // Gibt es keine IndexedDb Einträge, werden Exchanges über API gefetched
            return new Promise((resolve, reject) => {
                console.log('[App] -> Fetching Exchanges')

                // Ermittelt Daten
                const exchanges = app.store.getters['stock/getAllExchanges']
                const stockApiToken = this.getStockApiKey()

                // Gibt es bereits Exchanges, brauchen die nicht erneut gefetcht werden
                if (Array.isArray(exchanges && exchanges.length > 0)) {
                    return resolve(true)
                }

                // Kein ApiToken -> KEIN FETCHING!
                if (!stockApiToken) {
                    return reject(new Error(MISSING_API_KEY))
                }

                // Parameter für API Call
                const params = {
                    access_key: stockApiToken,
                    limit: 1000
                }

                // Ermittelt Alle Exchanges
                const baseUrl = app.store.getters['tokens/getStockBaseUrl']
                const url = `${baseUrl}/exchanges`
                app.$axios.get(url, { params })
                    .then((response) => {
                        // Setzt Exchange Data
                        const data = response.data.data
                        console.log('[App] -> All Exchanges:', data)
                        app.store.dispatch('stock/setAllExchanges', data) // Setzt Store

                        // Setzt Default Exchange
                        setDefault(data)
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
        async fetchStocks() {
            // Ermittelt Daten
            const exchange = app.store.getters['stock/getExchange']

            // Prüft IndexedDb nach gespeicherten Daten
            const db = await app.$idb.getDb('app')
            const transaction = db.transaction('stocks')
            const micIndex = transaction.store.index('micIndex')

            // Holt sich alle Stocks/Tickers mit derzeit gewählten Mic
            const tickers = await micIndex.getAll(exchange.mic)

            // Prüft DB Ergebnis und setzt in internen Store, sowie 'default' Exchange
            if (Array.isArray(tickers) && tickers.length > 0) {
                console.log('[App] -> Loaded Stocks from IndexedDb:', tickers)
                // Fügt Stocks zum Store, damit Store funktioniert muss jedoch ein Object mit enthaltenen 'mic' Key und 'tickers' übergeben werden
                app.store.dispatch('stock/addStocks', {
                    mic: exchange.mic,
                    tickers
                })
                app.store.dispatch('stock/setCurrentStock', null) // Setzt aktive Aktie ggf. zurück

                // Return, damit kein Fetching stattfindet
                return true
            }

            return new Promise((resolve, reject) => {
                console.log('[App] -> Fetching Stocks')

                // Ermittelt Daten
                const exchange = app.store.getters['stock/getExchange']
                const stocks = app.store.getters['stock/getStocks'](exchange.mic)
                const stockApiToken = this.getStockApiKey()

                // Gibt es bereits Stocks, brauchen die nicht erneut gefetcht zu werden
                if (Array.isArray(stocks) && stocks.length > 0) {
                    console.log('[App] -> Stocks already existing.')
                    return resolve(true)
                }

                // Kein ApiToken -> KEIN FETCHING!
                if (!stockApiToken) {
                    return reject(new Error(MISSING_API_KEY))
                }

                // Leer Store bevor Stocks abgefragt werden um alte Stocks zu löschen
                // app.store.dispatch('stock/clearStocks')(exchange.mic)

                // Parameter für API Call
                const params = {
                    access_key: stockApiToken,
                    limit: 1000,
                    offset: 0
                }

                // Ermittelt Verfügbare Stocks des aktuellen Exchanges
                const baseUrl = app.store.getters['tokens/getStockBaseUrl']
                const url = `${baseUrl}/exchanges/${exchange?.mic}/tickers`

                // Holt Stocks und ruft sich erneut auf, wenn Limit nicht erreicht wurde
                const getStocks = (url, params) => {
                    app.$axios.get(url, { params })
                        .then((response) => {
                            const data = response.data.data
                            const pagination = response.data.pagination
                            console.log('[App] -> Still Fetching Stocks > Pagination:', pagination)

                            // Looped sämtliche Stocks durch
                            app.store.dispatch('stock/addStocks', data) // Fügt Stocks hinzu
                            app.store.dispatch('stock/setCurrentStock', null) // Setzt aktive Aktie ggf. zurück

                            // Prüft ob alle Stocks abgefragt wurden, wenn nicht, wird ein weiterer Call gestartet
                            const offset = pagination.offset += pagination.count // Setzt neuen Offset aus Anzahl an Ergebnissen des vorherigen Calls
                            // if (offset >= pagination.total || isDev) { // Im Dev Mode (context.isDev) werden NICHT alle Daten ebgefragt um Api Limit zu schonen
                            if (offset >= pagination.total) { // Im Dev Mode (context.isDev) werden NICHT alle Daten ebgefragt um Api Limit zu schonen
                                const stocks = app.store.getters['stock/getStocks'](data.mic) // Ermittelt aktuelle Stocks für den aktuellen Exchange
                                console.log('[App] -> Stocks:', stocks)
                                return resolve(true)
                            } else {
                                getStocks(url, {
                                    access_key: stockApiToken,
                                    limit: 1000,
                                    offset // Ändert gesetzt Offset aus vorheriger Abfrage
                                })
                            }
                        }).catch((error) => {
                            console.log(error)
                            return reject(error)
                        })
                }
                getStocks(url, params)
            })
        },

        /**
         * fetchStockData() : Fetcht Stock Details + End of Day Data
         */
        async fetchStockData() {
            // Ermittelt Daten
            const currentStock = app.store.getters['stock/getCurrentStock']

            // Fetcht keine Daten, wenn keine Aktie ausgewählt wurde
            if (!currentStock) {
                return new Error(MISSING_STOCK)
            }

            // Gibt es bereits Stock Data, wird nicht gefetcht
            const stockData = app.store.getters['stock/getStockData'](currentStock?.symbol)
            if (stockData) {
                return true
            }

            // Prüft IndexedDb nach gespeicherten Daten
            const db = await app.$idb.getDb('app')
            const stockDataDb = await db.get('stockDataEod', currentStock?.symbol)

            console.log('stockDataDb:', stockDataDb)

            // Wurde StockData in IndexedDB gefunden, werden die Daten im Store gespeichert und fetching beendet
            if (stockDataDb) {
                console.log('[APP] -> Loaded Stock EoD Data from IndexedDB:', stockDataDb)
                app.store.dispatch('stock/addStockData', stockDataDb) // Store
                return true
            }

            // Startet Fetching Prozess über API Call
            return new Promise((resolve, reject) => {
                console.log('[App] -> Fetching Stock Data')

                // Ermittelt Daten
                const currentStock = app.store.getters['stock/getCurrentStock']
                const stockApiToken = this.getStockApiKey()
                const exchange = app.store.getters['stock/getExchange']

                // Fetcht keine Daten, wenn keine Aktie ausgewählt wurde
                if (!currentStock) {
                    return reject(new Error(MISSING_STOCK))
                }

                // Gibt es bereits Stock Data, wird nicht gefetcht
                const stockData = app.store.getters['stock/getStockData'](currentStock?.symbol)
                if (stockData) {
                    return resolve(true)
                }

                // Kein ApiToken -> KEIN FETCHING!
                if (!stockApiToken) {
                    return reject(new Error(MISSING_API_KEY))
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
                const baseUrl = app.store.getters['tokens/getStockBaseUrl']
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
