import mongoose from 'mongoose'

interface IUser extends mongoose.Document {
  name: string;
  socketId: string;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    default: null,
  },
})

const User = mongoose.model<IUser>('User', userSchema)

export { User, IUser, userSchema }
