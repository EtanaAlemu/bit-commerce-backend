import mongoose, { ConnectOptions } from 'mongoose'

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/TS-Backend'

const connectDB = async () => {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  // .then(() => {
  //   /** ready to use. The `mongoose.connect()` promise resolves to undefined. */

  // })
  // .catch(err => {
  //   console.log(
  //     `❌[MongoDB]: MongoDB connection error. Please make sure MongoDB is running. ${err}`,
  //   )
  //   // process.exit();
  // })
}

export default connectDB
