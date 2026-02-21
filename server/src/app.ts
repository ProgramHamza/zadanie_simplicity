import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { apiRouter } from './routes/index.js'

export const app = express()

app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL }))
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
