import { Router, Request, Response } from 'express'

export const appRouter = () => {
  const router = Router()

  /**
   * create a chat / a game instance
   */
  router.post('/chat', (req: Request, res: Response) => {

  })

  return router
}
