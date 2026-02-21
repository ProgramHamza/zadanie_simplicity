import { createServer } from 'http'
import { prisma } from './config/prisma.js'
import { env } from './config/env.js'
import { app } from './app.js'
import { logger } from './utils/logger.js'
import { setupWebSocket } from './websocket/wsServer.js'

const server = createServer(app)

setupWebSocket(server)

server.listen(env.PORT, () => {
  logger.info(`API server listening on port ${env.PORT}`)
})

const gracefulShutdown = async () => {
  logger.info('Shutting down...')
  await prisma.$disconnect()
  server.close(() => {
    process.exit(0)
  })
}

process.on('SIGINT', () => {
  void gracefulShutdown()
})

process.on('SIGTERM', () => {
  void gracefulShutdown()
})
