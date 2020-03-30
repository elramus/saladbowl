import { Game } from '../store/game/types'

export const getPlayerFromId = (
  playerId: string,
  game: Game,
) => {
  const user = game.players.find((p) => p.user._id === playerId)?.user
  return user
}
