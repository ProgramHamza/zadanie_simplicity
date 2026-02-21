import { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils/appError.js'
import { logger } from '../utils/logger.js'

function hasErrorCode(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error && typeof (error as { code: unknown }).code === 'string'
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message })
  }

  if (hasErrorCode(error)) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Unique constraint violation' })
    }

    if (error.code === 'P2003') {
      return res.status(409).json({ message: 'Operation violates existing relation constraints' })
    }
  }

  logger.error(error instanceof Error ? error.message : 'Unknown error')
  return res.status(500).json({ message: 'Internal server error' })
}
