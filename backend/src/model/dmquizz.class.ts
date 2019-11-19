import { Game, Reward } from './game.class'
import { Player } from './player.interface'
import axios from 'axios'
import { Question } from './question.class'

export class DmQuizz {
  readonly nbOfPlayersRequired: number = 1
  readonly id: number

  private nextPlayerId: number
  private players: Array<Player>

  identifier: string
  game: Game
  gameStarted: boolean
  socketNamespace: any
  answers: Map<Player, string>
  needAnswer: boolean

  constructor (_identifier: string, _io) {
    this.identifier = _identifier
    this.gameStarted = false
    this.nextPlayerId = 0
    this.players = []
    console.log(_identifier)
    this.socketNamespace = _io.of(`/${this.identifier}`)
    this.listen()
  }

  listen () {
    this.socketNamespace.on('connection', (socket) => {
      socket.on('username', (username: string) => {
        const player: Player = {
          id: this.nextPlayerId,
          name: username,
          points: 0
        }
        this.nextPlayerId++
        socket.player = player
        this.join(player)
        this.socketNamespace.emit('is_online', '🔵 <i>' + socket.player.name + ' join the chat..</i>')
      })

      socket.on('disconnect', (username: string) => {
        this.socketNamespace.emit('is_online', '🔴 <i>' + socket.player.name + ' left the chat..</i>')
      })

      socket.on('chat_message', (message: string) => {
        this.handlePlayerMessage(socket.player.id, message)
        .then(() => console.log(`message "${message}" received from ${socket.player.name}.`))
        .catch((err) => console.error(err))
      })
    })
  }

  private async handlePlayerMessage (playerId: number, message: string) {
    const player: Player = this.players.find((player: Player) => player.id === playerId)

    if (this.needAnswer) {
      this.answers.set(player, message)
    }

    this.socketNamespace.emit('chat_message', '<strong>' + player.name + '</strong>: ' + message)
  }

  private async play () {
    console.log('play function call', this.game.numberOfQuestions)
    for (let i = 0; i < this.game.numberOfQuestions; i++) {
      this.socketNamespace.emit('chat_message', this.game.nextQuestion())
      this.answers = new Map<Player, string>()
      this.socketNamespace.emit('chat_message', 'You have 20s for answer to the question.')
      this.needAnswer = true
      await this.waitForAnswers(20000)
      this.needAnswer = false
      this.socketNamespace.emit('chat_message', `The correct answer was ${this.game.correctAnswer}`)
      const rewardsMap: Map<Player, Reward> = this.game.processAnswers(this.answers)
      rewardsMap.forEach(
        (value: Reward, key: Player) => this.socketNamespace.emit('chat_message', `The player ${key.name} won ${value} (TOTAL POINTS = ${key.points})`)
      )
    }
    return true
  }

  private async waitForAnswers (time: number) {
    return new Promise(r => setTimeout(r, time))
  }

  join (_player: Player): number {
    if (this.gameStarted) return -1
    const nbPlayers = this.players.push(_player)
    const remainingNbOfPlayers = this.nbOfPlayersRequired - nbPlayers
    if (remainingNbOfPlayers === 0) {
      axios.get('https://opentdb.com/api.php?amount=15&difficulty=easy&type=multiple')
      .then((res) => {
        const data = res.data.results
        console.log(data)
        const questions: Array<Question> = data.map(
          (questionFromApi: any) => new Question(questionFromApi.category, questionFromApi.question, questionFromApi.correct_answer, questionFromApi.incorrect_answers)
        )
        this.game = new Game(this.players, questions)
        this.gameStarted = true

        this.play()
        .then((isSuccess: boolean) => {
          if (isSuccess) console.log('Play exits with success code')
        })
        .catch(err => console.error(err))

      })
      .catch((err) => console.error(err))
    }
    return remainingNbOfPlayers
  }

}
