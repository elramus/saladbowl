import { randomNum } from '../utils/randomNum'
import { Game } from '../games/games.model'
import { Team, ITeam } from '../teams/teams.model'

export const createGame = async (userId: string, teamNames?: string[]) => {
  let shortId: number | null = null

  async function getShortId() {
    const random = randomNum(1000, 9999)
    const existingGame = await Game.findOne({ shortId: random })
    if (!existingGame) {
      shortId = random
    } else {
      await getShortId()
    }
  }
  await getShortId()

  function makeTeams() {
    const teams: ITeam[] = []
    if (teamNames) {
      if (teamNames[0]) {
        const team0 = new Team({
          name: teamNames[0],
        })
        teams.push(team0)
      }
      if (teamNames[1]) {
        const team1 = new Team({
          name: teamNames[1],
        })
        teams.push(team1)
      }
    }
    return teams
  }
  const teams = makeTeams()

  // Alphabetize the teams.
  teams.sort((t1, t2) => (t1.name > t2.name ? 1 : -1))

  const newGame = new Game({
    shortId,
    creatorId: userId,
    teams,
  })

  try {
    await newGame.save()
  } catch (e) {
    throw new Error(e.message)
  }

  return newGame
}
