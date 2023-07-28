import { NextFunction, Request, Response } from 'express'
import { CustomError } from '../errors/custom-error'
import { DatabaseError } from '../errors/database-error'

// Error object used in error handling middleware function
export class AppError extends Error {
  statusCode: number

  constructor(statusCode?: number, message?: string) {
    super(message)

    Object.setPrototypeOf(this, new.target.prototype)
    this.name = Error.name
    this.statusCode = statusCode || 500
    Error.captureStackTrace(this)
  }
}

// Middleware function for logging the request method and request URL
export const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(`[Req]: ${request.method} url:: ${request.url}`)
  next()
}
// Error handling Middleware function for logging the error message
export const errorLogger = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(`[ERROR]: ${error.message}`)
  next(error) // calling next middleware
}

// Error handling Middleware function reads the error message
// and sends back a response in JSON format
export const errorResponder = (
  error: AppError,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  response.header('Content-Type', 'application/json')
  const status = error.statusCode
  const message =
    error.message || `processing error in request at ${request.url}`
  response.status(status).send({ message })
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.formatErrors() })
  }
  if (err instanceof DatabaseError) {
    return res.status(err.statusCode).send({ errors: err.formatErrors() })
  }
  return res.status(400).send({ errors: [{ message: 'Something went wrong' }] })
}
