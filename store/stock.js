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
        state.stocks.push(...payload)
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
        // Speichert auf Clientseite die Börse zusätzlich im Localstorage
        if (process.client) {
            localStorage.setItem('currentExchange', JSON.stringify(payload))
        }
        commit('setExchange', payload)
    },
    setAllExchanges({ commit }, payload) {
        commit('setAllExchanges', payload)
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
    addStocks({ commit }, payload) {
        commit('addStocks', payload)
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
    getStocks(state) {
        return state.stocks
    },
    getStockData: (state) => (name) => {
        // Wird kein parameter zur Suche angegeben, werden ALLE StockDatas zurückgegeben
        if (!name) return state.stockData
        // Liefert das erste mit gleichen Namen, oder Symbol gefundene StockData Objekt zurück
        return state.stockData.find((data) => data.name === name || data.symbol === name)
    }
}
