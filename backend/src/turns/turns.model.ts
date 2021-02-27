import mongoose from 'mongoose'

export const turnSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
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
  showCountdown: {
    type: Boolean,
    default: false,
  },
  startTime: {
    type: Number,
    default: null,
  },
  votesToSkip: {
    type: [String],
    default: [],
  },
  playedPhrases: [
    new mongoose.Schema(
      {
        phraseId: {
          type: String,
          required: true,
        },
        solved: {
          type: Boolean,
          required: true,
        },
        timestamp: {
          type: Number,
          default: true,
        },
        duration: {
          type: Number,
          required: true,
        },
      },
      { _id: false },
    ),
  ],
})

export interface PlayedPhrase {
  phraseId: string
  solved: boolean
  timestamp: number
  duration: number
}

export interface ITurn extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  teamId: mongoose.Types.ObjectId
  round: 0 | 1 | 2 | 3
  turnLength: number
  showCountdown: boolean
  startTime: number | null
  votesToSkip: string[]
  playedPhrases: PlayedPhrase[]
}

export const Turn = mongoose.model<ITurn>('Turn', turnSchema)
