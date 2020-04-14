import { IGame } from '../games/games.model'
import { shuffleArray } from '../utils/shuffleArray'
import { IPlayer } from '../players/players.model'

export const makeTeams = async ({
  game,
  numberOfTeams = 2,
}: {
  game: IGame;
  numberOfTeams?: number;
}) => {
  for (let i = 0; i < numberOfTeams; i += 1) {
    // For now, just "Team 1", etc. TODO: make them more interesting.
    const name = `Team ${i + 1}`
    game.teams.push({ name })
  }
  await game.save()

  // Now go through the players and add each one to a team.
  const shuffledPlayers = shuffleArray<IPlayer>(game.players)
  let teamIndex = 0
  shuffledPlayers.forEach((p) => {
    game.teams[teamIndex].userIds.push(p.user._id)
    if (teamIndex < (game.teams.length - 1)) {
      teamIndex += 1
    } else {
      teamIndex = 0
    }
  })

  await game.save()

  return game
}
