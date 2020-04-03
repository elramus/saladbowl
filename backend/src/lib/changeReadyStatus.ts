import { IGame } from '../games/games.model'

export const changeReadyStatus = async ({
  userId,
  game,
  status,
}: {
  userId: string;
  game: IGame;
  status: boolean;
}) => {
  const player = game.players.find((p) => p.user._id.equals(userId))
  if (!player) throw new Error('Player not found from user ID')

  // Pull the old player off
  game.players.pull(player._id)
  // Make the update
  player.ready = status
  // Push the updated one on.
  game.players.push(player)
  // Save
  await game.save()

  return game
}
