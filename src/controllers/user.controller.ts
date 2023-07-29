import { Request, Response, NextFunction } from 'express'
// models
import User from '../models/User'
import { UserDocument } from '../types/user.type'
import { AppError } from '../middleware/error.middleware'

/**
 * Handling users fetch
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const page =
    req.query.page && typeof req.query.page == 'string'
      ? parseInt(req.query.page)
      : 1
  const limit =
    req.query.limit && typeof req.query.limit == 'string'
      ? parseInt(req.query.limit)
      : 10

  // calculating the starting and ending index
  const skip = (page - 1) * limit
  try {
    const users = await User.find().skip(skip).limit(limit)
    const total = await User.count()

    res.status(200).json({ users, total })
  } catch (err) {
    return next(err)
  }
}

/**
 * Handling single user fetch
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password }: UserDocument = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      throw new AppError(400, 'Account with that email address not exists.')
    }
    user.comparePasswords(password, (err, isMatch) => {
      if (err) throw new AppError(400, err.message)
      if (isMatch) res.status(200).json({ message: 'success' })
      res.status(400).json({ message: 'password not match' })
    })
  } catch (err) {
    return next(err)
  }
}
