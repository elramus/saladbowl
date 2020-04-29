import { IGame } from '../games/games.model'
import { PlayedPhrase } from '../turns/turns.model'

export const applyTurnResults = async ({
  game,
  playedPhrases,
}: {
  game: IGame;
  playedPhrases?: PlayedPhrase[];
}) => {
  try {
    const turn = game.turns[0]

    // If played phrases have been passed in, we'll set them here.
    // These will be passed in if the turn's results are being corrected.
    if (playedPhrases) {
      turn.playedPhrases = playedPhrases
    }

    // Get the total number of solved phrases and add it to the team's score
    let pointsEarned = 0
    turn.playedPhrases.forEach(playedPhrase => {
      if (playedPhrase.solved) pointsEarned += 1
    })

    const team = game.teams.find(t => t._id.toString() === turn.teamId.toString())
    if (!team) throw new Error('invalid team ID')

    const updatedScore = team.score + pointsEarned
    team.score = updatedScore

    // Filter out any solved phrases from the unsolved phrases array.
    // (There might be some if the player did any corrections in turn review.)
    const updatedPhrases = game.unsolvedPhraseIds.filter(pId => (
      turn.playedPhrases.every(played => played.phraseId !== pId || !played.solved)
    ))

    const updatedGame = game
    updatedGame.unsolvedPhraseIds = updatedPhrases

    await updatedGame.save()

    return updatedGame
  } catch (e) {
    throw new Error(e.message)
  }
}
