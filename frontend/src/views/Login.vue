<template>
    <v-container fluid class="d-flex justify-center align-center fill-height">
        <v-card
            width="60%"
            rounded
        >
        <v-layout wrap pa-5 class="d-flex justify-center">
            <v-flex xs8 class="d-flex justify-center title" pb-2>
                Login
            </v-flex>
            <v-flex xs8>
                <v-text-field
                    v-model="user"
                    label="Login"
                    class="d-flex align-center"
                    outlined
                >
                </v-text-field>
            </v-flex>
            <v-flex xs8>
                <v-text-field
                    v-model="password"
                    label="Password"
                    :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
                    :type="passwordShow ? 'text' : 'password'"
                    @click:append="passwordShow = !passwordShow"
                    outlined
                ></v-text-field>
            </v-flex>
            <v-flex xs6 class="d-flex align-top">
                <router-link to="signup">Sign up</router-link>
            </v-flex>
            <v-flex xs6 class="d-flex justify-end">
                <v-btn
                    color="primary"
                    @click="login()"
                >
                    Login
                </v-btn>
            </v-flex>
            </v-layout>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator"

import LOGIN from '../graphql/Login.gql'

@Component
export default class Login extends Vue {
    user = ""
    password = ""
    passwordShow = false

    async login() {
        console.log(this.user, this.password)
        let result = await this.$apollo.query({
            query: LOGIN,
            variables: {
                username: this.user,
                password: this.password
            }
        })
        if (result.data && result.data.login && result.data.login.id) {
            this.$store.commit('setUser', { id: result.data.login.id, name: result.data.login.name })
        }
        console.log(this.$store.state.user.id)
        this.$router.push({name: 'chats' })
    }

}
</script>

<style>

</style>