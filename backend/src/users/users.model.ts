import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    default: null,
  },
  socketId: {
    type: String,
    default: null,
  },
})

interface IUser extends mongoose.Document {
  name: string
  ipAddress: string | null
  socketId: string | null
}

const User = mongoose.model<IUser>('User', userSchema)

export { User, IUser, userSchema }
