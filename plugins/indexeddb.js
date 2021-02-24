import { openDB } from 'idb'

/**
 * IndexedDb Class
 */
class IndexedDb {
    constructor(app) {
        // Nuxt App Instance
        this.$app = app

        // DB Instance
        this.db1 = this.init()
    }

    /**
     * init() - Initiiert Datenbanken
     * @access  private
     * @return  {object}    -> Returned Datenbank Verbindungen
     */
    async init() {
        return await openDB('db1', 1)
    }
}

// Plugin Inject/Export
export default ({ app, isDev }, inject) => {
    const idb = new IndexedDb(app)

    // Inject $idb in Vue, context and store
    inject('idb', idb)
}
