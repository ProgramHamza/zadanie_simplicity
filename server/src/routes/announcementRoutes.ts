import { Router } from 'express'
import { body, param, query } from 'express-validator'
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  getAnnouncements,
  getAnnouncementsByCategory,
  searchAnnouncements,
  updateAnnouncement,
} from '../controllers/announcementController.js'
import { requireAdminSecret } from '../middlewares/requireAdminSecret.js'
import { validateRequest } from '../middlewares/validateRequest.js'

const dateValidator = (value: string) => !Number.isNaN(Date.parse(value))

export const announcementRouter = Router()

announcementRouter.get('/', getAnnouncements)

announcementRouter.get('/search',
  [query('q').optional().isString()],
  validateRequest,
  searchAnnouncements,
)

announcementRouter.get('/category/:categoryId',
  [param('categoryId').isInt({ min: 1 })],
  validateRequest,
  getAnnouncementsByCategory,
)

announcementRouter.get('/:id',
  [param('id').isInt({ min: 1 })],
  validateRequest,
  getAnnouncementById,
)

announcementRouter.post('/',
  requireAdminSecret,
  [
    body('id').isInt({ min: 1 }),
    body('title').isString().trim().notEmpty(),
    body('description').isString().trim().notEmpty(),
    body().custom((_, { req }) => {
      const hasCategoryIds = Array.isArray(req.body.categoryIds) && req.body.categoryIds.length > 0
      const hasCategoryId = Number.isInteger(Number(req.body.categoryId)) && Number(req.body.categoryId) > 0
      return hasCategoryIds || hasCategoryId
    }),
    body('categoryIds').optional().isArray({ min: 1 }),
    body('categoryIds.*').optional().isInt({ min: 1 }),
    body('categoryId').optional().isInt({ min: 1 }),
    body('publicationDate').custom(dateValidator),
  ],
  validateRequest,
  createAnnouncement,
)

announcementRouter.put('/:id',
  requireAdminSecret,
  [
    param('id').isInt({ min: 1 }),
    body('title').isString().trim().notEmpty(),
    body('description').isString().trim().notEmpty(),
    body().custom((_, { req }) => {
      const hasCategoryIds = Array.isArray(req.body.categoryIds) && req.body.categoryIds.length > 0
      const hasCategoryId = Number.isInteger(Number(req.body.categoryId)) && Number(req.body.categoryId) > 0
      return hasCategoryIds || hasCategoryId
    }),
    body('categoryIds').optional().isArray({ min: 1 }),
    body('categoryIds.*').optional().isInt({ min: 1 }),
    body('categoryId').optional().isInt({ min: 1 }),
    body('publicationDate').custom(dateValidator),
  ],
  validateRequest,
  updateAnnouncement,
)

announcementRouter.delete('/:id',
  requireAdminSecret,
  [param('id').isInt({ min: 1 })],
  validateRequest,
  deleteAnnouncement,
)
