import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
import { UserDocument } from '../types/user.type'

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'user'],
      required: true,
      default: 'user',
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
        delete ret.__v
      },
    },
    timestamps: true,
  },
)

// * Hash the password before it is being saved to the database
UserSchema.pre(
  'save',
  function (this: UserDocument, next: (err?: Error | undefined) => void) {
    // * Make sure you don't hash the hash
    if (this.isModified('password')) {
      const salt = bcrypt.genSaltSync(10)
      bcrypt.hash(this.password, salt, null, (err: Error, hash: string) => {
        if (err) return next(err)
        this.password = hash
      })
    }

    return next()
  },
)

UserSchema.methods.comparePasswords = function (
  candidatePassword: string,
  next: (err: Error | null, isMatch: boolean | null) => void,
) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return next(err, null)
    }
    next(null, isMatch)
  })
}

const User = mongoose.model<UserDocument>('User', UserSchema)
export default User
