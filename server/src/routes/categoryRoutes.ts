import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/categoryController.js'
import { validateRequest } from '../middlewares/validateRequest.js'

export const categoryRouter = Router()

categoryRouter.get('/', getCategories)
categoryRouter.get('/:id',
  [param('id').isInt({ min: 1 })],
  validateRequest,
  getCategoryById,
)

categoryRouter.post('/',
  [
    body('id').isInt({ min: 1 }),
    body('name').isString().trim().notEmpty(),
  ],
  validateRequest,
  createCategory,
)

categoryRouter.put('/:id',
  [
    param('id').isInt({ min: 1 }),
    body('name').isString().trim().notEmpty(),
  ],
  validateRequest,
  updateCategory,
)

categoryRouter.delete('/:id',
  [param('id').isInt({ min: 1 })],
  validateRequest,
  deleteCategory,
)
