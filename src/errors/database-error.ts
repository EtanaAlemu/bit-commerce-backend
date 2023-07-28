import { MongooseError } from 'mongoose'
import { CustomError } from './custom-error'
export class DatabaseError extends CustomError {
  statusCode = 500
  constructor(public errors: MongooseError) {
    super()
    Object.setPrototypeOf(this, DatabaseError.prototype)
  }

  formatErrors() {
    return [
      {
        message: this.errors.message,
        name: this.errors.name,
        statusCode: this.statusCode,
        stack: this.errors.stack,
      },
    ]
  }
}
