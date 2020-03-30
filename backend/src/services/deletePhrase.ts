import { Game } from '../models/game'

const deletePhrase = async (
  gameId: string,
  phraseId: string,
) => {
  try {
    const game = await Game.findById(gameId)
    if (!game) throw new Error('Invalid game ID')
    game.phrases.pull(phraseId)
    await game.save()
    return game
  } catch (e) {
    throw new Error(e)
  }
}

export default deletePhrase
