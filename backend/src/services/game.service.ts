import { Player } from '../models/player.model'
import { Question } from '../models/question.model'
import { Game } from '../models/game.model'
import { Error } from '../models/error.model'
import { User } from '../models/user.model'
import { createPlayer } from './player.service'
import { Reward } from '../models/reward.model'

/**
 * create a game object (interface Game)
 * @param players players
 * @param questions questions of the game
 */
export const createGame = (id: number, io, users: User[], questions: Question[], maxPlayers: Number): Game => ({
  id: id,
  players: users.map(createPlayer),
  questions: questions,
  questionsDone: [],
  waitForAnswers: false,
  maxPlayers: maxPlayers,
  socketNamespace: io.of(`/${id}`),
  answers: new Map<Player, string>(),
  start: false
})

/**
 * listen on game's socket namespace
 * @param game game
 */
export const listen = (game: Game) => {
  game.socketNamespace.on('connection', (socket) => {
    socket.on('new_player', (user: User) => {
      game.socketNamespace.emit('is_online', createPlayer(user))
    })

    socket.on('disconnect', (user: User) => {
      game.socketNamespace.emit('player_is_offline', user)
    })

    socket.on('chat_message', (message: string, user: User) => {
      game.socketNamespace.emit('chat_message', message, user)
    })

    socket.on('answer', (answer: string, player: Player) => {
      if (game.waitForAnswers) {
        game.answers.set(player, answer)
        if (game.answers.values.length === game.players.length) {
          const rewards: Map<Player, Reward> = getRewards(game)
        }
      }
    })
  })
}

/**
 * get the current question of the game
 * @param game the game
 */
export const getCurrentQuestion = (game: Game) => game.questionsDone[game.questionsDone.length - 1]

/**
 * get the next question of the game
 * @param game the game
 */
export const getQuestion = (game: Game): (Question | Error) => {
  const waitingAnswersError: Error = { message: 'game is waiting for answers.' }
  if (game.waitForAnswers) return waitingAnswersError

  const endOfGameError: Error = { message: 'game.questions is empty' }
  if (game.questions.length === 0) return endOfGameError

  const question = game.questions.pop()
  game.questionsDone.push(question)

  return question
}

/**
 * preprocessing the string given as parameter
 * @param answer answer to preprocessing
 */
const preprocessAnswer = (answer: string): string => answer.toLocaleUpperCase()

/**
 * compare playerAnswer with the correct answer and returns the associated reward.
 * @param correctAnswer the correct string
 * @param playerAnswer the player string
 */
const calculateReward = (correctAnswer: string, playerAnswer: string): Reward => {
  if (playerAnswer === correctAnswer) return 5
  return 0
}

/**
 * returns the rewards given to players in function of their answers.
 * @param game
 */
export const getRewards = (game: Game): Map<Player, Reward> => {
  const rewardsMap = new Map<Player, Reward>()
  const question = getCurrentQuestion(game)
  const correctAnswer = preprocessAnswer(question.correctAnswer)

  game.answers.forEach((value: string, key: Player) => {
    const reward = calculateReward(correctAnswer, preprocessAnswer(value))
    rewardsMap.set(key, reward)
  })

  return rewardsMap
}

/**
 * get the winner of a game (who has the maximum amount of points)
 * @param game game
 */
export const getWinner = (game: Game) => game.players.reduce((previous: Player, current: Player) =>
  (previous.points <= current.points) ? current : previous
)
