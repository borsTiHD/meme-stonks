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
            this.fetchNews().catch(() => {
                // console.error(err)
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

                this.loadingData = true

                // News URL
                const url = `http://news.google.com/news?q=${this.stockName}&output=rss`

                this.$axios.get(url, { crossdomain: true })
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
