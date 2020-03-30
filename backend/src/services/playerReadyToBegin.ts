import { Game } from '../models/game'

export const playerReadyToBegin = async ({
  gameId,
  playerId,
  status,
}: {
  gameId: string;
  playerId: string;
  status: boolean;
}) => {
  try {
    const game = await Game.findById(gameId)
    if (!game) throw new Error('Game not found')

    // Get the player
    const updatedPlayer = game.players.find((player) => player._id.toString() === playerId)
    // Mark them ready
    if (updatedPlayer) updatedPlayer.ready = status
    // Pull the old player off
    game.players.pull(playerId)
    // Push the updated one on.
    game.players.push(updatedPlayer)
    await game.save()

    return game
  } catch (e) {
    throw new Error(e)
  }
}
