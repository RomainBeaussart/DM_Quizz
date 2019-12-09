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
          class="mx-auto card"
          outlined
          >
            <ul class="messages" v-chat-scroll="{always: false, smooth: true}">
              <li 
                v-for="(msg, index) in messages" 
                :key="index"
              >
                <p><b>{{msg.sender}} ({{msg.type}}):</b> {{msg.text}}</p>
              </li>
            </ul>
            
          </v-card>
        </v-col>
      </v-row>
      <v-row class="row2" v-if="!error">
          <v-form class="form" @submit.prevent="emitChatMessage">
            <v-text-field
              v-model="userInput"
              placeholder="Placeholder"
              outlined
              class="input-field"
              required
            ></v-text-field>
            <v-btn 
            type="submit"
            large 
            class="btn" 
            color="primary"
           >Send</v-btn>
          </v-form>
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

const systemName = 'DM-Quiz System'

enum MessageType {
  SYSTEM = 'system',
  TEXT = 'text'
}

interface Message {
  sender: String;
  text: String;
  type: MessageType;
}

function isOnlineMsg (playerName: String): Message {
  return {
    sender: systemName,
    text: `player ${playerName} join the chat.`,
    type: MessageType.SYSTEM
  }
}


@Component
export default class Chat extends Vue {
   @Prop(Number) readonly chatID: number | undefined
  chatSocket = null

  players: Array<object> = []
  messages: Array<Message> = []

  points: Number = 0
  userInput: String = null

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

        // we new player join the game
        this.chatSocket.on('is_online', (player) => {
          this.players.push(player)
          this.messages.push(isOnlineMsg(player.user.name))
        })

        this.chatSocket.on('chat_message', (message: String, user) => {
          const displayMsg: Message = {
            sender: user.name,
            text: message,
            type: MessageType.TEXT
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
    this.userInput = null
  }
}

</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.row1 {
  flex-grow: 10;
}

.row2 {
  flex-grow: 1;
}

.btn {
  margin-left: 2%;
}

.card {
  max-height: 420px;
  height: 420px;
}

.messages {
  height: 400px;
  overflow-y: scroll;
  list-style: none;
  margin: 15px;
}

.input-field {
  margin: 20px;
}

.form {
  margin: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
}

</style>