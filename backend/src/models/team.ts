import mongoose from 'mongoose'

export interface ITeam extends mongoose.Document {
  name: string;
  userIds: string[];
  score: number;
  lastPrompterIndex: number;
}

export const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  score: {
    type: Number,
    default: 0,
  },
  lastPrompterIndex: {
    type: Number,
    default: 0,
  },
})

export const Team = mongoose.model<ITeam>('Team', teamSchema)
