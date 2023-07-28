import { Request, Response, NextFunction } from 'express'
// models
import User from '../models/User'
import { UserDocument } from '../types/user.type'
import { DatabaseError } from '../errors/database-error'
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
  const { email, password, firstName, lastName }: UserDocument = req.body
  try {
    const user = new User({
      email,
      password,
      firstName,
      lastName,
    })

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new AppError(400, 'Account with that email address already exists.')
    }
    await user.save().catch(err => {
      throw new DatabaseError(err)
    })

    res.status(201).json(user)
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
