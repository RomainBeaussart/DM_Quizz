import { Router, Request, Response } from 'express'

export const appRouter = () => {
  const router = Router()
  let socketIsSet = false

  function setSocket (io) {
    io.sockets.on('connection', function (socket) {

      socket.on('username', function (username) {
        console.log(`${username} is connecting to the chat`)
        socket.username = username
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>')
      })

      socket.on('disconnect', function (username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>')
      })

      socket.on('chat_message', function (message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message)
      })

      socketIsSet = true
    })
  }

  router.get('/', (req: Request, res: Response) => {
    res.send('Router works !')
  })

  router.get('/chat', (req: Request, res: Response) => {
    if (!socketIsSet) {
      const io = req.app.get('socketio')
      setSocket(io)
    }
    // render chat front end
    res.render('index')
  })
  return router
}
