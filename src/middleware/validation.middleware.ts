import { NextFunction, Request, Response } from 'express'
import { body, check, validationResult } from 'express-validator'
import { ReqValidationError } from '../errors/req-validation-error'

export const registerValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await check('email', 'Email is not valid').isEmail().run(req)
    await check('password', 'Password must be at least 4 characters long')
      .isLength({ min: 4 })
      .run(req)
    await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req)

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      throw new ReqValidationError(validationErrors.array())
    }

    next()
  } catch (error) {
    next(error)
  }
}
export const loginValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await check('email', 'Email is not valid').isEmail().run(req)
    await check('password', 'Password must be at least 4 characters long')
      .isLength({ min: 4 })
      .run(req)
    await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req)

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      throw new ReqValidationError(validationErrors.array())
    }

    next()
  } catch (error) {
    next(error)
  }
}
