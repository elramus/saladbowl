import mongoose from 'mongoose'
import { dbConnectTest } from '../test-utils/dbConnectTest'
import { emptyMongoose } from '../test-utils/emptyMongoose'
import { gameFactory } from '../test-utils/gameFactory'
import { TurnRunner } from './TurnRunner'
import { Team } from '../teams/teams.model'
import { User } from '../users/users.model'
import { decideNextPrompter } from './decideNextPrompter'

jest.mock('../server')

describe('decideNextPrompter', () => {
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

  it('chooses who goes next', async () => {
    const { game } = await gameFactory()
    const { user } = game.players[0]

    const tR = new TurnRunner({ game, user })

    // This will pick someone to go first.
    await tR.prepGame()

    const justWentTeam = await Team.findById(game.preRoll.firstTeamId)
    const justWentUser = await User.findById(
      justWentTeam?.userIds[justWentTeam.lastPrompterIndex],
    )

    if (!justWentUser || !justWentTeam)
      throw new Error('could not find justWentUser')

    const [nextPlayerIndex, nextUserId, nextTeam] = decideNextPrompter(
      game,
      justWentUser,
    )

    // The next player index should be one more than the last prompter index,
    // unless that'd bump us up too high.
    expect(nextPlayerIndex).toBe(
      nextTeam.lastPrompterIndex + 1 !== nextTeam.userIds.length
        ? nextTeam.lastPrompterIndex + 1
        : 0,
    )
    // They should not be on our first team.
    expect(justWentTeam.userIds).not.toContain(nextUserId)
    // They should not be the same user.
    expect(nextUserId).not.toBe(justWentUser._id.toString())
    // Next team should not be the team we started with.
    expect(justWentTeam._id.toString()).not.toBe(nextTeam._id.toString())

    // There are four players on our test game.
    decideNextPrompter(game, justWentUser)
    decideNextPrompter(game, justWentUser)
    decideNextPrompter(game, justWentUser)
    decideNextPrompter(game, justWentUser)
    // So, if we keep going we should cycle back around to them.

    // console.log('userId we started with', justWentUser._id.toString())
    // console.log('teamId we started with', justWentTeam._id.toString())

    const [
      originalPlayerIndex,
      originalUserId,
      originalTeam,
    ] = decideNextPrompter(game, justWentUser)

    // console.log('just picked...', originalUserId)
    // console.log(originalTeam._id.toString())

    // expect(originalUserId).toBe(justWentUser._id.toString())
    // expect(originalTeam._id.toString()).toBe(justWentTeam._id.toString())
  })
})
