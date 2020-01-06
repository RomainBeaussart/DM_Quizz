<template>
    <v-container fluid class="d-flex justify-center align-center fill-height">
        <v-card
            width="60%"
            rounded
        >
        <v-layout wrap pa-5>
            <v-flex xs12>
                <v-text-field
                    v-model="user"
                    label="Login"
                    solo
                    class="d-flex align-center"
                    elevation="0"
                >
                </v-text-field>
            </v-flex>
            <v-flex xs8>
                <v-text-field
                    v-model="password"
                    label="Password"
                    solo
                ></v-text-field>
            </v-flex>
            <v-flex xs12>
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
            debugger
            this.$store.commit('setUserId', result.data.login.id)
        }
        console.log(this.$store.state.user.id)
        this.$router.push({name: 'chats' })

    }

}
</script>

<style>

</style>