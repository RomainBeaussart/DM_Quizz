<template>
    <v-container fluid class="d-flex justify-center align-center fill-height">
        <v-card
            width="60%"
            rounded
        >
            <v-text-field
                v-model="user"
                label="Login"
                solo
                elevation="0"
            ></v-text-field>
            <v-text-field
                v-model="password"
                label="Password"
                solo
            ></v-text-field>
            <v-btn
                color="primary"
                @click="login()"
            >
                Login
            </v-btn>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator"

@Component
export default class Login extends Vue {
    user = ""
    password = ""

    login() {
        console.log(this.user, this.password)
    }

}
</script>

<style>

</style>