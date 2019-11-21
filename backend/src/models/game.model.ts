import { Player } from './player.model'
import { Question } from './question.model'

export interface Game {
  id: number
  players: Array<Player>
  questions: Array<Question>
  questionsDone: Array<Question>
  waitForAnswers: boolean,
  socketNamespace: any,
  answers: Map<Player, string>
}
