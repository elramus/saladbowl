import mongoose from 'mongoose'
import { dbConnectTest } from '../test-utils/dbConnectTest'
import { emptyMongoose } from '../test-utils/emptyMongoose'
import { gameFactory } from '../test-utils/gameFactory'
import { changeReadyStatus } from './changeReadyStatus'

jest.mock('../server')

describe('changeReadyStatus', () => {
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

  it('changes not ready to ready and back again', async () => {
    const { game } = await gameFactory()
    const { players } = game
    const player = players[0]

    // Verify we're starting as false.
    expect(player.readyToPlay).toBeFalsy()

    // Change from not ready to ready.
    await changeReadyStatus({
      userId: player.user.id.toString(),
      game,
      status: true,
    })

    // Should be true now.
    expect(player.readyToPlay).toBeTruthy()

    // Other players haven't changed.
    expect(players[1].readyToPlay).toBeFalsy()
    expect(players[2].readyToPlay).toBeFalsy()

    // Now change back.
    await changeReadyStatus({
      userId: player.user.id.toString(),
      game,
      status: false,
    })

    // Should be false now.
    expect(player.readyToPlay).toBeFalsy()
  })
})
