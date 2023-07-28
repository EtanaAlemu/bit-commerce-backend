import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv'
import {
  // invalidPathHandler,
  errorResponder,
  errorLogger,
  requestLogger,
  errorHandler,
} from './middleware/error.middleware'
import routes from './routes'
dotenv.config()

import connectDB from './config/db.config'
import { NotFoundError } from './errors/not-found-error'

const app = express()
const port = process.env.PORT

/** Call middleware */
// compresses all the responses
app.use(compression())
// adding set of security middleware
app.use(helmet())
// parse incoming request body and append data to `req.body`
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// enable all CORS request
app.use(cors())

app.use(requestLogger)
//Set all routes from routes folder
app.use('/api', routes)

/**Error handling Middleware functions*/

// Attach the first Error handling Middleware
// function which logs the error
app.use(errorLogger)

// Attach the second Error handling Middleware
// function which sends back the response
app.use(errorResponder)

// Attach the fallback Middleware
// function which sends back the response for invalid paths)
// app.use(invalidPathHandler)

app.all('/*', () => {
  throw new NotFoundError()
})
app.use(errorHandler)

app.listen(port, async () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${port} in %s mode`,
    app.get('env'),
  )
  connectDB().catch(err => console.log('⛔️[MongoDB]: ', err.message))

  console.info('Database connected ✨')
})
