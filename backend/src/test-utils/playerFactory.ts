import { IPlayer, Player } from '../players/players.model'
import { User } from '../users/users.model'

export const playerFactory = async (params?: Partial<IPlayer>) => {
  // If no user was passed in, we'll need to instantiate a new one.
  const user = params?.user ?? new User({ name: `Player-${Date.now()}` })
  await user.save()
  const player = new Player({
    user,
    readyToPlay: params?.readyToPlay ?? false,
  })
  await player.save()
  return player
}
