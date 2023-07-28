import mongoose from 'mongoose'

export type UserDocument = mongoose.Document & {
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'admin' | 'user'
  comparePasswords(
    candidatePassword: string,
    next: (err: Error | null, isMatch: boolean | null) => void,
  ): void
}
