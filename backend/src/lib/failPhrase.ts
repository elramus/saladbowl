import { IGame } from '../games/games.model'

export const failPhrase = async ({
  game,
  phraseId,
}: {
  game: IGame
  phraseId: string
}) => {
  // If there's more than 1 phrase in the bowl, move this failed phrase
  // to the end.
  if (game.unsolvedPhraseIds.length > 1) {
    // Right now the phrase we want to skip is at the front of the array.
    // First remove it.
    const updatedPhraseIds = game.unsolvedPhraseIds.slice(1)

    // Now add it to the back.
    updatedPhraseIds.push(phraseId)

    game.set('unsolvedPhraseIds', updatedPhraseIds, { strict: true })
  }

  // Now add this phrase to the turn's played phrases.
  const turn = game.turns[0]

  // Calculate the duration.
  const now = Date.now()
  let duration = 0
  if (turn.playedPhrases.length > 0) {
    // Get the timestamp of the phrase before this.
    duration = now - turn.playedPhrases[turn.playedPhrases.length - 1].timestamp
  } else {
    duration = now - (turn.startTime ?? 0)
  }

  // Add to the turn's phrase array as not solved.
  turn.playedPhrases.push({
    phraseId,
    solved: false,
    timestamp: now,
    duration,
  })

  // Update and save the game.
  await game.save()

  return game
}
