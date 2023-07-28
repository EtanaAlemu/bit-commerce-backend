import { Request, Response, NextFunction } from 'express'
// models
import User from '../models/User'
import { UserDocument } from '../types/user.type'
import { DatabaseError } from '../errors/database-error'
import { AppError } from '../middleware/error.middleware'
import jwt from 'jsonwebtoken'

/**
 * Handling user registration
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export const register = async (
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
 * Handling user login
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export const login = async (
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
    const key: string = process.env.JWT_SECRET_KEY!
    user.comparePasswords(password, (err, isMatch) => {
      if (err) throw new AppError(400, err.message)
      if (isMatch) {
        const token = jwt.sign({ id: user._id?.toString() }, key, {
          expiresIn: '2 days',
        })

        return res.status(200).json({ user, token })
      }
      res.status(400).json({ message: 'password not match' })
    })
  } catch (err) {
    return next(err)
  }
}
