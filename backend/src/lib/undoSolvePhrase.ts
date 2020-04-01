import { IGame } from '../games/games.model'

export const undoSolvePhrase = ({
  game,
  phraseId,
  userId,
}: {
  game: IGame;
  phraseId: string;
  userId: string;
}) => {
  // Pop the last phrase off the current turn's solved phrases
  // to undo the solving.
  game.turns[0].solvedPhraseIds.pop()

  // Unshift the passed phrase ID to the unsolved phrase array.
  game.unsolvedPhraseIds.unshift(phraseId)

  // Decrement the team's score.
  const userTeam = game.teams.find((t) => t.userIds.includes(userId))
  if (!userTeam) throw new Error('Invalid userTeam')
  const tI = game.teams.indexOf(userTeam)
  game.teams[tI].set('score', userTeam.score - 1)

  return game
}
