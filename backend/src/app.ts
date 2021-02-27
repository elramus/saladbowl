import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import bodyparser from 'body-parser'
import { loggerMiddleware } from './middleware/logger.middleware'
import { authMiddleware } from './middleware/auth.middleware'
import userRoutes from './users/users.routes'
import gamesRoutes from './games/games.routes'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

/* Middleware */
app.use(helmet())
app.use(cors())
app.use(cookieParser())
app.use(authMiddleware)
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(loggerMiddleware)

/* Routes */
app.use('/api/v1', userRoutes)
app.use('/api/v1', gamesRoutes)

export { app }
