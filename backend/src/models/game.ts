import mongoose, { Types } from 'mongoose'
import { IUser } from './user'
import { IPhrase, phraseSchema } from './phrase'
import { teamSchema, ITeam } from './team'
import { playerSchema, IPlayer } from './player'
import { turnSchema, ITurn } from './turn'

export interface IGame extends mongoose.Document {
  shortId: number;
  creatorId: string;
  players: Types.Array<IPlayer>;
  teams: Types.Array<ITeam>;
  phrases: Types.Array<IPhrase>;
  preRoll: {
    show: boolean;
    firstUserId?: string;
  }
  turns: Types.Array<ITurn>;
  unsolvedPhraseIds: string[];
}

export const gameSchema = new mongoose.Schema({
  shortId: {
    type: Number,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  players: [playerSchema],
  teams: [teamSchema],
  phrases: [phraseSchema],
  preRoll: {
    show: {
      type: Boolean,
      default: false,
    },
    firstUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  turns: [turnSchema],
  unsolvedPhraseIds: [String],
})

export const Game = mongoose.model<IGame>('Game', gameSchema)
