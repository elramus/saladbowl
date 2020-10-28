import { IGame } from '../games/games.model'
import { randomNum } from '../utils/randomNum'

export const chooseFirstPlayer = (game: IGame) => {
  // Get a random team.
  const randomTeamIndex = randomNum(0, game.teams.length - 1)
  const randomTeam = game.teams[randomTeamIndex]

  // Get a random player.
  const randomPlayerIndex = randomNum(0, randomTeam.userIds.length - 1)

  return {
    firstPlayerIndex: randomPlayerIndex,
    firstTeam: randomTeam,
  }
}
