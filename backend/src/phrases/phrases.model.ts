import mongoose from 'mongoose'

export const phraseSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

export interface IPhrase extends mongoose.Document {
  text: string
  authorId: string
}

export const Phrase = mongoose.model<IPhrase>('Phrase', phraseSchema)
