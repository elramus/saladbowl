import { IGame } from '../games/games.model'

export const gameReadyChecklist = (game: IGame) => {
  let ready = true

  // Don't start if it's already been started!
  if (game.startTime) {
    return false
  }

  // All players ready?
  if (game.players.some((p) => !p.pregameFinished)) {
    ready = false
  }

  // If teams have been made, is there at least one person on each team?
  if (game.teams.length && game.teams.some((t) => t.userIds.length === 0)) {
    ready = false
  }

  return ready
}
