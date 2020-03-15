import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyparser from 'body-parser'
import { requestLoggerMiddleware } from './request.logger.middleware'

const app = express()

app.use(cors())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(requestLoggerMiddleware)

app.get('/todo', (req: Request, res: Response) => {
  res.json([{ id: 1, description: 'Buy bread' }])
})

app.post('/todo', (req: Request, res: Response) => {
  console.log(req.body)
  res.end()
})

app.put('/todo/:id', (req: Request, res: Response) => {
  console.log(req.body)
  console.log(req.params.id)
  res.end()
})

app.delete('/todo/:id', (req: Request, res: Response) => {
  console.log(req.params.id)
  res.end()
})

export { app }