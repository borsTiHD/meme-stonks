// Root Store
export const state = () => ({
    marketstack: {
        stockBaseUrl: 'api.marketstack.com/v1',
        stockApiToken: null,
        stockApiTokenPremium: false
    }
})

// Sync functions for setting data
export const mutations = {
    setStockApiToken: (state, payload) => {
        state.marketstack.stockApiToken = payload
    },
    setStockApiTokenPremium: (state, payload) => {
        state.marketstack.stockApiTokenPremium = payload
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setStockApiToken: (vuexContext, payload) => {
        // Speichert auf Clientseite den Token zusätzlich im Localstorage
        if (process.browser) {
            const data = payload || ''
            localStorage.setItem('stockApiToken', data)
        }
        vuexContext.commit('setStockApiToken', payload)
    },
    setStockApiTokenPremium: (vuexContext, payload) => {
        // Speichert auf Clientseite den Token zusätzlich im Localstorage
        if (process.browser) {
            const data = payload || 'false'
            localStorage.setItem('stockApiTokenPremium', data)
        }
        vuexContext.commit('setStockApiTokenPremium', payload)
    }
}

// Getting computed data
export const getters = {
    getStockBaseUrl: (state) => {
        if (state.marketstack.stockApiTokenPremium) {
            return `https://${state.marketstack.stockBaseUrl}`
        } else {
            return `http://${state.marketstack.stockBaseUrl}`
        }
    },
    getStockApiTokenPremium: (state) => {
        return state.marketstack.stockApiTokenPremium
    },
    getStockApiToken: (state) => {
        return state.marketstack.stockApiToken
    }
}
