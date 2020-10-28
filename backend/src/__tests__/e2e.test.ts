/* eslint-disable max-len */
import mongoose from 'mongoose'
import supertest from 'supertest'
import { app } from '../app'
import { dbConnectTest } from '../test-utils/dbConnectTest'
import { extractToken } from '../test-utils/extractToken'
import { IUser, User } from '../users/users.model'
import { Game, IGame } from '../games/games.model'
import { emptyMongoose } from '../test-utils/emptyMongoose'
import { NextActions } from '../lib/constants'
import { ITeam } from '../teams/teams.model'
import { PlayedPhrase } from '../turns/turns.model'

jest.mock('../server')

const request = supertest(app)

const users: { [name: string]: IUser } = {}
const cookies: { [name: string]: [string] } = {}

let game: IGame | null = null
let prompter: IUser | null = null
const prompterOrder: string[] = []

describe('feature test', () => {
  beforeAll(async () => {
    await dbConnectTest()
  })
  afterEach(async () => {
    //
  })
  afterAll(async done => {
    await emptyMongoose()
    await mongoose.connection.close()
    done()
  })

  test('pre-game setup', async done => {
    // First thing that happens is the player logs in.
    let res = await request.post('/api/v1/login').send({ name: 'luke' }).expect(200)

    // We should get back a user with an ID, get the token.
    users.luke = res.body.user
    expect(users.luke._id).toBeDefined()
    cookies.luke = [`token=${extractToken(res)}`]
    expect(cookies.luke).toBeDefined()

    // Now make a game!
    res = await request.post('/api/v1/games').set('Cookie', cookies.luke)
      .expect(200)

    game = res.body.game

    // Game should be started by our user.
    expect(game?.creatorId).toEqual(users.luke._id)

    // They should be the only player on there, and not ready.
    expect(game?.players.length).toEqual(1)
    expect(game?.players[0].user._id).toEqual(users.luke._id)
    expect(game?.players[0].readyToPlay).toBeFalsy()

    // Awesome, next thing is that some more players will go to the site.
    res = await request.post('/api/v1/login').send({ name: 'nicole' }).expect(200)
    users.nicole = res.body.user
    expect(users.nicole._id).toBeDefined()
    cookies.nicole = [`token=${extractToken(res)}`]
    expect(cookies.nicole).toBeDefined()

    res = await request.post('/api/v1/login').send({ name: 'roger' }).expect(200)
    users.roger = res.body.user
    expect(users.roger._id).toBeDefined()
    cookies.roger = [`token=${extractToken(res)}`]
    expect(cookies.roger).toBeDefined()

    res = await request.post('/api/v1/login').send({ name: 'donita' }).expect(200)
    users.donita = res.body.user
    expect(users.donita._id).toBeDefined()
    cookies.donita = [`token=${extractToken(res)}`]
    expect(cookies.donita).toBeDefined()

    // Join our new players to the game.
    await Promise.all(Object.values(cookies).map(async token => {
      await request.get(`/api/v1/games/${game?.shortId}`).set('Cookie', token)
    }))

    game = await Game.findById(game?._id).exec()
    expect(game?.players).toHaveLength(4)

    // Now each player will submit two phrases.
    await Promise.all(Object.values(cookies).map(async (token, index) => {
      await request.post(`/api/v1/games/${game?._id}/phrases`)
        .set('Cookie', token)
        .send({ text: `this is player ${index}'s first phrase!` })
    }))
    await Promise.all(Object.values(cookies).map(async (token, index) => {
      await request.post(`/api/v1/games/${game?._id}/phrases`)
        .set('Cookie', token)
        .send({ text: `this is player ${index}'s second phrase!` })
    }))

    // Maybe add a delete test here?
    //

    // Do we now have 8 phrases attached?
    game = await Game.findById(game?._id).exec()
    expect(game?.phrases).toHaveLength(8)

    // Now everyone marks themselves ready.
    await request.put(`/api/v1/games/${game?._id}/player-ready-status`)
      .set('Cookie', cookies.luke)
      .send({ readyStatus: true })
      .expect(200)
    await request.put(`/api/v1/games/${game?._id}/player-ready-status`)
      .set('Cookie', cookies.nicole)
      .send({ readyStatus: true })
      .expect(200)
    await request.put(`/api/v1/games/${game?._id}/player-ready-status`)
      .set('Cookie', cookies.roger)
      .send({ readyStatus: true })
      .expect(200)

    // Actually Luke wasn't ready.
    await request.put(`/api/v1/games/${game?._id}/player-ready-status`)
      .set('Cookie', cookies.luke)
      .send({ readyStatus: false })
      .expect(200)

    res = await request.put(`/api/v1/games/${game?._id}/player-ready-status`)
      .set('Cookie', cookies.donita)
      .send({ readyStatus: true })
      .expect(200)

    // Game should not have started because Luke marked not ready.
    game = res.body.game
    expect(game?.preRoll.show).toBeFalsy()
    expect(game?.startTime).toBeNull()

    // Okay now Luke's ready.
    await request.put(`/api/v1/games/${game?._id}/player-ready-status`)
      .set('Cookie', cookies.luke)
      .send({ readyStatus: true })
      .expect(200)

    // Everyone is ready, right?
    game = await Game.findById(game?._id).exec()
    if (game) {
      game.players.forEach(player => {
        expect(player.readyToPlay).toEqual(true)
      })
    }

    // When the last person marked themselves ready, prep game will run.
    expect(game?.startTime).not.toBeNull()

    // Each team should have two players on it.
    expect(game?.teams[0].userIds).toHaveLength(2)
    expect(game?.teams[1].userIds).toHaveLength(2)

    // We should be showing pre-roll and have chosen a first team.
    expect(game?.preRoll.show).toEqual(true)
    expect(game?.preRoll.firstTeamId).not.toBeNull()

    // At this point we're waiting for the front end to do its pre-roll
    // animations. When they're done, the game's creator should fire a
    // next action to go ahead with the first turn. (Note that this gets
    // sent automatically from front-end by the person who is the game's
    // creator.)
    res = await request.put(`/api/v1/games/${game?._id}/next-action`)
      .set('Cookie', cookies.luke)
      .expect(200)

    expect(res.text).toEqual(NextActions.FINISH_PREROLL_ADD_TURN)

    game = await Game.findById(game?._id).exec()

    // Should have a turn.
    expect(game?.turns).toHaveLength(1)
    // Our phases should have all been added to the unsolved list.
    expect(game?.unsolvedPhraseIds.length).toEqual(game?.phrases.length)

    done()
  })

  test('starting the game', async done => {
    // Who is supposed to go first?
    // We were told who first team is, and we have their prompter index.
    const firstTeam = game?.teams.id(game?.preRoll.firstTeamId)
    const firstPlayer = await User.findById(firstTeam?.userIds[firstTeam.lastPrompterIndex]).exec()

    // First player should be attached to the first turn.
    expect(game?.turns[0].userId.toString()).toEqual(firstPlayer?._id.toString())

    // No start time, and don't start the countdown until we get the
    // prompt from player on deck hitting "ready".
    expect(game?.turns[0].startTime).toBeNull()
    expect(game?.turns[0].showCountdown).toBeFalsy()

    // Ready!!
    const res = await request.put(`/api/v1/games/${game?._id}/next-action`)
      .set('Cookie', cookies[firstPlayer?.name ?? ''])
      .send({ config: {} })
      .expect(200)
    expect(res.text).toEqual(NextActions.STARTING_COUNTDOWN)

    // Now the game should be showing the countdown...
    game = await Game.findById(game?._id).exec()
    expect(game?.turns[0].showCountdown).toBeTruthy()

    // After three seconds, we should have begun round 1.
    setTimeout(async () => {
      game = await Game.findById(game?._id).exec()

      expect(game?.turns[0].showCountdown).toBeFalsy()
      expect(game?.turns[0].startTime).not.toBeNull()
      expect(game?.turns[0].round).toEqual(1)

      done()
    }, 3500)
  })

  test('playing round 1, prompter 1', async done => {
    game = await Game.findById(game?._id).exec() as IGame

    // Since there are only two players on each team, this won't be
    // a very exciting game :)

    // Pluck out who is prompting right now.
    prompter = await User.findById(game.turns[0].userId).exec() as IUser
    prompterOrder.push(prompter.id.toString())

    // Teammate guesses the first phrase after 15 seconds.
    // The phrase being prompted is always the first in the unsolved phrase array.
    let res = await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter.name])
      .send({
        phraseId: game.unsolvedPhraseIds[0],
        timeRemaining: 45,
      })
      .expect(200)

    game = res.body.game as IGame
    expect(game.turns[0].playedPhrases).toHaveLength(1)
    expect(game.unsolvedPhraseIds).toHaveLength(7)

    // Now we'll go ahead and solve 3 more this turn. Day-um, this player
    // is nailing it!
    res = await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter.name])
      .send({
        phraseId: game.unsolvedPhraseIds[0],
        timeRemaining: 30,
      })
      .expect(200)

    game = res.body.game as IGame
    res = await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter.name])
      .send({
        phraseId: game.unsolvedPhraseIds[0],
        timeRemaining: 25,
      })
      .expect(200)

    game = res.body.game as IGame
    res = await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter.name])
      .send({
        phraseId: game.unsolvedPhraseIds[0],
        timeRemaining: 1,
      })
      .expect(200)

    game = res.body.game as IGame
    expect(game.turns[0].playedPhrases).toHaveLength(4)
    expect(game.unsolvedPhraseIds).toHaveLength(4)

    // At this point in the real game the front-end would fire a fail
    // phrase when the timer hits 0.
    res = await request.put(`/api/v1/games/${game._id}/fail-phrase`)
      .set('Cookie', cookies[prompter.name])
      .send({ phraseId: game.unsolvedPhraseIds[0] })
      .expect(200)

    game = res.body.game as IGame
    const { playedPhrases } = game.turns[0]
    // The phrase that we ran out of time on should be unsolved.
    expect(playedPhrases[playedPhrases.length - 1].solved).toBeFalsy()

    // The prompter doesn't review in this case and just clicks submit results.
    // This dispatches Submit Played Phrases.
    res = await request.post(`/api/v1/games/${game._id}/submit-played-phrases`)
      .set('Cookie', cookies[prompter.name])
      .send({ playedPhrases: game.turns[0].playedPhrases })
      .expect(200)

    expect(res.text).toEqual(NextActions.SAME_ROUND_NEXT_PLAYER)

    done()
  })

  test('prepping round 1, prompter 2', async done => {
    game = await Game.findById(game?._id).exec() as IGame

    // The team who just finished should have a score of 4 at this point.
    const teamJustFinished = game.teams.find(t => t._id.toString() === game?.turns[1].teamId.toString())
    expect(teamJustFinished?.score).toEqual(4)

    // And we have a brand spanking new turn added.
    expect(game.turns).toHaveLength(2)
    expect(game.turns[0].showCountdown).toBeFalsy()
    expect(game.turns[0].startTime).toBeNull()
    expect(game.turns[0].playedPhrases).toHaveLength(0)

    // It should now be the turn of the other team.
    expect(game.turns[0].teamId.toString()).not.toEqual(game.turns[1].teamId.toString())

    // Get new prompter
    prompter = await User.findById(game.turns[0].userId).exec() as IUser
    expect(prompterOrder).not.toContain(prompter.id.toString())
    prompterOrder.push(prompter.id.toString())

    // Waiting on the prompter to hit start...
    const res = await request.put(`/api/v1/games/${game._id}/next-action`)
      .set('Cookie', cookies[prompter.name])
      .expect(200)

    // Three second countdown...
    expect(res.text).toEqual(NextActions.STARTING_COUNTDOWN)

    setTimeout(async () => {
      game = await Game.findById(game?._id).exec()

      expect(game?.turns[0].showCountdown).toBeFalsy()
      expect(game?.turns[0].startTime).not.toBeNull()
      expect(game?.turns[0].round).toEqual(1) // Still round 1

      done()
    }, 3500)
  })

  test('playing  1, prompter 2', async done => {
    game = await Game.findById(game?._id).exec() as IGame

    // Solve a phrase
    let res = await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[0],
        timeRemaining: 50,
      })
      .expect(200)

    game = res.body.game as IGame

    // Oops! Need to undo that solving der Bob...
    const playedPhrase = game.turns[0].playedPhrases[game.turns[0].playedPhrases.length - 1]
    res = await request.put(`/api/v1/games/${game._id}/undo-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({ phraseId: playedPhrase.phraseId })
      .expect(200)

    game = res.body.game as IGame
    expect(game.turns[0].playedPhrases).toHaveLength(0)

    // okay we're going to burn through the rest of the round here.
    res = await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[0],
        timeRemaining: 30,
      })
      .expect(200)
    res = await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[1],
        timeRemaining: 25,
      })
      .expect(200)
    res = await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[2],
        timeRemaining: 20,
      })
      .expect(200)
    res = await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[3],
        timeRemaining: 15,
      })
      .expect(200)

    // We should see that they solved the last phrase of the round.
    expect(res.text).toEqual(NextActions.NEXT_ROUND_SAME_PLAYER)
    done()
  })

  test('prepping round 2, prompter 2 again', async done => {
    game = await Game.findById(game?._id).exec() as IGame

    // Same team and same prompter.
    expect(game.turns[0].userId.toString())
      .toEqual(prompterOrder[prompterOrder.length - 1])
    expect(game.turns[0].teamId.toString())
      .toEqual(game.turns[1].teamId.toString())

    // New round has begun!!
    expect(game.turns).toHaveLength(3)
    expect(game.turns[0].showCountdown).toBeFalsy()
    expect(game.turns[0].startTime).toBeNull()
    expect(game.turns[0].playedPhrases).toHaveLength(0)
    expect(game.unsolvedPhraseIds).toHaveLength(8)
    // We should be finishing up the player's turn. We told backend
    // that there were 15 seconds left.
    expect(game.turns[0].turnLength).toEqual(15)

    // This is the prompter hitting START.
    const res = await request.put(`/api/v1/games/${game._id}/next-action`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .expect(200)

    expect(res.text).toEqual(NextActions.STARTING_COUNTDOWN)

    setTimeout(async () => {
      game = await Game.findById(game?._id).exec()as IGame

      expect(game.turns[0].showCountdown).toBeFalsy()
      expect(game.turns[0].startTime).not.toBeNull()
      expect(game.turns[0].round).toEqual(2) // Still round 2

      done()
    }, 3500)
  })

  test('finishing turn in round 2', async done => {
    game = await Game.findById(game?._id).exec() as IGame
    prompter = prompter as IUser

    // Sadly the team cannot guess any. Fail on the phrase.
    let res = await request.put(`/api/v1/games/${game._id}/fail-phrase`)
      .set('Cookie', cookies[prompter.name])
      .send({ phraseId: game.unsolvedPhraseIds[0] })
      .expect(200)

    game = res.body.game as IGame

    // All phrases still unsolved.
    expect(game?.unsolvedPhraseIds).toHaveLength(8)
    // Just the one played phrase.
    expect(game?.turns[0].playedPhrases).toHaveLength(1)
    // And it was failed.
    expect(game?.turns[0].playedPhrases[0].solved).toBeFalsy()

    res = await request.post(`/api/v1/games/${game._id}/submit-played-phrases`)
      .set('Cookie', cookies[prompter.name])
      .send({ playedPhrases: game.turns[0].playedPhrases })
      .expect(200)

    expect(res.text).toEqual(NextActions.SAME_ROUND_NEXT_PLAYER)

    done()
  })

  test('prepping next turn in round 2', async done => {
    game = await Game.findById(game?._id).exec() as IGame
    prompter = prompter as IUser

    // We should have a new prompter.
    expect(game.turns[0].userId).not.toEqual(prompter.id.toString())
    // Shouldn't be anyone who's gone before.
    expect(prompterOrder).not.toContainEqual(game.turns[0].userId)
    // And should be the turn of the other team.
    expect(game.turns[0].teamId.toString()).not.toEqual(game.turns[1].teamId.toString())

    prompter = await User.findById(game.turns[0].userId).exec() as IUser
    prompterOrder.push(prompter?._id.toString())

    // Player hits ready! Huzzah!
    const res = await request.put(`/api/v1/games/${game._id}/next-action`)
      .set('Cookie', cookies[prompter.name])
      .expect(200)

    expect(res.text).toEqual(NextActions.STARTING_COUNTDOWN)

    setTimeout(async () => {
      game = await Game.findById(game?._id).exec() as IGame

      expect(game.turns[0].showCountdown).toBeFalsy()
      expect(game.turns[0].startTime).not.toBeNull()
      expect(game.turns[0].round).toEqual(2) // Still round 2

      done()
    }, 3500)
  })

  test('prompting next turn in round 2', async done => {
    game = await Game.findById(game?._id).exec() as IGame

    const promptingTeam = game.teams.find(
      t => t.id.toString() === game?.turns[0].teamId.toString(),
    ) as ITeam

    const startingScore = promptingTeam.score

    // We're going to power through them here...
    await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[0],
        timeRemaining: 55,
      })
      .expect(200)
    await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[1],
        timeRemaining: 50,
      })
      .expect(200)
    // Skipping one because no one could guess. Store it here so we can check later.
    const skippedPhraseId = game.unsolvedPhraseIds[2]
    await request.put(`/api/v1/games/${game._id}/fail-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: skippedPhraseId,
        timeRemaining: 45,
      })
      .expect(200)
    await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[3],
        timeRemaining: 40,
      })
      .expect(200)
    await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[4],
        timeRemaining: 35,
      })
      .expect(200)
    await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[5],
        timeRemaining: 30,
      })
      .expect(200)
    await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[6],
        timeRemaining: 25,
      })
      .expect(200)

    // Prompter runs out of time and sends a failed phrase.
    let res = await request.put(`/api/v1/games/${game._id}/fail-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({ phraseId: game.unsolvedPhraseIds[7] })
      .expect(200)

    game = res.body.game as IGame

    // That skipped phrase should be back in unsolved phrases.
    // Specifically, the second to last. The final failed phrase is last.
    expect(game.unsolvedPhraseIds[game.unsolvedPhraseIds.length - 2]).toEqual(skippedPhraseId)

    // Prompter is choosing to review. They got a buzzer beater, huzzah. So the
    // last one was solved but they didn't have time to hit the solved button.
    const updatedPhrases = [...game.turns[0].playedPhrases]
    const toChange = updatedPhrases.pop() as PlayedPhrase
    updatedPhrases.push({
      ...toChange,
      solved: true,
    })
    res = await request.post(`/api/v1/games/${game._id}/submit-played-phrases`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({ playedPhrases: updatedPhrases })
      .expect(200)

    expect(res.text).toEqual(NextActions.SAME_ROUND_NEXT_PLAYER)

    game = await Game.findById(game?._id).exec() as IGame

    // Should have gotten 7 points from all that.
    const updatedTeam = game.teams.find(t => t.id.toString() === promptingTeam.id.toString()) as ITeam
    expect(updatedTeam.score).toEqual(startingScore + 7)

    done()
  })

  test('preparing to finish round 2', async done => {
    game = await Game.findById(game?._id).exec() as IGame

    // New player takes over. Should be the same player as the beginning.
    prompter = await User.findById(game.turns[0].userId).exec() as IUser
    expect(prompterOrder).not.toContain(prompter.id.toString())
    prompterOrder.push(prompter.id.toString())

    // Prompter says ready.
    const res = await request.put(`/api/v1/games/${game._id}/next-action`)
      .set('Cookie', cookies[prompter.name])
      .expect(200)

    expect(res.text).toEqual(NextActions.STARTING_COUNTDOWN)

    setTimeout(async () => {
      game = await Game.findById(game?._id).exec() as IGame

      expect(game.turns[0].showCountdown).toBeFalsy()
      expect(game.turns[0].startTime).not.toBeNull()
      expect(game.turns[0].round).toEqual(2) // Still round 2

      done()
    }, 3500)
  })

  test('finishing round 2', async done => {
    game = await Game.findById(game?._id).exec() as IGame
    prompter = await User.findById(game.turns[0].userId).exec() as IUser

    // Solve the last phrase.
    let res = await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter.name])
      .send({
        phraseId: game.unsolvedPhraseIds[0],
        timeRemaining: 55,
      })
      .expect(200)

    expect(res.text).toEqual(NextActions.NEXT_ROUND_SAME_PLAYER)

    // Same player, now about to start round 3. They say they're ready.
    res = await request.put(`/api/v1/games/${game._id}/next-action`)
      .set('Cookie', cookies[prompter.name])
      .expect(200)
    expect(res.text).toEqual(NextActions.STARTING_COUNTDOWN)

    setTimeout(async () => {
      game = await Game.findById(game?._id).exec() as IGame

      expect(game.turns[0].showCountdown).toBeFalsy()
      expect(game.turns[0].startTime).not.toBeNull()
      expect(game.turns[0].round).toEqual(3) // Final round.

      done()
    }, 3500)
  })

  test('prompting round 3', async done => {
    game = await Game.findById(game?._id).exec() as IGame
    prompter = await User.findById(game.turns[0].userId).exec() as IUser

    // Solve all 7 of the 8 phrases. Holy cow!
    await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[0],
        timeRemaining: 55,
      })
      .expect(200)
    await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[1],
        timeRemaining: 50,
      })
      .expect(200)
    await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[2],
        timeRemaining: 45,
      })
      .expect(200)
    await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[3],
        timeRemaining: 40,
      })
      .expect(200)
    await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[4],
        timeRemaining: 35,
      })
      .expect(200)
    await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[5],
        timeRemaining: 30,
      })
      .expect(200)
    await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[6],
        timeRemaining: 25,
      })
      .expect(200)
    // Prompter runs out of time.
    let res = await request.put(`/api/v1/games/${game._id}/fail-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({ phraseId: game.unsolvedPhraseIds[7] })
      .expect(200)

    game = res.body.game as IGame

    // On review screen. Submits without changes.
    res = await request.post(`/api/v1/games/${game._id}/submit-played-phrases`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({ playedPhrases: game.turns[0].playedPhrases })
      .expect(200)
    expect(res.text).toEqual(NextActions.SAME_ROUND_NEXT_PLAYER)

    done()
  })

  test('beginning turn 2 in round 3', async done => {
    game = await Game.findById(game?._id).exec() as IGame
    prompter = await User.findById(game.turns[0].userId).exec() as IUser

    // Now we should have cycled back around to the first prompter again.
    expect(prompter.id.toString()).toEqual(prompterOrder[0])

    const res = await request.put(`/api/v1/games/${game._id}/next-action`)
      .set('Cookie', cookies[prompter.name])
      .expect(200)
    expect(res.text).toEqual(NextActions.STARTING_COUNTDOWN)

    setTimeout(async () => {
      game = await Game.findById(game?._id).exec()

      expect(game?.turns[0].showCountdown).toBeFalsy()
      expect(game?.turns[0].startTime).not.toBeNull()
      expect(game?.turns[0].round).toEqual(3)

      done()
    }, 3500)
  })

  test('prompting turn 2 in round 3', async done => {
    game = await Game.findById(game?._id).exec() as IGame
    prompter = await User.findById(game.turns[0].userId).exec() as IUser

    const res = await request.put(`/api/v1/games/${game._id}/solve-phrase`)
      .set('Cookie', cookies[prompter?.name ?? ''])
      .send({
        phraseId: game.unsolvedPhraseIds[0],
        timeRemaining: 55,
      })
      .expect(200)

    // That's it, the last phrase has been solved!
    expect(res.text).toEqual(NextActions.GAME_OVER)
    done()
  })
})
