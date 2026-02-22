import { Request, Response } from 'express'
import { AnnouncementService } from '../services/announcementService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { broadcastAnnouncementCreated } from '../websocket/wsServer.js'

export const createAnnouncement = asyncHandler(async (req: Request, res: Response) => {
  const categoryIds = Array.isArray(req.body.categoryIds)
    ? req.body.categoryIds.map((value: unknown) => Number(value))
    : [Number(req.body.categoryId)]

  const announcement = await AnnouncementService.create({
    id: Number(req.body.id),
    title: String(req.body.title),
    description: String(req.body.description),
    categoryIds,
    publicationDate: new Date(String(req.body.publicationDate)),
  })

  broadcastAnnouncementCreated(announcement)
  res.status(201).json(announcement)
})

export const getAnnouncements = asyncHandler(async (_req: Request, res: Response) => {
  const announcements = await AnnouncementService.findAll()
  res.json(announcements)
})

export const getAnnouncementById = asyncHandler(async (req: Request, res: Response) => {
  const announcement = await AnnouncementService.findById(Number(req.params.id))
  res.json(announcement)
})

export const getAnnouncementsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const announcements = await AnnouncementService.findByCategory(Number(req.params.categoryId))
  res.json(announcements)
})

export const searchAnnouncements = asyncHandler(async (req: Request, res: Response) => {
  const query = String(req.query.q ?? '')
  const announcements = await AnnouncementService.search(query)
  res.json(announcements)
})

export const updateAnnouncement = asyncHandler(async (req: Request, res: Response) => {
  const categoryIds = Array.isArray(req.body.categoryIds)
    ? req.body.categoryIds.map((value: unknown) => Number(value))
    : [Number(req.body.categoryId)]

  const announcement = await AnnouncementService.update(Number(req.params.id), {
    title: String(req.body.title),
    description: String(req.body.description),
    categoryIds,
    publicationDate: new Date(String(req.body.publicationDate)),
  })

  res.json(announcement)
})

export const deleteAnnouncement = asyncHandler(async (req: Request, res: Response) => {
  await AnnouncementService.remove(Number(req.params.id))
  res.status(204).send()
})
