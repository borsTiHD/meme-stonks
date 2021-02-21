export default function(app) {
    if (process.client) {
        // Wenn der API Key nicht vorhanden ist, wird der User zur Settings Page geleitet
        const apiToken = app.store.getters.getStockApiToken
        if (!apiToken || apiToken === 'undefined' || apiToken === 'null' || apiToken === '') {
            console.log('[Middleware] >> API Key is NOT available:', apiToken)

            // Erzeugt Alert + Cleart ggf. vorhandene Alerts bzgl API Key
            const alertGroup = 'apiKey'
            app.store.commit('alerts/clearAlertsByGroup', alertGroup)
            app.store.commit('alerts/pushAlert', {
                icon: 'mdi-information',
                group: alertGroup,
                border: 'left',
                color: 'warning',
                erasable: true,
                outlined: true,
                text: true,
                content: 'Warning! No api key has been deposited yet.\nPlease go to settings and set an api key for Marketstack.com.\nThe key will be stored on your local device.'
            })

            return app.redirect('/settings')
        } else {
            console.log('[Middleware] >> API Key available')
        }
    }
}
