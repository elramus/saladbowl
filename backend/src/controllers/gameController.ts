import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Game } from '../models/game'
import { io } from '../app'
import { SocketMessages } from '../socket'
import joinTeam from '../services/joinTeam'
import { createGamePhrase } from '../services/createGamePhrase'
import deletePhrase from '../services/deletePhrase'
import { playerReadyToBegin } from '../services/playerReadyToBegin'
import { joinPlayerToGame } from '../services/joinPlayerToGame'
import { GameManager } from '../gameplay/GameManager'
import { User } from '../models/user'
import { randomNum } from '../utils/randomNum'
import { solvePhrase } from '../services/solvePhrase'
import { undoSolvePhrase } from '../services/undoSolvePhrase'

const gameController = {
  async fetchGame(req: Request, res: Response) {
    const { gameId } = req.params // Can be an actual ID or a short ID!
    const { userId } = req
    let game = null

    try {
      if (mongoose.Types.ObjectId.isValid(gameId)) {
        game = await Game.findById(gameId)
      } else {
        game = await Game.findOne({ shortId: parseInt(gameId) })
      }
      if (!game) return res.send({ game: null })
      // If we found a game, go ahead and attach the user requesting to it.
      if (userId) {
        const updatedGame = await joinPlayerToGame(userId, game.shortId)
        return res.send({ game: updatedGame })
      }
      // If for some reason there's no userId, just send back the game we found.
      return res.send({ game })
    } catch (e) {
      return res.status(500).send(e)
    }
  },

  async createGame(req: Request, res: Response) {
    const { userId } = req.body
    if (!userId) return res.status(400).send('User ID not found in request')

    // TODO: make sure this new ID is unique.
    const shortId = randomNum(1000, 9999)

    const newGame = new Game({
      shortId,
      creator: userId,
    })

    try {
      await newGame.save()
      // Before we return, attach the creator as a game player.
      const updatedGame = await joinPlayerToGame(userId, newGame.shortId)

      return res.send({ game: updatedGame })
    } catch (e) {
      return res.status(500).send(e)
    }
  },

  async createPhrase(req: Request, res: Response) {
    const { gameId } = req.params
    const { userId } = req
    const { text } = req.body
    if (!gameId || !userId || text === undefined) return res.status(400).send()

    try {
      const updatedGame = await createGamePhrase(userId, gameId, text)
      return res.send(updatedGame)
    } catch (e) {
      return res.status(500).json(e)
    }
  },

  async deletePhrase(req: Request, res: Response) {
    const { gameId, phraseId } = req.params
    try {
      const updatedGame = await deletePhrase(gameId, phraseId)

      // Broadcast and return the update.
      io.to(updatedGame._id).emit(SocketMessages.GameUpdate, updatedGame)
      return res.send({ game: updatedGame })
    } catch (e) {
      return res.status(500).send(e)
    }
  },

  async createTeams(req: Request, res: Response) {
    const { gameId } = req.params
    const { teamNames } = req.body
    if (!gameId || !teamNames) return res.status(400).send()

    try {
      const game = await Game.findById(gameId)
      if (game) {
        const teams = teamNames.map((t: string) => ({
          name: t,
          players: [],
        }))
        game.teams = teams
        await game.save()

        io.to(game._id).emit(SocketMessages.GameUpdate, game)
        return res.send(game)
      }
      return res.status(404).send('Game not found')
    } catch (e) {
      return res.status(500).send(e)
    }
  },

  async joinTeam(req: Request, res: Response) {
    const { gameId } = req.params
    const { teamId } = req.body
    const { userId } = req
    if (!gameId || !teamId || !userId) return res.status(400).send('Missing required request params')

    try {
      const game = await Game.findById(gameId)
      if (game) {
        const updatedGame = await joinTeam(game, teamId, userId)

        // Broadcast and return the update.
        io.to(game._id).emit(SocketMessages.GameUpdate, updatedGame)
        return res.send({ game: updatedGame })
      }
      return res.status(404).send('Invalid game ID')
    } catch (e) {
      return res.status(500).send(e)
    }
  },

  async solvePhrase(req: Request, res: Response) {
    const { phraseId, timeRemaining } = req.body
    const { userId } = req
    const { gameId } = req.params
    if (!phraseId || !timeRemaining || !userId || !gameId) {
      return res.status(400).send('Required param not present')
    }

    try {
      const game = await Game.findById(gameId)
      if (game) {
        const updatedGame = await solvePhrase(game, phraseId, userId)

        // We need to see if this player just used up all the phrases.
        // If they did, fire up the ol' Game Manager and run next.
        if (game.unsolvedPhraseIds.length === 0) {
          const user = await User.findById(userId)
          if (!user) return res.status(400).send('Bad user ID')

          const gM = new GameManager({
            game,
            user,
            config: {
              timeRemaining,
            },
          })
          gM.next()
        }

        // Broadcast and return the update.
        io.to(game._id).emit(SocketMessages.GameUpdate, updatedGame)
        return res.send({ game: updatedGame })
      }
      return res.status(404).send('Game not found')
    } catch (e) {
      return res.status(500).send(e)
    }
  },

  async unsolvePhrase(req: Request, res: Response) {
    const { gameId } = req.params
    const { phraseId } = req.body
    const { userId } = req
    if (!gameId || !phraseId || !userId) return res.status(400).send('Missing required params')

    const game = await Game.findById(gameId)
    if (!game) return res.status(400).send('Invalid game ID')

    try {
      const updatedGame = undoSolvePhrase({ game, phraseId, userId })
      await updatedGame.save()
      io.to(game._id).emit(SocketMessages.GameUpdate, updatedGame)
      return res.send({ game: updatedGame })
    } catch (e) {
      return res.status(500).send(e.message)
    }
  },

  async next(req: Request, res: Response) {
    const { gameId } = req.params
    const { config } = req.body
    const { userId } = req
    if (!gameId || !config || !userId) return res.status(500).send('Required request item not found.')

    try {
      // This function is very generic. What it does depends on where the game is currently.
      // So, we're fire up a GameManager, give it the info, and let it take it from there.
      const game = await Game.findById(gameId)
      const user = await User.findById(userId)
      if (game && user) {
        const gM = new GameManager({
          game,
          user,
          config,
        })
        gM.next()
        return res.send()
      }
      return res.status(404).send('Could not find game or user')
    } catch (e) {
      return res.status(500).send(e)
    }
  },
}

export default gameController
