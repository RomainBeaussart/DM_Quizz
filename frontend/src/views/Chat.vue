<template>
    <v-container fluid>
      <v-container md6>
        <v-container md3>
          // listOfPlayers
        </v-container>
        <v-container md9>
          // Messages

        </v-container>
      </v-container>
      <v-container md6>
        
      </v-container>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class Chat extends Vue {
  data() {
    return {
      players: [],
    }
  }
}
</script>

<style>

</style>