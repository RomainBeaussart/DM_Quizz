<template>
    <v-container raw fluid xs12 style="margin: 0; padding: 0">
        <v-app-bar fixed app class="elevation-0" style="background: rgba(0,0,0,0)" v-if="currentUser" pa-0 ma-0>
            <v-toolbar dense class="elevation-0 fill-width" style="background: rgba(0,0,0,0)" fixed>
                <v-btn
                    style="margin-top: 5vh"
                    fab
                    elevation="0"
                    color="white"
                >
                    <v-icon >apps</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-toolbar-title class="headline text-uppercase white--text">
                    <img src="../assets/img/logo.svg" height="30px" />
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <!-- <v-btn
                    text
                    @click="logout()"
                    class="white--text"
                >Logout</v-btn> -->
            </v-toolbar>
        </v-app-bar>
        <router-view style="height: 100%; width: 100%; margin: 0; max-width: 100%; padding: 0 0 !important;"></router-view>
    </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class Index extends Vue {
    
    get currentUser() {
        return this.$store.state.user.id;
    }

    logout() {
        localStorage.removeItem("apollo-token");
        this.$store.commit("logoutUser");
        location.reload();
    }
}
</script>
<style>

</style>
