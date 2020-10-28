import { Game } from '../games/games.model'


// Removes a phrase from a game.

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

    // TODO: Should this also look through unplayed phrases? played phrases?
  } catch (e) {
    throw new Error(e)
  }
}

export default deletePhrase
