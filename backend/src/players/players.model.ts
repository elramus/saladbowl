import mongoose from 'mongoose'
import { userSchema, IUser } from '../users/users.model'

export const playerSchema = new mongoose.Schema({
  user: {
    type: userSchema,
    required: true,
  },
  readyToPlay: {
    type: Boolean,
    default: false,
  },
})

export interface IPlayer extends mongoose.Document {
  user: IUser
  readyToPlay: boolean
}

export const Player = mongoose.model<IPlayer>('Player', playerSchema)
