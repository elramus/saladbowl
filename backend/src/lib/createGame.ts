import { randomNum } from '../utils/randomNum'
import { Game } from '../games/games.model'

export const createGame = async (
  userId: string,
) => {
  // TODO: make sure this new ID is unique.
  const shortId = randomNum(1000, 9999)

  const newGame = new Game({
    shortId,
    creator: userId,
  })

  return newGame
}
