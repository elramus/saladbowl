import mongoose, { Types } from 'mongoose'
import { IPhrase, phraseSchema } from '../phrases/phrases.model'
import { teamSchema, ITeam } from '../teams/teams.model'
import { playerSchema, IPlayer } from '../players/players.model'
import { turnSchema, ITurn } from '../turns/turns.model'

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
  gameOver: {
    type: Boolean,
    default: false,
  },
  unsolvedPhraseIds: [String],
})

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
  gameOver: boolean;
  unsolvedPhraseIds: string[];
}

export const Game = mongoose.model<IGame>('Game', gameSchema)
