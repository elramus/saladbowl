import { IGame, Game } from '../models/game'
import { SocketMessages } from '../socket'
import { io } from '../app'

export const createGamePhrase = async (
  userId: string,
  gameId: string,
  phrase: string,
): Promise<IGame | null> => {
  // If phrase is null, delete it instead.
  const game = await Game.findById(gameId)
  if (game) {
    if (phrase) {
      const newPhrase = {
        text: phrase,
        authorId: userId,
      }

      game.phrases.push(newPhrase)
      game.save()
      // Broadcast the updated game.
      io.to(gameId).emit(SocketMessages.GameUpdate, game)
      return game
    }
  }
  return null
}
