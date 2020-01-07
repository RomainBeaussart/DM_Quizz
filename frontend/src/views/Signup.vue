<template>
    <v-container fluid class="d-flex justify-center align-center fill-height">
        <v-card
            width="60%"
            rounded
        >
            <v-layout wrap pa-5 class="d-flex justify-center">
            <v-flex xs8 class="d-flex justify-center title" pb-2>
                Sign up
            </v-flex>
                <v-flex xs8>
                    <v-text-field
                        v-model="username"
                        :rules="[rules.username]"
                        label="Pseudo"
                        outlined
                    >
                    </v-text-field>
                </v-flex>
                <v-flex xs8>
                    <v-text-field
                        v-model="password"
                        label="Mot de passe"
                        :rules="[rules.password]"
                        :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
                        :type="passwordShow ? 'text' : 'password'"
                        @click:append="passwordShow = !passwordShow"
                        outlined
                    ></v-text-field>
                </v-flex>
                <v-flex xs8>
                    <v-text-field
                        v-model="rePassword"
                        label="Confirmez votre mot de passe"
                        :rules="[rules.rePassword]"
                        :append-icon="rePasswordShow ? 'visibility' : 'visibility_off'"
                        :type="rePasswordShow ? 'text' : 'password'"
                        @click:append="rePasswordShow = !rePasswordShow"
                        outlined
                    ></v-text-field>
                </v-flex>
                <v-flex xs6 class="d-flex align-top">
                    <router-link to="/">Login</router-link>
                </v-flex>
                <v-flex xs6 class="d-flex justify-end">
                    <v-btn
                        @click="signup()"
                    >Sign Up</v-btn>
                </v-flex>
            </v-layout>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator"
import bcrypt from 'bcryptjs'

import SIGN_UP from '../graphql/CreatePlayer.gql'
import USERNAME_VERIF from '../graphql/UsernameVerif.gql'
import { Apollo } from '../decorators'

@Component
export default class Login extends Vue {
    username = ""
    password = ""
    rePassword = ""
    passwordShow = false
    rePasswordShow = false
    
    get rules() {
        return {
            username: !this.usernameIsset || this.username + " est déjà utilisé",
            password: (this.password.length >= 4 || this.password.length === 0) || "Min 4 characters",
            rePassword: (this.rePassword === this.password || this.rePassword.length === 0) || "Les mots de passes ne correspondents pas",
        }
    }

    @Apollo({
        query: USERNAME_VERIF,
        variables() {
            return {
                username: this.username,
            }
        },
        result({ data, loading, networkStatus }: any) {
            if (!loading) {
                if (data && data.username && data.username.aggregate.count === 0) {
                    this.usernameIsset = false
                } else {
                    this.usernameIsset = true
                }
            }
        }
    })
    usernameIsset: boolean = false
    
    async signup() {
        if(this.usernameIsset == false && this.password === this.rePassword){
            await this.$apollo.mutate({
                mutation: SIGN_UP,
                variables: {
                    name: this.username,
                    password: await bcrypt.hash(this.password, 10)
                }
                
            })
        }
    }

}
</script>

<style>

</style>