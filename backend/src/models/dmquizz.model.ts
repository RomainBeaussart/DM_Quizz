import { Game, Reward } from './game.model'
import { Player } from './player.model'
import axios from 'axios'
import { Question } from './question.model'

export class DmQuizz {
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
