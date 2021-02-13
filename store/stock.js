// Root Store
export const state = () => ({
    exchange: 'XNAS', // (XSTU) Börse Stuttgart, (XFRA) Deutsche Börse, (XNAS) NASDAQ Stock Exchange
    exchangeDetails: null,
    current: null,
    stocks: []
})

// Sync functions for setting data
export const mutations = {
    setExchangeDetails: (state, payload) => {
        state.exchangeDetails = payload
    },
    setCurrentStock: (state, payload) => {
        state.current = payload
    },
    setStocks: (state, payload) => {
        state.stocks = payload
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setExchangeDetails: (vuexContext, payload) => {
        vuexContext.commit('setExchangeDetails', payload)
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
    getExchangeDetails: (state) => {
        return state.exchangeDetails
    },
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
