<template>
    <v-container fluid>

    </v-container>
</template>

<script>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import GAMES from '../graphql/Games.gql'
import { Apollo } from '../decorators'

@Component
export default class Chats extends Vue {

    get id() {
        return "zegpznrigp"
    }

    @Apollo({
        query: GAMES,
        variables() {
            return {
                id: this.id
            }
        },
        result({ data, loading, networkStatus }) {
            if (!loading) {
                if (data && data.serie) {
                    this.chats = data.chats
                }
            }
        }
    })
    chats= []

}
</script>

<style>

</style>