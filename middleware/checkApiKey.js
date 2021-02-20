export default function(context) {
    // Wenn der API Key nicht vorhanden ist, wird der User zur Welcome Page zurück geleitet
    const apiToken = context.store.getters.getApiToken
    if (!apiToken || apiToken === 'undefined' || apiToken === 'null' || apiToken === '') {
        console.log('[Middleware] >> API Key is NOT available:', apiToken)
        return context.redirect('/')
    } else {
        console.log('[Middleware] >> API Key available')
    }
}
