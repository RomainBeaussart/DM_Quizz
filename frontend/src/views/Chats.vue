<template>
    <v-container fluid>
        <v-layout wrap>
            <v-flex xs2 style="max-height: 60px !important;"></v-flex>
            <v-flex xs8 class="d-flex align-center title" style="max-height: 60px !important;">
                Chats
            </v-flex>
            <v-flex xs2 class="d-flex align-center" style="max-height: 60px !important;">
                <v-btn
                    fab
                    dark
                >
                    <v-icon>add</v-icon>
                </v-btn>
            </v-flex>
            <v-flex md12 class="d-flex justify-center">
              <form>
                <v-text-field
                  v-model="maxPlayers"
                  label="Max players"
                  data-vv-name="name"
                  required
                ></v-text-field>
                <v-btn class="mr-4" @click="submit">submit</v-btn>
              </form>
            </v-flex>
            <v-flex md12 v-if="link" class="d-flex justify-center">
               <v-card
                  color="#385F73"
                  dark
                >
                  <v-card-title class="headline">Send this link to your friends !</v-card-title>

                  <v-card-subtitle>{{link}}</v-card-subtitle>
                </v-card>
            </v-flex>
            <!--
            <v-flex xs12 class="d-flex justify-center">
                <v-card
                    width="80%"
                    rounded
                >
                    <v-data-table
                        rounded
                        :headers="headers"
                        :items="chats"
                        class="table"
                        fixed-header
                        :loading="loading"
                    >
                        <template v-slot:item = "props">
                            <tr>
                                <td class="text-center"> {{ last(props.item.questions).question }} </td>
                                <td class="text-center"> 
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon color="primary" dark v-on="on">mdi-home</v-icon>
                                        </template>
                                        <span>Tooltip</span>
                                    </v-tooltip>
                                 </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
            -->
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import PLAYER_GAMES from '../graphql/PlayerGames.gql'
import { Apollo } from '../decorators'

@Component
export default class Chats extends Vue {


    headers = [
        { text: "Last Question", value: "" },
        { text: "Info", value: ""},
    ]

    loading = false

    get id() {
        return this.$store.state.user.id
    }

    @Apollo({
        query: PLAYER_GAMES,
        variables() {
            return {
                id: this.id
            }
        },
        skip() {
            return !this.id
        },
        result({ data, loading, networkStatus }) {
            this.loading = loading
            if (!loading) {
                if (data && data.player && data.player.games) {
                    
                }
            }
        }
    })
    chats= []
    link = null
    maxPlayers = null

    async submit() {
      const axios = require('axios')
      const res = await axios.post('http://localhost:4000/dmquizz', {
        user: this.$store.state.user,
        config: { maxPlayers: parseInt(this.maxPlayers, 10) }
      })
      this.link = res.data.url
    }

    last(list: Array<any>) {
        return list[list.length - 1]
    }

}
</script>

<style>

</style>