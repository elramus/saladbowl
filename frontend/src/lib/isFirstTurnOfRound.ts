import { Game } from '../store/game/types'

/**
 * Checks if this is the first turn of a round.
 */
export const isFirstTurnOfRound = (game: Game | undefined | null) => {
  if (!game) return false
  // We're check what the current round is, and then
  // see if the round behind it also has the same round.
  const currentRound = game.turns[0].round
  return game.turns[1] === undefined || game.turns[1].round !== currentRound
}
