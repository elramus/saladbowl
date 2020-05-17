import { IGame } from '../games/games.model'

const joinTeam = async (
  game: IGame,
  teamId: string,
  userId: string,
): Promise<IGame> => {
  // Check if the user is already on any team. If they are, just ignore this.
  if (game.teams.find(t => t.userIds.includes(userId))) {
    return game
  }

  // Get the team they're joining.
  const teamToJoin = game.teams.find(team => team._id.toString() === teamId)
  if (!teamToJoin) throw new Error('No team found with given teamId')

  // Remove the team we're going to modify from the teams array.
  game.teams.pull(teamId)
  // Add the player to it.
  teamToJoin.userIds.push(userId)
  // Add the team back on.
  game.teams.push(teamToJoin)

  // Save and return.
  await game.save()
  return game
}

export default joinTeam
