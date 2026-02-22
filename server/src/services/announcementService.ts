import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/appError.js'

export type CreateAnnouncementInput = {
  id: number
  title: string
  description: string
  categoryIds: number[]
  publicationDate: Date
}

export type UpdateAnnouncementInput = {
  title: string
  description: string
  categoryIds: number[]
  publicationDate: Date
}

export class AnnouncementService {
  static async create(data: CreateAnnouncementInput) {
    const categories = await prisma.category.findMany({ where: { id: { in: data.categoryIds } } })

    if (categories.length !== data.categoryIds.length) {
      throw new AppError('Category does not exist', 400)
    }

    return prisma.announcement.create({
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        publicationDate: data.publicationDate,
        categories: {
          connect: data.categoryIds.map((categoryId) => ({ id: categoryId })),
        },
        lastUpdate: new Date(),
      },
      include: {
        categories: true,
      },
    })
  }

  static async findAll() {
    return prisma.announcement.findMany({
      include: { categories: true },
      orderBy: { id: 'asc' },
    })
  }

  static async findById(id: number) {
    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: { categories: true },
    })

    if (!announcement) {
      throw new AppError('Announcement not found', 404)
    }

    return announcement
  }

  static async findByCategory(categoryId: number) {
    return prisma.announcement.findMany({
      where: { categories: { some: { id: categoryId } } },
      include: { categories: true },
      orderBy: { id: 'asc' },
    })
  }

  static async search(query: string) {
    return prisma.announcement.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { categories: { some: { name: { contains: query } } } },
        ],
      },
      include: { categories: true },
      orderBy: { id: 'asc' },
    })
  }

  static async update(id: number, data: UpdateAnnouncementInput) {
    await this.findById(id)

    const categories = await prisma.category.findMany({ where: { id: { in: data.categoryIds } } })
    if (categories.length !== data.categoryIds.length) {
      throw new AppError('Category does not exist', 400)
    }

    return prisma.announcement.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        publicationDate: data.publicationDate,
        categories: {
          set: data.categoryIds.map((categoryId) => ({ id: categoryId })),
        },
        lastUpdate: new Date(),
      },
      include: {
        categories: true,
      },
    })
  }

  static async remove(id: number): Promise<void> {
    await this.findById(id)
    await prisma.announcement.delete({ where: { id } })
  }
}
