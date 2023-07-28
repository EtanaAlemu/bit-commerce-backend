import { ValidationError } from 'express-validator'
import { CustomError } from './custom-error'
export class ReqValidationError extends CustomError {
  statusCode = 400
  constructor(public errors: ValidationError[]) {
    super()
    Object.setPrototypeOf(this, ReqValidationError.prototype)
  }
  formatErrors() {
    return this.errors.map(err => {
      return {
        type: err.type,
        message: err.msg,
        name: this.name,
        statusCode: this.statusCode,
        stack: this.stack,
      }
    })
  }
}
