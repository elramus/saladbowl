import { Game } from '../store/game/types'

export const getPlayerFromUserId = ({
  userId,
  game,
}: {
  userId: string;
  game: Game;
}) => {
  const player = game.players.find(p => p.user._id === userId)

  if (!player) throw new Error('invalid user ID')

  return player
}
