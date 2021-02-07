<template>
    <v-navigation-drawer v-model="rightDrawer" right temporary fixed>
        <v-list>
            <v-list-item>
                <v-list-item-action>
                    <v-icon light> mdi-repeat </v-icon>
                </v-list-item-action>
                <v-list-item-title>Switch drawer (click me)</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
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
        }
    },
    methods: {
        ...mapActions({
            setRightDrawer: 'layout/setRightDrawer'
        })
    }
}
</script>
