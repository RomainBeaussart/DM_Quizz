import { Router, Request, Response } from 'express'
import { DmQuizz } from '../model/dmquizz.class'

export const appRouter = () => {
  const router = Router()

  let quizz

  router.get('/', (req: Request, res: Response) => {
    res.send('Router works !')
  })

  router.post('/chat', (req: Request, res: Response) => {
    const identifier: string = req.body.identifier
    res.status(200)
    if (!quizz) {
      quizz = new DmQuizz(identifier, req.app.get('socketio'))
      res.send(`chat ${identifier} has been created.`)
    }
    res.send(`A chat named ${quizz.identifier} already exists.`)
  })

  router.get('/chat', (req: Request, res: Response) => {
    if (!quizz) {
      quizz = new DmQuizz('myquizz', req.app.get('socketio'))
    }
    res.render('index')
  })

  return router
}
