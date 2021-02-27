import { IGame, Game } from '../games/games.model'
import { User, IUser } from '../users/users.model'
import { playerFactory } from './playerFactory'
import { userFactory } from './userFactory'
import { teamFactory } from './teamFactory'
import { phraseFactory } from './phraseFactory'
import { IPlayer } from '../players/players.model'

export const gameFactory = async (
  params?: Partial<IGame>,
  additionalUsers: IUser[] = [],
) => {
  const creator = new User({ name: 'admin' })
  await creator.save()

  // Create four users.
  const user1 = await userFactory({ name: 'User 1' })
  const user2 = await userFactory({ name: 'User 2' })
  const user3 = await userFactory({ name: 'User 3' })
  const user4 = await userFactory({ name: 'User 4' })

  // Put them on to teams.
  // Also add any additional users.
  const team1 = await teamFactory({
    name: 'Team A',
    userIds: [user1._id, user2._id, ...additionalUsers.map(user => user._id)],
  })
  const team2 = await teamFactory({
    name: 'Team B',
    userIds: [user3._id, user4._id],
  })

  const player1 = await playerFactory({ user: user1 })
  const player2 = await playerFactory({ user: user2 })
  const player3 = await playerFactory({ user: user3 })
  const player4 = await playerFactory({ user: user4 })

  async function createAdditionalPlayers() {
    const players: IPlayer[] = []
    additionalUsers.forEach(async user => {
      const player = await playerFactory({ user })
      players.push(player)
    })
    return players
  }

  const game = new Game({
    shortId: params?.shortId ?? 1111,
    creatorId: params?.creatorId ?? creator._id,
    startTime: params?.startTime ?? Date.now(),
    players: params?.players ?? [
      player1,
      player2,
      player3,
      player4,
      ...(await createAdditionalPlayers()),
    ],
    teams: params?.teams ?? [team1, team2],
    phrases: params?.phrases ?? [
      await phraseFactory({ authorId: user1._id }),
      await phraseFactory({ authorId: user1._id }),
      await phraseFactory({ authorId: user1._id }),
      await phraseFactory({ authorId: user1._id }),
    ],
  })
  await game.save()

  // Use turn runner to add first round and a new turn.
  // const tR = new TurnRunner({ game, user: user1 })
  // await tR.prepNewRound()
  // await tR.addNewTurn({
  //   roundNum: 1,
  //   nextUserId: user1._id.toString(),
  // })

  return {
    game,
    users: [user1, user2, user3, user4],
  }
}
