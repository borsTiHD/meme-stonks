<template>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
        <v-list nav>
            <v-list-item two-line>
                <v-list-item-avatar>🚀</v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title>Application</v-list-item-title>
                    <v-list-item-subtitle>to the moon</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider class="pa-1" />
            <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
                <v-list-item-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title v-text="item.title" />
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            clipped: true,
            items: [
                {
                    icon: 'mdi-apps',
                    title: 'Welcome',
                    to: '/'
                },
                {
                    icon: 'mdi-note-text-outline',
                    title: 'Stock',
                    to: '/stock'
                },
                {
                    icon: 'mdi-cogs',
                    title: 'Settings',
                    to: '/settings'
                }
            ]
        }
    },
    computed: {
        ...mapGetters({
            getDrawer: 'layout/getDrawer'
        }),
        drawer: {
            get() {
                return this.getDrawer
            },
            set(value) {
                this.setDrawer(value)
            }
        }
    },
    methods: {
        ...mapActions({
            setDrawer: 'layout/setDrawer'
        })
    }
}
</script>
