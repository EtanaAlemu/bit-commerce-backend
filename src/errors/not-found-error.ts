import { CustomError } from './custom-error'
export class NotFoundError extends CustomError {
  statusCode = 404
  message = 'This route does not exist'
  constructor(message?: string) {
    super()
    if (message) this.message = message
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
  formatErrors() {
    return [{ message: this.message }]
  }
}
