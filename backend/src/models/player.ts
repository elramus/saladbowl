import mongoose from 'mongoose'
import { userSchema, IUser } from './user'

export interface IPlayer extends mongoose.Document {
  user: IUser;
  ready: boolean;
}

export const playerSchema = new mongoose.Schema({
  user: {
    type: userSchema,
    required: true,
  },
  ready: {
    type: Boolean,
    default: false,
  },
})

export const Player = mongoose.model<IPlayer>('Player', playerSchema)
