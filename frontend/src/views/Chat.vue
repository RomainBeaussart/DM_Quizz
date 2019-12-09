<template>
    <v-container fluid class="container">
      <v-row class="row1" v-if="!error">
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
                <v-list-item-title>{{player.user.name}}</v-list-item-title>
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
                <p><b>{{msg.sender}}:</b> {{msg.text}}</p>
              </v-list-item-content>
            </v-list-item>
            
          </v-card>
        </v-col>
      </v-row>
      <v-row class="row2" v-if="!error">
        <v-col cols="10">
          <v-form>
            <v-text-field
              v-model="userInput"
              placeholder="Placeholder"
              outlined
              required
            ></v-text-field>
          </v-form>
        </v-col>
        <v-col cols="2">
          <div>
           <v-btn 
            @click="emitChatMessage"
            large 
            class="btn" 
            color="primary"
           >Send</v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="error">
        <v-col cols=12>
          <p>
            Error... sry 
          </p>
        </v-col>
      </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import createSocket from '../socket/chatSocket'
const axios = require('axios')

@Component
export default class Chat extends Vue {
   @Prop(Number) readonly chatID: number | undefined
  chatSocket

  players: Array<object> = []
  messages: Array<object> = []

  points = 0
  userInput = null

  error = null

  async mounted() {
    let res = null
    try {
      res = await axios.post('http://localhost:4000/dmquizz', {
        user: this.$store.state.user,
        config: { maxPlayers: 1 }
      })

      if (res.status === 200) {
        this.chatSocket = createSocket('1')
        this.chatSocket.on('is_online', (player) => {
          this.players.push(player)
        })

        this.chatSocket.on('chat_message', (message: String, user) => {
          const displayMsg = {
            sender: user.name,
            text: message
          }
          this.messages.push(displayMsg)
        })

        this.chatSocket.emit('new_player', this.$store.state.user)

      } else {
        this.error = 'server error'
      }
    } catch (err) {
      this.error = err
    }
  }

  emitChatMessage() {
    console.log('chat message emmission')
    this.chatSocket.emit('chat_message', this.userInput, this.$store.state.user)
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