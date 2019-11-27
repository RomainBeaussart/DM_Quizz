<template>
    <v-app>
        <v-app-bar
            app
            color="primary"
            dark
        >
            <v-layout wrap>
                <v-flex xs2 class="d-flex justify-center">
                </v-flex>
                <v-flex xs8 class="d-flex justify-center">
                    <span 
                        @click="$router.push({ name: 'home'})"
                        class="title" style="cursor: pointer"
                    >
                        DM Quizz<v-icon>quizz</v-icon></span>
                </v-flex>
                <v-flex xs2 class="d-flex justify-end">
                </v-flex>
            </v-layout>
        </v-app-bar>
        <v-content>
            <router-view/>
        </v-content>
    </v-app>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class Index extends Vue {}
</script>
<style>
</style>
