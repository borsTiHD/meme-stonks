<template>
    <v-footer absolute app class="d-flex justify-center">
        <span class="align-self-center font-weight-thin">&copy; {{ date }} All Rights Reserved</span>
        <span class="align-self-center"><v-icon color="pink">mdi-circle-small</v-icon></span>
        <span class="align-self-center font-weight-thin"><v-icon>mdi-code-tags</v-icon> with <v-icon color="pink">mdi-heart</v-icon> in Germany</span>
        <span class="align-self-center"><v-icon color="pink">mdi-circle-small</v-icon></span>
        <span class="align-self-center font-weight-thin"><a class="link" :style="darkMode ? 'color: rgba(255, 255, 255)' : 'color: rgba(0, 0, 0, 0.87)'" :href="repoUrl" target="_blank">Source at <v-icon>mdi-github</v-icon></a></span>
    </v-footer>
</template>

<script>
import pkg from './../../package.json'

export default {
    data() {
        return {
            date: `${new Date().getFullYear()}`
        }
    },
    computed: {
        repoUrl() {
            return pkg.repository.url
        },
        darkMode() {
            return this.$vuetify.theme.dark
        }
    }
}
</script>

<style scoped>
    .link {
        color: white;
        text-decoration: none;
    }
</style>
