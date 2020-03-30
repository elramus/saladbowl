import mongoose from 'mongoose'

/* Connect to the DB */
const dbConnect = () => {
  const url = process.env.DB_URL || ''
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    dbName: 'saladbowl',
    useFindAndModify: false,
  })
  mongoose.connection.on('open', () => {
      console.log('Connected to Mongo') /* eslint-disable-line */
  })
  mongoose.connection.on('error', (e) => {
      console.error(e) /* eslint-disable-line */
  })
}

export { dbConnect }
