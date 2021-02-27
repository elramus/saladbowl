import mongoose from 'mongoose'
import { dbConnectTest } from '../test-utils/dbConnectTest'
import { emptyMongoose } from '../test-utils/emptyMongoose'
import { gameFactory } from '../test-utils/gameFactory'
import { createGamePhrase } from './createGamePhrase'
import { io } from '../server'

jest.mock('../server')

describe('createGamePhrase', () => {
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

  it('creates a phrase and adds to game', async () => {
    const { game } = await gameFactory()
    const authorId = game.players[0].user._id.toString()

    const updatedGame = await createGamePhrase(
      authorId,
      game._id.toString(),
      'Best Phrase Ever',
    )

    // Should update successfully.
    expect(updatedGame).toBeTruthy()

    // Our phrase should now be on the game.
    const newPhrase = updatedGame?.phrases.filter(
      p => p.text === 'Best Phrase Ever',
    )
    expect(newPhrase).toHaveLength(1)

    // Should have broadcasted.
    expect(io.to).toHaveBeenCalledWith(game._id.toString())
    expect(io.emit).toHaveBeenCalled()
  })
})
