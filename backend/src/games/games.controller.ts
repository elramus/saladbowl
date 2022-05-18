import {
  Request,
  Response,
} from 'express'

import { applyTurnResults } from '../lib/applyTurnResults'
import { changeReadyStatus } from '../lib/changeReadyStatus'
import { NextActions } from '../lib/constants'
import { createGame } from '../lib/createGame'
import { createGamePhrase } from '../lib/createGamePhrase'
import deletePhrase from '../lib/deletePhrase'
import { failPhrase } from '../lib/failPhrase'
import { findGame } from '../lib/findGame'
import { gameReadyChecklist } from '../lib/gameReadyChecklist'
import { joinPlayerToGame } from '../lib/joinPlayerToGame'
import joinTeam from '../lib/joinTeam'
import { solvePhrase } from '../lib/solvePhrase'
import { TurnRunner } from '../lib/TurnRunner'
import { undoSolvePhrase } from '../lib/undoSolvePhrase'
import { voteToSkip } from '../lib/voteToSkip'
import { io } from '../server'
import { SocketMessages } from '../socket'
import { User } from '../users/users.model'
import { getErrorMessage } from '../utils/get-error-message'
import { randomNum } from '../utils/randomNum'
import {
  Game,
  IGame,
} from './games.model'

const gameController = {
  async createGame(req: Request, res: Response) {
    const { userId } = req
    if (!userId) return res.status(400).send('User ID not found in request')
    const { teams } = req.body

    try {
      // Teams may be undefined, but that's okay.
      const newGame = await createGame(userId, teams)

      // Before we return, attach the creator as a game player.
      const updatedGame = await joinPlayerToGame(userId, newGame)

      // Broadcast the update
      io.to(updatedGame.id).emit(SocketMessages.GameUpdate, updatedGame)

      return res.send({ game: updatedGame })
    } catch (e) {
      return res.status(500).send(e)
    }
  },

  async fetchGame(req: Request, res: Response) {
    const { gameId } = req.params
    if (!gameId) return res.status(400).send('Required param not found')

    try {
      const game = await findGame(gameId)
      if (!game) return res.send({ game: null })

      return res.send({ game })
    } catch (e) {
      return res.status(500).send(e)
    }
  },

  async fetchAndJoinGame(req: Request, res: Response) {
    const { gameId } = req.params
    const { userId } = req
    if (!gameId) return res.status(400).send('Required param not found')

    try {
      const game = await findGame(gameId)

      if (!game) return res.send({ game: null })

      // If we have a userId, we'll go ahead and join them to it.
      if (userId) {
        // Join them to the game.
        const updatedGame = await joinPlayerToGame(userId, game)

        // If the game has already started, then join them to a team.
        if (game.startTime !== null) {
          // What team should they be joined to?
          let gameWithNewPlayer: IGame | null = null
          // If one team has fewer players than the other, use that.
          // (If we start supporting more than two teams, this will need to be smarter).
          if (game.teams[0].userIds.length < game.teams[1].userIds.length) {
            gameWithNewPlayer = await joinTeam(
              game,
              game.teams[0]._id.toString(),
              userId,
            )
          } else if (
            game.teams[1].userIds.length < game.teams[0].userIds.length
          ) {
            gameWithNewPlayer = await joinTeam(
              game,
              game.teams[1]._id.toString(),
              userId,
            )
          } else {
            // Neither team has fewer players, pick a random one.
            const teamIndex = randomNum(0, game.teams.length - 1)
            gameWithNewPlayer = await joinTeam(
              game,
              game.teams[teamIndex]._id.toString(),
              userId,
            )
          }

          // Broadcast the update with the new player on the team.
          io.to(gameWithNewPlayer.id).emit(
            SocketMessages.GameUpdate,
            gameWithNewPlayer,
          )
          return res.send({ game: gameWithNewPlayer })
        }

        // Broadcast the update with just the new player.
        io.to(updatedGame.id).emit(SocketMessages.GameUpdate, updatedGame)
        return res.send({ game: updatedGame })
      }

      // If for some reason there's no userId, just send back the game we found.
      return res.send({ game })
    } catch (e) {
      return res.status(500).send(e)
    }
  },

  /**
   * This is our entry point into starting the actual game.
   */
  async playerReadyStatus(req: Request, res: Response) {
    const { userId } = req
    const { readyStatus } = req.body
    const { gameId } = req.params
    if (!userId || !gameId || readyStatus === undefined || readyStatus === null)
      return res.status(400).send('Required param not found in request')

    try {
      const game = await findGame(gameId)
      if (!game) return res.status(400).send('Invalid Game ID')

      const updatedGame = await changeReadyStatus({
        userId,
        game,
        status: readyStatus,
      })

      // Run the checklist for starting the game.
      const shouldStartTheGame = gameReadyChecklist(game)

      if (shouldStartTheGame) {
        // Fire up a Turn Runner.
        // (It requires a user to be passed in)
        const user = await User.findById(userId)

        if (!user) return res.status(400).send('Invalid user ID')

        const tR = new TurnRunner({ game, user })
        const action = await tR.nextAction()
        return res.send(action)
      }

      // Broadcast and return the update.
      io.to(updatedGame._id).emit(SocketMessages.GameUpdate, updatedGame)
      return res.send({ game: updatedGame })
    } catch (e) {
      return res.status(500).send(getErrorMessage(e))
    }
  },

  async preRollFinished(req: Request, res: Response) {
    const { gameId } = req.params
    const { userId } = req
    if (!gameId || !userId) return res.status(400).send()

    const game = await Game.findById(gameId)
    if (!game) return res.status(400).send('Game not found')
    const user = await User.findById(userId)
    if (!user) return res.status(400).send('User not found')

    try {
      // Turn off the pre-roll, then run Turn Runner next action.
      game.preRoll.show = false
      await game.save()

      const tR = new TurnRunner({ game, user })
      const action = await tR.nextAction()
      return res.send(action)
    } catch (e) {
      return res.status(500).send(getErrorMessage(e))
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
    if (!gameId || !teamId || !userId)
      return res.status(400).send('Missing required request params')

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
      if (!game) throw new Error('No game found with ID')

      const updatedGame = await solvePhrase(game, phraseId)

      // We need to see if this player just used up all the phrases.
      // If they did, fire up the ol' Turn Runner and run next.
      if (game.unsolvedPhraseIds.length === 0) {
        // Apply the turn's array of played phrases.
        await applyTurnResults({ game: updatedGame })

        const user = await User.findById(userId)
        if (!user) return res.status(400).send('Bad user ID')

        const tR = new TurnRunner({
          game,
          user,
          config: {
            timeRemaining,
          },
        })
        const action = await tR.nextAction()
        return res.send(action)
      }

      // But if there are more phrases, just broadcast and return the update.
      io.to(game._id).emit(SocketMessages.GameUpdate, updatedGame)
      return res.send({ game: updatedGame })
    } catch (e) {
      return res.status(500).send(getErrorMessage(e))
    }
  },

  async failPhrase(req: Request, res: Response) {
    const { gameId } = req.params
    const { phraseId } = req.body
    if (!gameId || !phraseId)
      return res.status(400).send('Missing required params')

    const game = await Game.findById(gameId)
    if (!game) return res.status(400).send('Invalid game ID')

    try {
      const updatedGame = await failPhrase({ game, phraseId })

      io.to(game._id).emit(SocketMessages.GameUpdate, updatedGame)
      return res.send({ game: updatedGame })
    } catch (e) {
      return res.status(500).send(getErrorMessage(e))
    }
  },

  async undoPhrase(req: Request, res: Response) {
    const { gameId } = req.params
    const { phraseId } = req.body
    const { userId } = req
    if (!gameId || !phraseId || !userId)
      return res.status(400).send('Missing required params')

    const game = await Game.findById(gameId)
    if (!game) return res.status(400).send('Invalid game ID')

    try {
      const updatedGame = await undoSolvePhrase({ game, phraseId })

      io.to(game._id).emit(SocketMessages.GameUpdate, updatedGame)
      return res.send({ game: updatedGame })
    } catch (e) {
      return res.status(500).send(getErrorMessage(e))
    }
  },

  async submitTurnResults(req: Request, res: Response) {
    const { gameId } = req.params
    const { playedPhrases } = req.body
    const { userId } = req
    if (!gameId || !playedPhrases || !userId) {
      return res.status(400).send('Missing required params')
    }

    const game = await Game.findById(gameId)
    if (!game) return res.status(400).send('Invalid game ID')

    try {
      const updatedGame = await applyTurnResults({
        game,
        playedPhrases,
      })

      const user = await User.findById(userId)
      if (!user) throw new Error('invalid user ID')

      const tR = new TurnRunner({
        game: updatedGame,
        user,
      })
      const action = await tR.nextAction()
      return res.send(action)
    } catch (e) {
      return res.status(500).send(getErrorMessage(e))
    }
  },

  async voteToSkip(req: Request, res: Response) {
    const { userId } = req
    const { gameId } = req.params
    if (!userId || !gameId) {
      return res.status(400).send('Required param not present')
    }

    const game = await Game.findById(gameId)
    if (!game) return res.status(400).send('Invalid game ID')

    try {
      // Stop voting at 3, so we don't accidentally trigger multiple turn skips.
      if (game.turns[0].votesToSkip.length < 3) {
        const updatedGame = await voteToSkip({ game, userId })

        // Broadcast the update.
        io.to(game._id).emit(SocketMessages.GameUpdate, updatedGame)

        // Should we go ahead and skip?
        if (updatedGame.turns[0].votesToSkip.length === 3) {
          // We need to fire a turn runner that will trigger SAME_ROUND_NEXT_PLAYER_SAME_TEAM.
          const user = await User.findById(userId)
          if (!user) throw new Error('No user with supplied ID.')

          const tR = new TurnRunner({
            game: updatedGame,
            user,
            config: {
              nextAction: NextActions.SAME_ROUND_NEXT_PLAYER_SAME_TEAM,
            },
          })
          const action = await tR.nextAction()

          return res.send(action)
        }
      }
    } catch (e) {
      return res.status(500).send(getErrorMessage(e))
    }
  },

  async nextAction(req: Request, res: Response) {
    const { gameId } = req.params
    const { config } = req.body
    const { userId } = req
    // Making config not required
    if (!gameId || !userId)
      return res.status(500).send('Required request item not found.')

    try {
      // This function is very generic. What it does depends on where the game is currently.
      // So, we fire up a TurnRunner, give it the info, and let it take it from there.
      const game = await Game.findById(gameId)
      const user = await User.findById(userId)
      if (!game || !user)
        return res.status(400).send('Invalid game ID or user ID')

      const tR = new TurnRunner({
        game,
        user,
        config,
      })
      const action = await tR.nextAction()
      return res.send(action)
    } catch (e) {
      return res.status(500).send(getErrorMessage(e))
    }
  },
}

export default gameController
