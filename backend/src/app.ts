import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import bodyparser from 'body-parser'
import http from 'http'
import { loggerMiddleware } from './middleware/logger.middleware'
import { authMiddleware } from './middleware/auth.middleware'
import userRoutes from './routes/users'
import gamesRoutes from './routes/games'
import { dbConnect } from './dbConnect'
import { initSocket } from './socket'

require('dotenv').config()

export const app = express()

/* Middleware */
app.use(helmet())
app.use(cors())
app.use(cookieParser())
app.use(authMiddleware)
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(loggerMiddleware)

/* Server */
export const server = http.createServer(app)
const PORT = 8080
server.listen(PORT)
server.on('listening', async () => {
  console.log(`Listening on port ${PORT}`) /* eslint-disable-line */
  dbConnect()
})

/* Turn on the socket! */
export const io = initSocket(server)

/* Routes */
app.use('/api/v1', userRoutes)
app.use('/api/v1', gamesRoutes)
