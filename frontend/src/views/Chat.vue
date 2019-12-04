<template>
    <v-container fluid :justify="space-between" class="container">
      <v-row class="row1">
        <v-col cols="2">
          <v-card
            class="mx-auto card overflow-y-auto"
            outlined
          >
            <v-list-item 
              two-line
              v-for="(player, index) in players"
              :key="index"  
            >
              <v-list-item-content>
                <v-list-item-title>{{player.name}}</v-list-item-title>
                <v-list-item-subtitle>Points: {{player.points}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="10">
          <v-card
          class="mx-auto card overflow-y-auto"
          outlined
          >
            <v-list-item
              v-for="(msg, index) in messages" 
              :key="index"
            >
              <v-list-item-content>
                <p>{{msg.text}}</p>
              </v-list-item-content>
            </v-list-item>
            
          </v-card>
        </v-col>
      </v-row>
      <v-row class="row2">
        <v-col cols="10">
          <v-form>
            <v-text-field
              placeholder="Placeholder"
              outlined
            ></v-text-field>
          </v-form>
        </v-col>
        <v-col cols="2">
          <div>
           <v-btn large class="btn" color="primary">Send</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import createSocket from '../socket/chatSocket'

@Component
export default class Chat extends Vue {
  chatSocket = createSocket('1')
  players = [
    { name: 'Louis', points: 12 },
    { name: 'Louis', points: 12 },
    { name: 'Louis', points: 12 },
    { name: 'Louis', points: 12 },
    { name: 'Louis', points: 12 },
    { name: 'Louis', points: 12 },
    { name: 'Louis', points: 12 },
    { name: 'Louis', points: 12 },
  ]
  messages = [
    { text: 'test' },
    { text: 'test' },
  ]

  mounted() {
    this.chatSocket.on('is_online', function (player) {
      this.players.push(player)
    })

    this.chatSocket.on('')

    this.chatSocket.emit('new_player', this.$store.state.user)
  }
}

</script>

<style>
.container {
  height: 100%;
}

.btn {
  width: 100%;
  height: 100%;
}

.card {
  max-height: 410px;
}

.row1 {
}

.row2 {
}

</style>