import mongoose from 'mongoose'

/* Connect to the DB */
const dbConnectTest = async () => {
  await mongoose.connect('mongodb://localhost', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
}

export { dbConnectTest }
