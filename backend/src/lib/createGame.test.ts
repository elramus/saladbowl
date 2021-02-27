import mongoose from 'mongoose'
import { dbConnectTest } from '../test-utils/dbConnectTest'
import { emptyMongoose } from '../test-utils/emptyMongoose'
import { userFactory } from '../test-utils/userFactory'
import { createGame } from './createGame'

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

  it('creates a new game without passed teams', async () => {
    const user = await userFactory()

    const newGame = await createGame(user._id.toString())

    // Has a valid short ID.
    expect(newGame.shortId).toBeGreaterThanOrEqual(1000)
    expect(newGame.shortId).toBeLessThanOrEqual(9999)

    // Does not have teams because they were not passed in.
    expect(newGame.teams).toHaveLength(0)
  })

  it('creates a new game with passed teams', async () => {
    const user = await userFactory()

    const newGame = await createGame(user._id.toString(), [
      'The First Team',
      'The Second Team',
    ])

    // Has a valid short ID.
    expect(newGame.shortId).toBeGreaterThanOrEqual(1000)
    expect(newGame.shortId).toBeLessThanOrEqual(9999)

    // Has two teams.
    expect(newGame.teams).toHaveLength(2)

    // They have our passed in names.
    expect(newGame.teams[0].name).toEqual('The First Team')
    expect(newGame.teams[1].name).toEqual('The Second Team')
  })
})
