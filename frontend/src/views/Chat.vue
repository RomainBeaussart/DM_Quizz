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
        <v-col cols="8">
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
        <v-col cols="2">
          <v-card
          class="mx-auto card"
          outlined
          >
            <div class="section timer">
              <h3>Timer</h3>
              <p class="timer-value">{{timerValue}}</p>
            </div>
            <v-divider></v-divider>
            <div class="section state">
              <h3>State</h3>
              <p>{{state}}</p>
            </div>
            <v-divider></v-divider>
          </v-card>
        </v-col>
        <v-snackbar
          v-model="snackbar"
        >
          New question !
          <v-btn
            color="primary"
            text
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>

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

function getStringAnswers (answers: Array<String>): String {
  let str: String = ''
  answers.forEach((answer: String, index: number) => {
    str += `| ${answer} |`
  })
  str += ''
  return str
}


@Component
export default class Chat extends Vue {
  @Prop(Number) readonly chatID: number | undefined
  state = "Wait for players"
  chatSocket = null
  snackbar: Boolean = false

  timerValue = 0
  timerInterval = null

  isAnswer: boolean = false

  players: Array<any> = []
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
          this.players = this.players.filter((player: any) => player.user.name === user.name)
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
          this.state = 'game started'

          this.messages.push({
            sender: systemName,
            text: 'the game are going to start !',
            type: MessageType.SYSTEM
          })
        })

        // receive a question
        this.chatSocket.on('new_question', (question) => {

          console.log(question)
          this.messages.push({
            sender: systemName,
            text: `${question.question} (${question.category}). POSSIBLE ANSWERS: ${getStringAnswers(question.answers)}`,
            type: MessageType.QUESTION
          })
          this.startTimer(20)
          this.state = 'wait for answer'

          this.snackbar = true
        })

        // answer rejected
        this.chatSocket.on('answer_rejected', (user) => {
          this.messages.push({
            sender: systemName,
            text: `The ${user.name}'s answer has been rejected.`,
            type: MessageType.SYSTEM
          })
        })

        // answer accepted
        this.chatSocket.on('answer_accepted', (user) => {
          this.messages.push({
            sender: systemName,
            text: `The ${user.name}'s answer has been accepted.`,
            type: MessageType.SYSTEM
          })
        })

        // receive the results for the last question
        this.chatSocket.on('results', (rewards: Array<any>) => {
          this.state = 'results'
          this.messages.push({
            sender: systemName,
            text: 'Results are...',
            type: MessageType.SYSTEM
          })
          if (rewards.length > 0) {
            rewards.forEach(player => {
              const localInstanceOfPlayer = this.players.find((p) => p.user.name === player.user.name)
              if (localInstanceOfPlayer) {
                localInstanceOfPlayer.points = player.points
              }
              this.messages.push({
                sender: systemName,
                text: `The player ${player.user.name} answer correctly !`,
                type: MessageType.SYSTEM
              })
            })
            
          } else {
            this.messages.push({
              sender: systemName,
              text: 'nobody answer correctly to the question',
              type: MessageType.SYSTEM
            })
          }
           
        })

        // end of game event
        this.chatSocket.on('end_of_game', (winner) => {
          this.state = 'end of game'
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

  startTimer (seconds: number) {
    this.timerValue = seconds
    this.timerInterval = setInterval(() => this.countDown(), 1000)
  }

  countDown () {
    if (this.timerValue === 0) {
      this.stopTimer()
    } else {
      this.timerValue--
    }
  }

  stopTimer () {
    clearInterval(this.timerInterval)
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
  margin: 0;
}

.btn {
  margin-left: 2%;
}

.card {
  height: 100%;
  height: 70vh;
}

.messages {
  height: 65vh;
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

.section {
  padding: 4%;
}

.timer-value {
  font-size: 5em;
  color: #66BB6A;
  width: 100%;
  text-align: center;
}

</style>