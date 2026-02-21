import { createServer } from 'http'
import { env } from './config/env.js'
import { prisma } from './config/prisma.js'
import { app } from './app.js'
import { logger } from './utils/logger.js'
import { setupWebSocket } from './websocket/wsServer.js'

const server = createServer(app)

setupWebSocket(server)

server.listen(env.PORT, () => {
  logger.info(`API server listening on port ${env.PORT}`)
})

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${env.PORT} is already in use. Stop the other process or change PORT in .env.`)
    process.exit(1)
  }

  logger.error(`Server error: ${error.message}`)
  process.exit(1)
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
