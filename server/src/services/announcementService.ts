import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/appError.js'

export type CreateAnnouncementInput = {
  id: number
  title: string
  description: string
  categoryId: number
  publicationDate: Date
}

export type UpdateAnnouncementInput = {
  title: string
  description: string
  categoryId: number
  publicationDate: Date
}

export class AnnouncementService {
  static async create(data: CreateAnnouncementInput) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } })

    if (!category) {
      throw new AppError('Category does not exist', 400)
    }

    return prisma.announcement.create({
      data: {
        ...data,
        lastUpdate: new Date(),
      },
      include: {
        category: true,
      },
    })
  }

  static async findAll() {
    return prisma.announcement.findMany({
      include: { category: true },
      orderBy: { id: 'asc' },
    })
  }

  static async findById(id: number) {
    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: { category: true },
    })

    if (!announcement) {
      throw new AppError('Announcement not found', 404)
    }

    return announcement
  }

  static async findByCategory(categoryId: number) {
    return prisma.announcement.findMany({
      where: { categoryId },
      include: { category: true },
      orderBy: { id: 'asc' },
    })
  }

  static async search(query: string) {
    return prisma.announcement.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: { category: true },
      orderBy: { id: 'asc' },
    })
  }

  static async update(id: number, data: UpdateAnnouncementInput) {
    await this.findById(id)

    const category = await prisma.category.findUnique({ where: { id: data.categoryId } })
    if (!category) {
      throw new AppError('Category does not exist', 400)
    }

    return prisma.announcement.update({
      where: { id },
      data: {
        ...data,
        lastUpdate: new Date(),
      },
      include: {
        category: true,
      },
    })
  }

  static async remove(id: number): Promise<void> {
    await this.findById(id)
    await prisma.announcement.delete({ where: { id } })
  }
}
