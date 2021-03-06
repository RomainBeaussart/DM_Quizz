require('dotenv').config()

import { Prisma as PrismaBinding } from 'prisma-binding'
import { GraphQLServer } from 'graphql-yoga'
import { forward } from 'graphql-middleware-forward-binding'
import { formatError } from 'apollo-errors'
import serveStatic from 'serve-static'
import path from 'path'
import history from 'connect-history-api-fallback'
import bodyParser from 'body-parser'
import { mergeTypes } from 'merge-graphql-schemas'
import { readFileSync } from 'fs'
import { Prisma } from '../prisma/generated/prisma-client'
import { appRouter } from './routes/routes'
import user from './resolvers/user'

const cors = require('cors')

export const SOCKET_PORT = 7545
export const SERVER_IP = '127.0.0.1'

const forwardedRequests = [
    // ! Queries
  'Query.games', 'Query.game',
  'Query.players', 'Query.player', 'Query.playersConnection',
    // ! Mutations
  'Mutation.createPlayer'
]

const resolvers = {
  Query: {
    ...user.Query
  },
  Mutation: {
    ...user.Mutation
  },

  Subscription: {

  }
}

const bindingForwardMiddleware = forward(...forwardedRequests)('binding')

let prisma = new Prisma({
  endpoint: `${process.env.PRISMA_ENDPOINT}/${process.env.PRISMA_SERVICE}/${process.env.PRISMA_STAGE}`
})
let binding = new PrismaBinding({
  typeDefs: './prisma/generated/prisma.graphql',
  endpoint: `${process.env.PRISMA_ENDPOINT}/${process.env.PRISMA_SERVICE}/${process.env.PRISMA_STAGE}`
})

const server = new GraphQLServer({
  typeDefs: mergeTypes([readFileSync('./prisma/generated/prisma.graphql').toString(), readFileSync('./schema.graphql').toString()], { all: true }),
  resolvers,
  middlewares: [bindingForwardMiddleware],
  context: (c) => {
    return {
      connection: c.connection,
      request: c.request,
      binding: binding,
      prisma: prisma
    }
  }
})

// Express server config

server.express.use(cors())

server.express.use(bodyParser.json({ limit: '50mb' }))
server.express.use(bodyParser.urlencoded({
  limit: '10mb',
  extended: true
}))

server.express.use(function (req, res, next) {
  req.prisma = prisma
  next()
})

server.express.get('/status', (req, res) => {
  res.sendStatus(200)
})

// server.express.use('/reconcileReceipt', reconcileReceiptRouter);

const http = require('http').Server(server.express)
http.listen(SOCKET_PORT, SERVER_IP)
const io = require('socket.io')(http)
server.express.set('socketio', io)

server.express.use('/', appRouter())

server.express.use(history())
server.express.use(serveStatic(path.join(__dirname, '../../frontend/dist')))

console.log(`Prisma endpoint: ${process.env.PRISMA_ENDPOINT}/${process.env.PRISMA_SERVICE}/${process.env.PRISMA_STAGE}`)

server.start({
  port: process.env.PORT || 4000,
  endpoint: '/prisma.graphql',
  playground: '/playground.graphql',
  subscriptions: '/graphql',
  formatError
})
.then(() => console.log(`Server is running on http://localhost:${process.env.PORT || 4000}`))
.catch(() => console.error('The server is not running. Error occurs during the initialization.'))
