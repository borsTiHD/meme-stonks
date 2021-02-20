// Root Store
export const state = () => ({
    baseUrl: 'http://api.marketstack.com/v1',
    apiToken: null,
    rapidBaseUrl: 'bing-news-search1.p.rapidapi.com',
    rapidApiToken: null
})

// Sync functions for setting data
export const mutations = {
    setApiToken: (state, payload) => {
        state.apiToken = payload
    },
    setRapidApiToken: (state, payload) => {
        state.rapidApiToken = payload
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setApiToken: (vuexContext, payload) => {
        // Speichert auf Clientseite den Token zusätzlich im Localstorage
        if (process.browser) {
            const data = payload || ''
            localStorage.setItem('apiToken', data)
        }
        vuexContext.commit('setApiToken', payload)
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
    getBaseUrl: (state) => {
        return state.baseUrl
    },
    getApiToken: (state) => {
        return state.apiToken
    },
    getRapidBaseUrl: (state) => {
        return state.rapidBaseUrl
    },
    getRapidApiToken: (state) => {
        return state.rapidApiToken
    }
}
