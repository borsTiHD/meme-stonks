<template>
    <v-card class="flex d-flex flex-column">
        <v-card-title class="headline">News:</v-card-title>
        <v-card-text>
            <v-row dense>
                <v-col class="pb-0">
                    <div class="d-flex flex-row">
                        <div class="font-weight-medium">Name:</div>
                        <div class="pl-2">xxx</div>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            loadingData: false,
            news: []
        }
    },
    computed: {
        ...mapGetters({
            getRapidBaseUrl: 'getRapidBaseUrl',
            getRapidApiToken: 'getRapidApiToken',
            getCurrentStock: 'stock/getCurrentStock'
        }),
        stockName() {
            if (!this.getCurrentStock) {
                return ''
            }
            return this.getCurrentStock.name
        }
    },
    watch: {
        // Fetcht neue News wenn Stock geändert wird
        getCurrentStock() {
            this.fetchNews().catch((err) => {
                console.error(err)
                this.loadingData = false
            })
        }
    },
    methods: {
        fetchNews() {
            return new Promise((resolve, reject) => {
                console.log('[App] -> Fetching News for Stock')

                // Fetcht keine Daten, wenn keine Aktie ausgewählt wurde
                if (!this.getCurrentStock) {
                    return reject(new Error('No Stock Selected'))
                }

                // Kein ApiToken -> KEIN FETCHING!
                if (!this.getRapidApiToken || this.getRapidApiToken === 'null' || this.getRapidApiToken === '') {
                    return reject(new Error('No Api Token'))
                }

                this.loadingData = true

                // News URL
                const url = `https://${this.getRapidBaseUrl}/news/search`
                const options = {
                    params: {q: this.stockName, freshness: 'Day', textFormat: 'Raw', safeSearch: 'Off'},
                    headers: {
                        'x-bingapis-sdk': 'true',
                        'x-rapidapi-key': this.getRapidApiToken,
                        'x-rapidapi-host': this.getRapidBaseUrl
                    }
                }

                this.$axios.get(url, options)
                    .then((res) => {
                        console.log('[APP] -> Stock News:', res)
                    }).catch((error) => {
                        console.log(error)
                        return reject(error)
                    }).finally(() => {
                        this.loadingData = false
                        return resolve(true)
                    })
            })
        }
    }
}
</script>
