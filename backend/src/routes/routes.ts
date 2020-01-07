import { Router, Request, Response } from 'express'
import { Game } from '../models/game.model'
import { User } from '../models/user.model'
import { createGame, listen } from '../services/game.service'
import { Question } from '../models/question.model'
import getQuestions from '../_api'
import { SERVER_IP, SOCKET_PORT } from '..'

export const appRouter = () => {
  const router = Router()
  const games: Array<Game> = []

  /**
   * create a chat / a game instance
   * body du post =
   * {
   *    user: {
   *    },
   *    config: {
   *      maxPlayers
   *    }
   * }
   */
  router.post('/dmquizz', (req: Request, res: Response) => {
    console.log('create a new game instance')
    console.log(req.body)
    const user: User = req.body.user
    const gameConfig = req.body.config

    if (!user || !gameConfig || !gameConfig.maxPlayers) {
      res.sendStatus(500)
    }
    getQuestions()
      .then((questions: Array<Question>) => {
        const gameId = games.length + 1
        const newGame: Game = createGame(gameId, req.app.get('socketio'), [user], questions, gameConfig.maxPlayers)
        games.push(newGame)
        listen(newGame)
        res.send({ url: `http://${SERVER_IP}:8080/chat/${gameId}` })
      })
      .catch(err => {
        console.error(err)
        res.sendStatus(500)
      })

    router.get('/index', (req: Request, res: Response) => {
      res.render('index')
    })
  })

  return router
}
