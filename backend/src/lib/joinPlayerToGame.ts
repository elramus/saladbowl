import { IGame } from '../games/games.model'
import { User } from '../users/users.model'
import { SocketMessages } from '../socket'
import { io } from '../app'

export const joinPlayerToGame = async (
  userId: string,
  game: IGame,
): Promise<IGame> => {
  // Verify these exist.
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  // Make sure they're not already attached.
  if (!game.players.some((p) => p.user._id.toString() === userId)) {
    try {
      game.players.push({ user })
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
