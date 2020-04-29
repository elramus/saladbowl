import { IGame } from '../games/games.model'
import { shuffleArray } from '../utils/shuffleArray'
import { IPlayer } from '../players/players.model'
import { animals, adjectives } from '../content/teamNames'
import { upperCaseFirstLetter } from '../utils/upperCaseFirstLetter'

export const makeTeams = async ({
  game,
  numberOfTeams = 2,
}: {
  game: IGame;
  numberOfTeams?: number;
}) => {
  for (let i = 1; i <= numberOfTeams; i += 1) {
    const animal = upperCaseFirstLetter(shuffleArray(animals)[0])
    const adjective = upperCaseFirstLetter(shuffleArray(adjectives)[0])
    const name = `${adjective} ${animal}`
    game.teams.push({ name })
  }
  try {
    await game.save()
  } catch (e) {
    throw new Error(e.message)
  }

  // Now go through the players and add each one to a team.
  const shuffledPlayers = shuffleArray<IPlayer>(game.players)
  let teamIndex = 0
  shuffledPlayers.forEach(p => {
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
