import { Router, Request, Response } from 'express'
import { Game } from '../models/game.model'
import { User } from '../models/user.model'
import { createGame, listen } from '../services/game.service'
import { Question } from '../models/question.model'
import getQuestions from '../_api'

export const appRouter = () => {
  const router = Router()
  const games: Array<Game> = []
  const players: Array<User> = []

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
    const user: User = req.body.user
    const gameConfig = req.body.config

    if (!user || !gameConfig || !gameConfig.maxPlayers) {
      res.sendStatus(500)
    }
    getQuestions()
      .then((questions: Array<Question>) => {
        const newGame: Game = createGame(games.length + 1, req.app.get('socketio'), [user], questions, gameConfig.maxPlayers)
        games.push(newGame)
        listen(newGame)
        res.sendStatus(200)
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
