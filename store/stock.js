// Root Store
export const state = () => ({
    currentExchange: null,
    exchanges: [],
    currentStock: null,
    stocks: []
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
    }
}
