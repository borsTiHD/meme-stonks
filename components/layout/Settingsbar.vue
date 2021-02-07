<template>
    <v-navigation-drawer v-model="rightDrawer" right temporary fixed>
        <v-list nav>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">
                        Application
                    </v-list-item-title>
                    <v-list-item-subtitle>Settings</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="changeDarkMode">
                <v-list-item-action>
                    <v-icon>mdi-star</v-icon>
                </v-list-item-action>
                <v-list-item-title>{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {}
    },
    computed: {
        ...mapGetters({
            getRightDrawer: 'layout/getRightDrawer'
        }),
        rightDrawer: {
            get() {
                return this.getRightDrawer
            },
            set(value) {
                this.setRightDrawer(value)
            }
        },
        darkMode() {
            return this.$vuetify.theme.dark
        }
    },
    methods: {
        ...mapActions({
            setRightDrawer: 'layout/setRightDrawer'
        }),
        changeDarkMode() {
            if (this.darkMode) {
                this.$vuetify.theme.dark = false
            } else {
                this.$vuetify.theme.dark = true
            }
        }
    }
}
</script>
