import { Router } from 'express'
import { categoryRouter } from './categoryRoutes.js'
import { announcementRouter } from './announcementRoutes.js'

export const apiRouter = Router()

apiRouter.use('/categories', categoryRouter)
apiRouter.use('/announcements', announcementRouter)
