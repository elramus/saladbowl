import express from 'express'
import gameController from '../controllers/gameController'

const routes = express.Router()

routes.post('/games', gameController.createGame)
routes.get('/games/:gameId', gameController.fetchGame)
routes.post('/games/:gameId/phrases', gameController.createPhrase)
routes.delete('/games/:gameId/phrases/:phraseId', gameController.deletePhrase)
routes.put('/games/:gameId/create-teams', gameController.createTeams)
routes.put('/games/:gameId/join-team', gameController.joinTeam)
routes.put('/games/:gameId/phrase-solved', gameController.solvePhrase)
routes.put('/games/:gameId/unsolve-phrase', gameController.unsolvePhrase)
routes.put('/games/:gameId/next', gameController.next)

export default routes
