import { IGame } from '../games/games.model'

export const gameReadyChecklist = (game: IGame) => {
  let ready = true

  // One or more player on every team?
  if (game.teams.some((t) => t.userIds.length === 0)) {
    ready = false
  }

  // All players ready?
  if (game.players.some((p) => !p.ready)) {
    ready = false
  }

  return ready
}
