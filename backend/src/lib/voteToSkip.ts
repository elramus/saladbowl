import { IGame } from './../games/games.model'

export const voteToSkip = async ({
  game,
  userId,
}: {
  game: IGame
  userId: string
}) => {
  // Add this player to the vote to skip list.
  const newVoteList = [
    ...game.turns[0].votesToSkip.filter(id => id !== userId),
    userId,
  ]

  game.turns[0].votesToSkip = newVoteList

  await game.save()

  return game
}
