// Root Store
export const state = () => ({
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
        vuexContext.commit('setApiToken', payload)
    },
    setApiTokenLocalStorage: (vuexContext, payload) => {
        // Speichert im Localstorage
        // localStorage.setItem('apiToken', payload)
    }
}

// Getting computed data
export const getters = {
    getApiToken: (state) => {
        // Returnt aus LocalStorage, oder aus Store zurück
        // return localStorage.getItem('apiToken') || state.apiToken
        return state.apiToken
    }
}
