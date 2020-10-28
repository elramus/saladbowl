import { IGame, Game } from '../games/games.model'
import { Phrase } from '../phrases/phrases.model'
import { SocketMessages } from '../socket'
import { io } from '../server'

export const createGamePhrase = async (
  userId: string,
  gameId: string,
  phrase: string,
): Promise<IGame | null> => {
  const game = await Game.findById(gameId)
  if (game) {
    if (phrase) {
      const newPhrase = new Phrase({
        text: phrase,
        authorId: userId,
      })
      await newPhrase.save()

      game.phrases.push(newPhrase)
      await game.save()

      // Broadcast the updated game.
      io.to(gameId).emit(SocketMessages.GameUpdate, game)
      return game
    }
  }
  return null
}
