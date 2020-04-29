import { IGame } from '../games/games.model'

export const solvePhrase = async (
  game: IGame,
  phraseId: string,
) => {
  const turn = game.turns[0]

  // Should we really be checking the round here?
  const currentRound = turn.round

  if (currentRound === 1 || currentRound === 2 || currentRound === 3) {
    // Calculate the duration.
    const now = Date.now()
    let duration = 0
    if (turn.playedPhrases.length > 0) {
      // Get the timestamp of the phrase before this.
      duration = now - turn.playedPhrases[turn.playedPhrases.length - 1].timestamp
    } else {
      duration = now - (turn.startTime ?? 0)
    }

    // Add to the turn's phrase array as solved.
    turn.playedPhrases.push({
      phraseId,
      solved: true,
      timestamp: now,
      duration,
    })

    // Remove the solved phrase from the game's unsolved array.
    const unsolved = game.unsolvedPhraseIds.filter(uPI => uPI !== phraseId)
    game.set('unsolvedPhraseIds', unsolved)

    // Save
    await game.save()
  }
  return game
}
