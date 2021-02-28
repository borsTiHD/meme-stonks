// Root Store
export const state = () => ({
    news: []
})

// Sync functions for setting data
export const mutations = {
    addNews(state, payload) {
        // NICHT diese Mutation ausführen, sondern die gleichnamige ACTION!!!

        // Fügt neue News hinzu, wenn sie noch nicht vorhanden ist
        if (!state.news.find(({ name }) => name === payload.name)) {
            state.news.push(payload)
        }
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    addNews({ commit, dispatch, state }, payload) {
        // Prüft ob News bereits gespeichert wurden
        if (!state.news.find(({ name }) => name === payload.name)) {
            commit('addNews', payload)
        }
    }
}

// Getting computed data
export const getters = {
    getNews: (state) => (name) => {
        // Wird kein parameter zur Suche angegeben, werden ALLE News zurückgegeben
        if (!name) return state.news
        // Liefert die ersten mit gleichen Namen gefundenen News zurück
        return state.news.find((data) => data.name === name)
    }
}
