import { openDB } from 'idb'

/**
 * IndexedDb Class
 */
class IndexedDb {
    constructor(app) {
        // Nuxt App Instanz
        this.$app = app

        // Error Messages
        this.err = {
            DB_VERSION_UNKNOWN: 'Unknown DB Version',
            DB_PUT_MISSING_PARAMETER: 'Missing or Empty Parameter',
            DB_GET_MISSING_PARAMETER: 'Missing or Empty Parameter'
        }

        // iDB Instanzen
        this.idb = this.init()
    }

    /**
     * init() - Initiiert Datenbanken
     * @access  private
     * @return  {object}    -> Returned Datenbank Verbindungen
     */
    init() {
        return [
            {
                name: 'userSettings',
                db: this.initUserSettings(1)
            },
            {
                name: 'app',
                db: this.initAppDb(1)
            }
        ]
    }

    /**
     * initUserSettings() - Initiiert UserSettings
     * @access  private
     * @param   {number}    version     -> Aktuelle Version, mit der die DB initialisiert werden soll
     * @return  {object}                -> Returned Datenbank
     */
    async initUserSettings(version) {
        return await openDB('userSettings', version, {
            upgrade: async(db, oldVersion, newVersion, transaction) => {
                switch (oldVersion) {
                    case 0:
                        upgradeV0toV1()
                        break // break entfernen wenn weitere Upgrades hinzukommen
                        // falls through
                    /*
                    case 1:
                        upgradeDB3fromV1toV2()
                        // falls through
                    case 2:
                        await upgradeDB3fromV2toV3()
                        break
                    */
                    default:
                        console.error(this.err.DB_VERSION_UNKNOWN)
                }

                // Erstellt Datenbank Struktur
                function upgradeV0toV1() {
                    // User Einstellungen
                    db.createObjectStore('preference')
                    transaction.objectStore('preference').put(true, 'darkMode')

                    // User Tokens
                    db.createObjectStore('tokens')
                    transaction.objectStore('tokens').put(null, 'stockApiToken')
                    transaction.objectStore('tokens').put(null, 'stockApiTokenPremium')

                    // User Exchange
                    db.createObjectStore('selectedExchange')
                    transaction.objectStore('selectedExchange').put(null, 'exchange')
                }

                /*
                function upgradeDB3fromV1toV2() {
                    db.createObjectStore('userPreference')
                    transaction.objectStore('userPreference').add(false, 'useDarkMode')
                    transaction.objectStore('userPreference').add(25, 'resultsPerPage')
                }
                async function upgradeDB3fromV2toV3() {
                    const store = transaction.objectStore('userPreference')
                    store.put('English', 'language')
                    store.delete('resultsPerPage')
                    let colorTheme = 'automatic'
                    const useDarkMode = await store.get('useDarkMode')
                    if (oldVersion === 2 && useDarkMode === false) colorTheme = 'light'
                    if (oldVersion === 2 && useDarkMode === true) colorTheme = 'dark'
                    store.put(colorTheme, 'colorTheme')
                    store.delete('useDarkMode')
                }
                */
            }
        })
    }

    /**
     * initAppDb() - Initiiert initAppDb
     * @access  private
     * @param   {number}    version     -> Aktuelle Version, mit der die DB initialisiert werden soll
     * @return  {object}                -> Returned Datenbank
     */
    async initAppDb(version) {
        return await openDB('app', version, {
            upgrade: async(db, oldVersion, newVersion, transaction) => {
                switch (oldVersion) {
                    case 0:
                        upgradeV0toV1()
                        break // break entfernen wenn weitere Upgrades hinzukommen
                        // falls through
                    /*
                    case 1:
                        upgradeDB3fromV1toV2()
                        // falls through
                    case 2:
                        await upgradeDB3fromV2toV3()
                        break
                    */
                    default:
                        console.error(this.err.DB_VERSION_UNKNOWN)
                }

                // Erstellt Datenbank Struktur
                function upgradeV0toV1() {
                    // Exchanges
                    db.createObjectStore('exchanges')
                }
            }
        })
    }

    /**
     * getDb() - Sucht Datenbank Object by Name
     * @param   {string}    name    -> Name der DB die gesucht werden soll
     * @return  {object}            -> Returned Datenbank Verbindungen
     */
    async getDb(name) {
        // Wird kein parameter zur Suche angegeben, werden ALLE Datenbanken zurückgegeben
        if (!name) return this.idb
        // Liefert das erste mit gleichen Namen, oder Symbol gefundene StockData Objekt zurück
        const { db } = await this.idb.find((dbs) => dbs.name === name)
        return db
    }

    /**
     * putValue() - Setzt, oder ersetzt einen Wert in einer Datenbank
     * @param   {string}    dbName      -> Name der DB die gesucht werden soll
     * @param   {string}    storeName   -> Name des Stores, der verwendet werden soll
     * @param   {string}    key         -> Key Name
     * @param   {any}       value       -> Value, der gespeichert werden soll
     */
    putKeyValue(dbName, storeName, key, value) {
        if (!dbName || !storeName || !key) {
            return new Error(this.err.DB_PUT_MISSING_PARAMETER)
        }

        // Holt sich gewünschte DB und setzt anschließend Value
        this.getDb(dbName).then((db) => {
            db.put(storeName, value, key)
        })
    }

    /**
     * getKeyValue() - Holt einen Wert aus einer Datenbank
     * @param   {string}    dbName      -> Name der DB die gesucht werden soll
     * @param   {string}    storeName   -> Name des Stores, der verwendet werden soll
     * @param   {string}    key         -> Key Name
     * @return  {any}                   -> Returned gespeicherten Wert
     */
    async getKeyValue(dbName, storeName, key) {
        if (!dbName || !storeName || !key) {
            return new Error(this.err.DB_GET_MISSING_PARAMETER)
        }

        return new Promise((resolve, reject) => {
            // Holt sich gewünschte DB und setzt anschließend Value
            this.getDb(dbName).then((db) => {
                db.get(storeName, key).then((res) => {
                    return resolve(res)
                }).catch((err) => {
                    return reject(err)
                })
            })
        })
    }
}

// Plugin Inject/Export
export default ({ app, isDev }, inject) => {
    const idb = new IndexedDb(app)

    // Inject $idb in Vue, context and store
    inject('idb', idb)
}
