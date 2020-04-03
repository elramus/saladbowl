import { IGame } from '../games/games.model'
import { randomNum } from '../utils/randomNum'

export const chooseFirstPlayer = (game: IGame) => {
  // Get a random team.
  const randomTeamIndex = randomNum(0, game.teams.length - 1)
  const firstTeam = game.teams[randomTeamIndex]
  // Get a random player.
  const randomPlayerIndex = randomNum(0, firstTeam.userIds.length - 1)
  const firstUserId = firstTeam.userIds[randomPlayerIndex]

  return {
    firstUserId,
    playerIndex: randomPlayerIndex,
    firstTeam,
  }
}
