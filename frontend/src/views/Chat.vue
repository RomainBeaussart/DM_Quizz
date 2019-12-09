<template>
    <v-container fluid class="container" v-on:keyup.page-down="switchValue()">
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
            <div class="switch-container">
              <span v-if="isAnswer">ANSWER</span>
              <span v-else>TEXT</span>
              <v-switch 
                inset 
                color="primary" 
                v-model="isAnswer" 
                class="switch" 
                label="press 'page-down'"
              ></v-switch>
            </div>
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
  TEXT = 'text',
  QUESTION = 'question',
  WINNER = 'winner'
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

function isOfflineMsg (playerName: String): Message {
  return {
    sender: systemName,
    text: `player ${playerName} has been disconnected.`,
    type: MessageType.SYSTEM
  }
}


@Component
export default class Chat extends Vue {
   @Prop(Number) readonly chatID: number | undefined
  chatSocket = null

  isAnswer: boolean = false

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
        this.chatSocket.on('is_online', (player: any) => {
          this.players.push(player)
          this.messages.push(isOnlineMsg(player.user.name))
        })

        // a player is offline
        this.chatSocket.on('is_offline', (user) => {
          this.players = this.players.filter((player: any) => player.user.name = user.name)
          this.messages.push(isOfflineMsg(user.name))
        })

        // receive chat message
        this.chatSocket.on('chat_message', (message: String, user) => {
          const displayMsg: Message = {
            sender: user.name,
            text: message,
            type: MessageType.TEXT
          }
          this.messages.push(displayMsg)
        })

        // the game are going to start
        this.chatSocket.on('start', () => {
          this.messages.push({
            sender: systemName,
            text: 'the game are going to start !',
            type: MessageType.SYSTEM
          })
        })

        // receive a question
        this.chatSocket.on('new_question', (question) => {
          this.messages.push({
            sender: systemName,
            text: 'new question ! 20 seconds to answer it !',
            type: MessageType.SYSTEM
          })
          this.messages.push({
            sender: systemName,
            text: `${question.question} (${question.category})`,
            type: MessageType.QUESTION
          })
        })

        // answer rejected
        this.chatSocket.on('answer_rejected', (user) => {
          console.log(user)
          this.messages.push({
            sender: systemName,
            text: `The ${user.name}'s answer has been rejected.`,
            type: MessageType.SYSTEM
          })
        })

        // answer accepted
        this.chatSocket.on('answer_accepted', (user) => {
          console.log(user)
          this.messages.push({
            sender: systemName,
            text: `The ${user.name}'s answer has been accepted.`,
            type: MessageType.SYSTEM
          })
        })

        // receive the results for the last question
        this.chatSocket.on('results', (rewards: any) => {
          this.messages.push({
            sender: systemName,
            text: 'Results are...',
            type: MessageType.SYSTEM
          })
          console.log(rewards)
          if (rewards) {
            this.messages.push({
              sender: systemName,
              text: `${rewards}`,
              type: MessageType.SYSTEM
            })
          } else {
            this.messages.push({
              sender: systemName,
              text: 'nobody answer to the question',
              type: MessageType.SYSTEM
            })
          }
           
        })

        // end of game event
        this.chatSocket.on('end_of_game', (winner) => {
          this.messages.push({
            sender: systemName,
            text: `END OF GAME !! The winner is ${winner.user.name} with ${winner.points} points.`, 
            type: MessageType.WINNER
          })
        })

        // join the game instance
        this.chatSocket.emit('new_player', this.$store.state.user)
      } else {
        this.error = 'server error'
      }
    } catch (err) {
      this.error = err
    }
  }

  emitChatMessage() {
    if (this.isAnswer) {
      this.chatSocket.emit('answer', this.userInput, this.$store.state.user)
    } else {
      this.chatSocket.emit('chat_message', this.userInput, this.$store.state.user)
    }
    this.userInput = null
  }

  switchValue () {
    this.isAnswer = !this.isAnswer
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

.switch {
  margin-top: 0;
  margin-bottom: 0;
  width: 100%;
}

.switch-container {
  margin-right: 2%;
  margin-left: 1%; 
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>