import { User } from '../store/user/types'
import { Game } from '../store/game/types'

export const getUserFromUserId = ({
  userId,
  game,
}: {
  userId: string;
  game: Game;
}): User => {
  const player = game.players.find(p => p.user._id === userId)

  if (!player) throw new Error('Player not found from ID')

  return player.user
}
