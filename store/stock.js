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
    setExchange: (state, payload) => {
        state.currentExchange = payload
    },
    setAllExchanges: (state, payload) => {
        state.exchanges = payload
    },
    setCurrentStock: (state, payload) => {
        state.currentStock = payload
    },
    setStocks: (state, payload) => {
        state.stocks = payload
    },
    addStockData: (state, payload) => {
        // NICHT diese Mutation ausführen, sondern die gleichnamige ACTION!!!

        // Fügt neue StockData hinzu, wenn sie noch nicht vorhanden ist
        if (!state.stockData.find(({ name }) => name === payload.name)) {
            state.stockData.push(payload)
        }
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setExchange: (vuexContext, payload) => {
        // Speichert auf Clientseite die Börse zusätzlich im Localstorage
        if (process.browser) {
            localStorage.setItem('currentExchange', JSON.stringify(payload))
        }
        vuexContext.commit('setExchange', payload)
    },
    setAllExchanges: (vuexContext, payload) => {
        vuexContext.commit('setAllExchanges', payload)
    },
    setCurrentStock: (vuexContext, payload) => {
        vuexContext.commit('setCurrentStock', payload)
    },
    setStocks: (vuexContext, payload) => {
        vuexContext.commit('setStocks', payload)
    },
    addStockData: ({ commit, dispatch, state }, payload) => {
        // Prüft ob StockData bereits gespeichert wurde
        if (!state.stockData.find(({ name }) => name === payload.name)) {
            commit('addStockData', payload)
        }
    }
}

// Getting computed data
export const getters = {
    getExchange: (state) => {
        return state.currentExchange
    },
    getAllExchanges: (state) => {
        return state.exchanges
    },
    getCurrentStock: (state) => {
        return state.currentStock
    },
    getStocks: (state) => {
        return state.stocks
    },
    getStockData: (state) => (name) => {
        // Wird kein parameter zur Suche angegeben, werden ALLE StockDatas zurückgegeben
        if (!name) return state.stockData
        // Liefert das erste mit gleichen Namen, oder Symbol gefundene StockData Objekt zurück
        return state.stockData.find((data) => data.name === name || data.symbol === name)
    }
}
