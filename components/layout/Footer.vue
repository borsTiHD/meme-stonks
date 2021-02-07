<template>
    <v-footer absolute app>
        <span>&copy; {{ date }}</span>
    </v-footer>
</template>

<script>
export default {
    data() {
        return {
            date: `${new Date().getFullYear()}`
        }
    }
}
</script>
