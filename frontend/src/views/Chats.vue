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
                        <!-- BODY -->
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

    last(list: Array<any>) {
        return list[list.length - 1]
    }

}
</script>

<style>

</style>