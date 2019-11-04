import { Player } from './player.interface'
import { Question } from './question.class'

function preprocessAnswer (answer: string): string {
  return answer.toLocaleUpperCase()
}

export type Reward = number

export class Game {
  readonly numberOfQuestions: number

  private players: Array<Player>
  private questionNumber: number
  private questions: Array<Question>

  private waitForAnswers: boolean

  constructor (_players: Array<Player>, _questions: Array<Question>) {
    this.players = _players
    this.questions = _questions
    this.questionNumber = 1
    this.waitForAnswers = false
  }

  nextQuestion (): string {
    if (this.waitForAnswers) {
      return 'I\'m waiting for answers to the previous question'
    }

    if (this.questionNumber >= this.numberOfQuestions) {
      return 'End of game'
    }

    const question = this.questions[this.questionNumber]
    this.questionNumber++
    this.waitForAnswers = true
    return question.question
  }

  processAnswers (_answersMap: Map<Player, string>): Map<Player, Reward> {
    const rewardsMap = new Map<Player, Reward>()
    const correctAnswer = preprocessAnswer(this.questions[this.questionNumber].correctAnswer)

    for (let player of _answersMap.keys()) {
      const playerAnswer = preprocessAnswer(_answersMap.get(player))
      let reward: Reward

      if (playerAnswer === correctAnswer) {
        reward = 5
        player.points += reward
      } else {
        reward = 0
      }

      rewardsMap.set(player, reward)
    }

    this.waitForAnswers = false
    return rewardsMap
  }

  endOfGame (): Player {
    // end of game actions

    // return the winner
    const winner: Player = this.players.reduce(
      (previous: Player, current: Player) => {
        return (previous.points <= current.points) ? current : previous
      }
    )
    return winner
  }

}
