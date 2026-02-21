import { Request, Response, NextFunction } from 'express'
import { env } from '../config/env.js'

export function requireAdminSecret(req: Request, res: Response, next: NextFunction) {
  const secret = req.header('x-admin-secret')

  if (!secret || secret !== env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Forbidden: invalid x-admin-secret' })
  }

  return next()
}
