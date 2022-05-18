import { IGame } from '../games/games.model'
import { PlayedPhrase } from '../turns/turns.model'

export const applyTurnResults = async ({
  game,
  playedPhrases,
}: {
  game: IGame
  playedPhrases?: PlayedPhrase[]
}) => {
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

  // We need to update the unsolvedPhrases array to reflect changes from
  // turn review modal.
  turn.playedPhrases.forEach(pp => {
    if (pp.solved && game.unsolvedPhraseIds.includes(pp.phraseId)) {
      game.unsolvedPhraseIds = game.unsolvedPhraseIds.filter(
        pId => pId !== pp.phraseId,
      )
    }
    if (!pp.solved && !game.unsolvedPhraseIds.includes(pp.phraseId)) {
      game.unsolvedPhraseIds.push(pp.phraseId)
    }
  })

  await game.save()

  return game
}
