import { IGame } from '../games/games.model'

export const solvePhrase = async (
  game: IGame,
  phraseId: string,
  userId: string,
) => {
  const currentRound = game.turns[0].round

  if (currentRound === 1 || currentRound === 2 || currentRound === 3) {
    // Add the phrase the solved phrases array.
    game.turns[0].solvedPhraseIds.push(phraseId)

    // Remove the solved phrase from the unsolved array.
    game.set('unsolvedPhraseIds', game.unsolvedPhraseIds.filter((uPI) => uPI !== phraseId))

    // Increment the team's score.
    const userTeam = game.teams.find((t) => t.userIds.includes(userId))
    if (!userTeam) throw new Error('Error finding team for user')
    userTeam.score += 1
    game.teams.pull(userTeam._id)
    game.teams.push(userTeam)

    // Save
    await game.save()
  }
  return game
}
