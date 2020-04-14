import { randomNum } from '../utils/randomNum'
import { Game } from '../games/games.model'

export const createGame = async (
  userId: string,
  teams?: {
    name: string;
  }[],
) => {
  let shortId: number | null = null

  async function getShortId() {
    const random = randomNum(1000, 9999)
    const existingGame = await Game.findOne({ shortId: random })
    if (!existingGame) {
      shortId = random
    } else {
      await getShortId()
    }
  }
  await getShortId()

  const newGame = new Game({
    shortId,
    creator: userId,
    teams: teams || [],
  })

  try {
    await newGame.save()
  } catch (e) {
    throw new Error(e.message)
  }

  return newGame
}
