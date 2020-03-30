import { IGame } from '../models/game'
import { IUser } from '../models/user'
import { ITeam } from '../models/team'

export const getNextTurn = (
  game: IGame,
  user: IUser,
): [number, string, ITeam] => {
  const teamWent = game.teams.find((t) => (
    t.userIds.includes(user._id)))

  if (!teamWent) throw new Error('invalid team or player')

  // We need to get the other team.
  const teamWentIndex = game.teams.indexOf(teamWent)
  const teamUpNext = teamWentIndex + 1 > game.teams.length - 1
    ? game.teams[0]
    : game.teams[teamWentIndex + 1]

  if (!teamUpNext) throw new Error('Found bad team')

  // Now get the next player.
  const nextPlayerIndex = teamUpNext.lastPrompterIndex + 1 > teamUpNext.userIds.length - 1
    ? 0
    : teamUpNext.lastPrompterIndex + 1

  return [nextPlayerIndex, teamUpNext.userIds[nextPlayerIndex], teamUpNext]
}
