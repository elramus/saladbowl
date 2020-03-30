import { IGame, Game } from '../models/game'
import { User } from '../models/user'
import { SocketMessages } from '../socket'
import { io } from '../app'

// TODO: This should probably take just the game ID, not the full game.

export const joinPlayerToGame = async (
  userId: string,
  shortGameId: number,
): Promise<IGame> => {
  // Verify these exist.
  const user = await User.findById(userId)
  const game = await Game.findOne({ shortId: shortGameId })
  if (!user || !game) throw new Error('User or Game not found')

  // Make sure they're not already attached.
  if (!game.players.some((p) => p.user._id.toString() === userId)) {
    try {
      game.players.push({
        user,
      })
      await game.save()

      // Broadcast the update
      io.to(game.id).emit(SocketMessages.GameUpdate, game)

      return game
    } catch (error) {
      throw new Error(error)
    }
  }
  return game
}
