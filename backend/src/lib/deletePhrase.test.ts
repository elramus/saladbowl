import mongoose from 'mongoose'
import { dbConnectTest } from '../test-utils/dbConnectTest'
import { emptyMongoose } from '../test-utils/emptyMongoose'
import { gameFactory } from '../test-utils/gameFactory'
import deletePhrase from './deletePhrase'

jest.mock('../server')

describe('deletePhrase', () => {
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

  it('deletes a phrase', async () => {
    const { game } = await gameFactory()

    // Starts with four phrases.
    expect(game.phrases).toHaveLength(4)

    const updatedGame = await deletePhrase(game._id.toString(), game.phrases[0]._id.toString())

    // TODO: remove it from anywhere else in the game.

    // Now it'll have three.
    expect(updatedGame.phrases).toHaveLength(3)
  })
})
