import { IGame } from '../games/games.model'

export const undoSolvePhrase = async ({
  game,
  phraseId,
}: {
  game: IGame
  phraseId: string
}) => {
  // Pop the last phrase off the current turn's played phrases.
  const phraseToUndo = game.turns[0].playedPhrases.pop()
  if (!phraseToUndo) throw new Error('Trying to undo nonexistent phrase, foo')

  // Add the phrase ID to the front of unsolved phrase array.
  game.unsolvedPhraseIds.unshift(phraseId)

  // Save and return
  await game.save()
  return game
}
