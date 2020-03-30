import { IGame } from '../models/game'

const joinTeam = async (
  game: IGame,
  teamId: string,
  userId: string,
): Promise<IGame> => {
  // First scrub the player from any teams they're already on.
  for (let i = 0; i < game.teams.length; i += 1) {
    const sansUser = game.teams[i].userIds.filter((p) => p.toString() !== userId)
    game.teams[i].set('userIds', sansUser)
  }

  // Get the team they're joining.
  const teamToJoin = game.teams.find((team) => team._id.toString() === teamId)

  if (!teamToJoin) {
    throw new Error('No team found with given teamId')
  }

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
