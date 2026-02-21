import { Request, Response } from 'express'
import { CategoryService } from '../services/categoryService.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryService.create({
    id: Number(req.body.id),
    name: String(req.body.name),
  })

  res.status(201).json(category)
})

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await CategoryService.findAll()
  res.json(categories)
})

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryService.findById(Number(req.params.id))
  res.json(category)
})

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryService.update(Number(req.params.id), {
    name: String(req.body.name),
  })

  res.json(category)
})

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await CategoryService.remove(Number(req.params.id))
  res.status(204).send()
})
