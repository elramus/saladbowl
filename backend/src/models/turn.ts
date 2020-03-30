import mongoose, { Types } from 'mongoose'

export const turnSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  round: {
    type: Number,
    required: true,
  },
  turnLength: {
    type: Number,
    default: 60,
  },
  startTime: {
    type: Number,
    default: null,
  },
  solvedPhraseIds: [String],
})

export interface ITurn extends mongoose.Document {
  userId: string;
  round: number;
  turnLength: number;
  startTime: number | null;
  solvedPhraseIds: string[];
}

export const Turn = mongoose.model<ITurn>('Turn', turnSchema)
