import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { apiRouter } from './routes/index.js'

export const app = express()

const allowedOrigins = env.CLIENT_URL
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true)
      return
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error(`Origin not allowed by CORS: ${origin}`))
  },
}))
app.use(express.json({ limit: '10kb' }))
app.use(morgan('combined'))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', apiRouter)

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use(errorHandler)
