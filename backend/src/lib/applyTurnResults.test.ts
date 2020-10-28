import mongoose from 'mongoose'
import faker from 'faker'
import { dbConnectTest } from '../test-utils/dbConnectTest'
import { gameFactory } from '../test-utils/gameFactory'
import { emptyMongoose } from '../test-utils/emptyMongoose'
import { applyTurnResults } from './applyTurnResults'
import { PlayedPhrase } from '../turns/turns.model'
import { TurnRunner } from './TurnRunner'

jest.mock('../server')

describe('applyTurnResults', () => {
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

  it('adds played phrases from turn', async () => {
    const { game } = await gameFactory()
    const { user } = game.players[0]

    // Add a first turn.
    const tR = new TurnRunner({ game, user })
    await tR.prepNewRound()
    await tR.addNewTurn({
      roundNum: 1,
      nextUserId: user._id.toString(),
    })

    // Simulate playing through the phrases.
    game.phrases.forEach((phrase, i) => {
      game.turns[0].playedPhrases.push({
        phraseId: phrase._id.toString(),
        solved: i % 2 === 0, // We'll make every other be unsolved.
        timestamp: Date.now(),
        duration: faker.random.number(20),
      })
    })

    await applyTurnResults({ game })

    // // Team 1 should have 2 points.
    expect(game.teams[0].score).toBe(2)

    // // Phrase 0 should not be in unsolved array because it was solved.
    expect(game.unsolvedPhraseIds.includes(game.phrases[0]._id)).toBeFalsy()

    // // Phrase 1 should be added to unsolved.
    expect(game.unsolvedPhraseIds.includes(game.phrases[1]._id)).toBeTruthy()
  })

  it('adds played phrases passed in as param', async () => {
    const { game } = await gameFactory()
    const { user } = game.players[0]

    // Add a first turn.
    const tR = new TurnRunner({ game, user })
    await tR.prepNewRound()
    await tR.addNewTurn({
      roundNum: 1,
      nextUserId: user._id.toString(),
    })

    // Make an array of played phrases to pass in manually.
    const playedPhrases: PlayedPhrase[] = []

    // "Play" the game's phrases.
    game.phrases.forEach((phrase, i) => {
      playedPhrases.push({
        phraseId: phrase._id.toString(),
        solved: i % 2 === 0, // We'll make every other be unsolved.
        timestamp: Date.now(),
        duration: faker.random.number(20),
      })
    })

    await applyTurnResults({ game, playedPhrases })

    // Team 1 should have 2 points.
    expect(game.teams[0].score).toBe(2)

    // Phrase 0 should not be in unsolved array because it was solved.
    expect(game.unsolvedPhraseIds.includes(game.phrases[0]._id)).toBeFalsy()
    expect(game.unsolvedPhraseIds.length).toBe(2)

    // Phrase 1 should be added to unsolved.
    expect(game.unsolvedPhraseIds.includes(game.phrases[1]._id)).toBeTruthy()
  })
})
