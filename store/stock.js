import Vue from 'vue'

// Root Store
export const state = () => ({
    currentExchange: null,
    exchanges: [],
    currentStock: null,
    stocks: [],
    stockData: []
})

// Sync functions for setting data
export const mutations = {
    setExchange(state, payload) {
        state.currentExchange = payload
    },
    setAllExchanges(state, payload) {
        state.exchanges = payload
    },
    setCurrentStock(state, payload) {
        state.currentStock = payload
    },
    clearStocks(state) {
        state.stocks = []
    },
    setStocks(state, payload) {
        state.stocks = payload
    },
    addStocks(state, payload) {
        // Prüft ob bereits ein Objekt im Store mit dem Exchange existiert
        const index = state.stocks.findIndex(({ mic }) => mic === payload.mic)
        if (index !== -1) {
            // Index vorhanden -> Daten werden ergänzt
            const stocks = state.stocks[index].tickers // Ermittelt vorhandene Stocks
            stocks.push(...payload.tickers) // Neue Stocks werden dem Array hinzugefügt
            Vue.set(state.stocks[index], 'tickers', stocks) // Setzt neues Stocks Array mit Vue.set, damit es reactive bleibt
        } else {
            // Neues Stocks Objekt wird hinzugefügt
            state.stocks.push(payload)
        }
    },
    addStockData(state, payload) {
        // NICHT diese Mutation ausführen, sondern die gleichnamige ACTION!!!

        // Fügt neue StockData hinzu, wenn sie noch nicht vorhanden ist
        if (!state.stockData.find(({ name }) => name === payload.name)) {
            state.stockData.push(payload)
        }
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setExchange({ commit }, payload) {
        // Speichert auf Clientseite die Börse in IndexedDb
        if (process.client) {
            this.$idb.putKeyValue('userSettings', 'selectedExchange', 'exchange', payload)
        }
        commit('setExchange', payload)
    },
    async setAllExchanges({ commit }, payload) {
        // Speichert im Store
        commit('setAllExchanges', payload)

        // Speichert Exchanges in IndexedDb
        if (Array.isArray(payload)) {
            const db = await this.$idb.getDb('app')
            const transaction = db.transaction('exchanges', 'readwrite')
            payload.forEach((exchange) => {
                transaction.objectStore('exchanges').add(exchange)
            })
        }
    },
    setCurrentStock({ commit }, payload) {
        commit('setCurrentStock', payload)
    },
    clearStocks({ commit }) {
        commit('clearStocks')
    },
    setStocks({ commit }, payload) {
        commit('setStocks', payload)
    },
    async addStocks({ commit }, payload) {
        commit('addStocks', payload)

        // Speichert Stocks in IndexedDb
        if (Array.isArray(payload)) {
            const db = await this.$idb.getDb('app')
            const transaction = db.transaction('stocks', 'readwrite')
            payload.tickers.forEach((ticker) => {
                // Speichert Ticker/Stock mit 'mic' als zusätzlichen Key
                transaction.objectStore('stocks').add({
                    ...ticker,
                    mic: payload.mic
                })
            })
        }
    },
    addStockData({ commit, dispatch, state }, payload) {
        // Prüft ob StockData bereits gespeichert wurde
        if (!state.stockData.find(({ name }) => name === payload.name)) {
            commit('addStockData', payload)
        }
    }
}

// Getting computed data
export const getters = {
    getExchange(state) {
        return state.currentExchange
    },
    getAllExchanges(state) {
        return state.exchanges
    },
    getCurrentStock(state) {
        return state.currentStock
    },
    getStocks: (state) => (mic) => {
        // Wird kein parameter zur Suche angegeben, werden ALLE Stocks zurückgegeben
        if (!mic) return state.stocks
        // Liefert Stocks Array mit gleichen Exchange zurück
        const stockObj = state.stocks.find((data) => data.mic === mic)
        return stockObj?.tickers
    },
    getStockData: (state) => (name) => {
        // Wird kein parameter zur Suche angegeben, werden ALLE StockDatas zurückgegeben
        if (!name) return state.stockData
        // Liefert das erste mit gleichen Namen, oder Symbol gefundene StockData Objekt zurück
        return state.stockData.find((data) => data.name === name || data.symbol === name)
    }
}
