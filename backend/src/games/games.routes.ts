import express from 'express'
import gameController from './games.controller'

const routes = express.Router()

routes.post('/games', gameController.createGame)
routes.get('/games/:gameId', gameController.fetchGame)
routes.put('/games/:gameId/player-ready-status', gameController.playerReadyStatus)
routes.get('/games/:gameId/pre-roll-finished', gameController.preRollFinished)
routes.post('/games/:gameId/phrases', gameController.createPhrase)
routes.delete('/games/:gameId/phrases/:phraseId', gameController.deletePhrase)
routes.put('/games/:gameId/create-teams', gameController.createTeams)
routes.put('/games/:gameId/join-team', gameController.joinTeam)
routes.put('/games/:gameId/solve-phrase', gameController.solvePhrase)
routes.put('/games/:gameId/fail-phrase', gameController.failPhrase)
routes.put('/games/:gameId/undo-phrase', gameController.undoPhrase)
routes.post('/games/:gameId/submit-played-phrases', gameController.submitTurnResults)
routes.put('/games/:gameId/skip-phrase', gameController.failPhrase)
routes.put('/games/:gameId/next-action', gameController.nextAction)

export default routes
