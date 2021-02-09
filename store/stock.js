// Root Store
export const state = () => ({
    exchange: 'XFRA', // (XSTU) Börse Stuttgart, (XFRA) Deutsche Börse
    current: null,
    stocks: []
})

// Sync functions for setting data
export const mutations = {
    setCurrentStock: (state, payload) => {
        state.current = payload
    },
    setStocks: (state, payload) => {
        state.stocks = payload
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setCurrentStock: (vuexContext, payload) => {
        vuexContext.commit('setCurrentStock', payload)
    },
    setStocks: (vuexContext, payload) => {
        vuexContext.commit('setStocks', payload)
    }
}

// Getting computed data
export const getters = {
    getCurrentStock: (state) => {
        return state.current
    },
    getStocks: (state) => {
        return state.stocks
    },
    getExchange: (state) => {
        return state.exchange
    }
}
