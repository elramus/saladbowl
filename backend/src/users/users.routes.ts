import express from 'express'
import usersController from './users.controller'

const routes = express.Router()

routes.get('/login', usersController.getUser)
routes.post('/login', usersController.loginUser)

export default routes
