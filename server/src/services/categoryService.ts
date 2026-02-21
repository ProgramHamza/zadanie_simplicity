import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/appError.js'

type CategoryEntity = {
  id: number
  name: string
}

export type CreateCategoryInput = {
  id: number
  name: string
}

export type UpdateCategoryInput = {
  name: string
}

export class CategoryService {
  static async create(data: CreateCategoryInput): Promise<CategoryEntity> {
    return prisma.category.create({ data })
  }

  static async findAll(): Promise<CategoryEntity[]> {
    return prisma.category.findMany({ orderBy: { id: 'asc' } })
  }

  static async findById(id: number): Promise<CategoryEntity> {
    const category = await prisma.category.findUnique({ where: { id } })

    if (!category) {
      throw new AppError('Category not found', 404)
    }

    return category
  }

  static async update(id: number, data: UpdateCategoryInput): Promise<CategoryEntity> {
    await this.findById(id)
    return prisma.category.update({
      where: { id },
      data,
    })
  }

  static async remove(id: number): Promise<void> {
    await this.findById(id)
    await prisma.category.delete({ where: { id } })
  }
}
