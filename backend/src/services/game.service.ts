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
 * Handle the next question of a game object given as parameter.
 * @param game the game
 */
function handleNextQuestion (game: Game) {
  if (game.questions.length > 0) {
    const question = getQuestion(game)
    game.waitForAnswers = true
    game.socketNamespace.emit('new_question', question)
    setTimeout(() => {
      game.waitForAnswers = false
      const rewards: Map<Player, number> = getRewards(game)
      const results: Array<Player> = applyRewards(rewards, game)
      game.socketNamespace.emit('results', results)
      setTimeout(() => handleNextQuestion(game), 5000)
    }, 26000)
  } else {
    // end of game
    game.socketNamespace.emit('end_of_game', getWinner(game))
  }
}

/**
 * listen on game's socket namespace
 * @param game game
 */
export const listen = (game: Game) => {
  game.socketNamespace.on('connection', (socket) => {

    // new player join the game
    socket.on('new_player', (user: User) => {
      const newPlayer = createPlayer(user)

      // add the player to the game object
      if (!game.start && !game.players.map(_ => _.user.name).includes(newPlayer.user.name)) {
        game.players.push(newPlayer)
      }

      // notify the other players by emitting 'is_online'
      game.socketNamespace.emit('is_online', newPlayer)

      // start the game if the maxPlayers number = length of players array
      if (game.players.length === game.maxPlayers) {
        game.socketNamespace.emit('start')
        setTimeout(() => {
          game.start = true
          handleNextQuestion(game)
        }, 2000)
      }

    })

    // a player quits the game
    socket.on('disconnect', (user: User) => {
      game.players = game.players.filter((player: Player) => player.user.name !== user.name)
      game.socketNamespace.emit('is_offline', user)
    })

    /** Basic chat message */
    socket.on('chat_message', (message: string, user: User) => {
      game.socketNamespace.emit('chat_message', message, user)
    })

    /** answer to a question */
    socket.on('answer', (answer: string, user: User) => {
      if (game.waitForAnswers && answer) {
        const player: Player = game.players.find((player: Player) => player.user.id === user.id)

        game.answers.set(player, answer)
        if (game.answers.values.length === game.players.length) {
          game.waitForAnswers = false
        }
        game.socketNamespace.emit('answer_accepted', user)
      } else {
        game.socketNamespace.emit('answer_rejected', user)
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
 * Apply the rewards to the game object given as parameter.
 * @param rewards rewards map.
 * @param game the game object to apply rewards.
 */
function applyRewards (rewards: Map<Player, number>, game: Game): Array<Player> {
  const rewardedPlayers: Array<Player> = []
  rewards.forEach((value: number, key: Player) => {
    if (value > 0) {
      const thePlayer = game.players.find((player: Player) => player.user.id === key.user.id)
      thePlayer.points += value
      rewardedPlayers.push(thePlayer)
    }
  })
  return rewardedPlayers
}

/**
 * returns the rewards given to players in function of their answers.
 * @param game
 */
const getRewards = (game: Game): Map<Player, Reward> => {
  const rewardsMap = new Map<Player, Reward>()
  const question = getCurrentQuestion(game)
  const correctAnswer = preprocessAnswer(question.correctAnswer)
  console.log('preprocessed correct answer:', correctAnswer)

  game.answers.forEach((value: string, key: Player) => {
    console.log('evaluate reward for', key)
    const reward = calculateReward(correctAnswer, preprocessAnswer(value))
    console.log('Reward = ', reward)
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
