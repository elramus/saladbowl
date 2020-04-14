import mongoose from 'mongoose'
import { userSchema, IUser } from '../users/users.model'

export const playerSchema = new mongoose.Schema({
  user: {
    type: userSchema,
    required: true,
  },
  pregameFinished: {
    type: Boolean,
    default: false,
  },
}, { _id: false })

export interface IPlayer extends mongoose.Document {
  user: IUser;
  pregameFinished: boolean;
}

export const Player = mongoose.model<IPlayer>('Player', playerSchema)
