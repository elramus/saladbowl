import mongoose from 'mongoose'
import { Game } from '../games/games.model'

export const findGame = async (gameId: string) => {
  let game = null

  // The ID can be either a short ID or a full game ID.
  if (mongoose.Types.ObjectId.isValid(gameId)) {
    game = await Game.findById(gameId)
  } else {
    game = await Game.findOne({ shortId: parseInt(gameId) })
  }

  return game
}
