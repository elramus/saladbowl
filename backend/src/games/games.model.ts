import mongoose, { Types } from 'mongoose'
import { IPhrase, phraseSchema } from '../phrases/phrases.model'
import { teamSchema, ITeam } from '../teams/teams.model'
import { playerSchema, IPlayer } from '../players/players.model'
import { turnSchema, ITurn } from '../turns/turns.model'

export const gameSchema = new mongoose.Schema({
  shortId: {
    type: Number,
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startTime: {
    type: Number,
    default: null,
  },
  players: [playerSchema],
  teams: [teamSchema],
  phrases: [phraseSchema],
  preRoll: {
    show: {
      type: Boolean,
      default: false,
    },
    firstTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
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
  creatorId: Types.ObjectId;
  startTime: number | null;
  players: Types.Array<IPlayer>;
  teams: Types.Array<ITeam>;
  phrases: Types.Array<IPhrase>;
  preRoll: {
    show: boolean;
    firstTeamId: Types.ObjectId;
  };
  turns: Types.Array<ITurn>;
  gameOver: boolean;
  unsolvedPhraseIds: string[];
}

export const Game = mongoose.model<IGame>('Game', gameSchema)
