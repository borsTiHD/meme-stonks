// Root Store
export const state = () => ({
    stockBaseUrl: 'api.marketstack.com/v1',
    stockApiToken: null,
    stockApiTokenPremium: false,
    rapidBaseUrl: 'bing-news-search1.p.rapidapi.com',
    rapidApiToken: null
})

// Sync functions for setting data
export const mutations = {
    setStockApiToken: (state, payload) => {
        state.stockApiToken = payload
    },
    setStockApiTokenPremium: (state, payload) => {
        state.stockApiTokenPremium = payload
    },
    setRapidApiToken: (state, payload) => {
        state.rapidApiToken = payload
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
            const data = payload || ''
            localStorage.setItem('stockApiTokenPremium', data)
        }
        vuexContext.commit('setStockApiTokenPremium', payload)
    },
    setRapidApiToken: (vuexContext, payload) => {
        // Speichert auf Clientseite den Token zusätzlich im Localstorage
        if (process.browser) {
            const data = payload || ''
            localStorage.setItem('rapidApiToken', data)
        }
        vuexContext.commit('setRapidApiToken', payload)
    }
}

// Getting computed data
export const getters = {
    getStockBaseUrl: (state) => {
        if (state.stockApiTokenPremium) {
            return `https://${state.stockBaseUrl}`
        } else {
            return `http://${state.stockBaseUrl}`
        }
    },
    getStockApiTokenPremium: (state) => {
        return state.stockApiTokenPremium
    },
    getStockApiToken: (state) => {
        return state.stockApiToken
    },
    getRapidBaseUrl: (state) => {
        return state.rapidBaseUrl
    },
    getRapidApiToken: (state) => {
        return state.rapidApiToken
    }
}
