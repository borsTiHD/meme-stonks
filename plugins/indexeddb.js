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
            DB_VERSION_UNKNOWN: 'Unknown DB Version'
        }

        // iDB Instanzen
        this.idb = this.init()
    }

    /**
     * init() - Initiiert Datenbanken
     * @access  private
     * @return  {object}    -> Returned Datenbank Verbindungen
     */
    async init() {
        const idb = {
            userSettings: await this.initUserSettings(1)
        }
        return idb
    }

    /**
     * initUserSettings() - Initiiert UserSettings
     * @access  private
     * @return  {object}    -> Returned Datenbank
     */
    async initUserSettings(version) {
        return await openDB('userSettings', version, {
            upgrade: async(db, oldVersion, newVersion, transaction) => {
                switch (oldVersion) {
                    case 0:
                        upgradeDB3fromV0toV1()
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
                function upgradeDB3fromV0toV1() {
                    // User Einstellungen
                    db.createObjectStore('preference')
                    transaction.objectStore('preference').put(true, 'darkMode')

                    // User Tokens
                    db.createObjectStore('tokens')
                    transaction.objectStore('tokens').put(null, 'stockApiToken')
                    transaction.objectStore('tokens').put(null, 'stockApiTokenPremium')
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
}

// Plugin Inject/Export
export default ({ app, isDev }, inject) => {
    const idb = new IndexedDb(app)

    // Inject $idb in Vue, context and store
    inject('idb', idb)
}
