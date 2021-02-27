import mongoose from 'mongoose'
import { dbConnectTest } from '../test-utils/dbConnectTest'
import { emptyMongoose } from '../test-utils/emptyMongoose'
import { gameFactory } from '../test-utils/gameFactory'
import { chooseFirstPlayer } from './chooseFirstPlayer'

jest.mock('../server')

describe('chooseFirstPlayer', () => {
  beforeAll(async () => {
    await dbConnectTest()
  })
  afterEach(async () => {
    await emptyMongoose()
  })
  afterAll(async done => {
    await mongoose.connection.close()
    done()
  })

  it('randomly chooses a player', async () => {
    const { game } = await gameFactory()

    const { firstPlayerIndex, firstTeam } = chooseFirstPlayer(game)

    // We'll look for the actual player now.
    const userId = firstTeam.userIds[firstPlayerIndex]
    const player = game.players.find(p => p.user._id.equals(userId))

    expect(firstPlayerIndex).toBeLessThanOrEqual(game.players.length)
    expect(player).toBeTruthy()
    expect(firstTeam).toBeTruthy()
  })
})
