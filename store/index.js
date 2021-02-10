// Root Store
export const state = () => ({
    baseUrl: 'http://api.marketstack.com/v1',
    apiToken: null
})

// Sync functions for setting data
export const mutations = {
    setApiToken: (state, payload) => {
        state.apiToken = payload
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setApiToken: (vuexContext, payload) => {
        // Speichert auf Clientseite den Token zusätzlich im Localstorage
        if (process.browser) {
            localStorage.setItem('apiToken', payload)
        }
        vuexContext.commit('setApiToken', payload)
    }
}

// Getting computed data
export const getters = {
    getBaseUrl: (state) => {
        return state.baseUrl
    },
    getApiToken: (state) => {
        return state.apiToken
    }
}
