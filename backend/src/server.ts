import http from 'http'
import { app } from './app'
import { dbConnect } from './dbConnect'
import { initSocket } from './socket'

/* Server */
export const server = http.createServer(app)
const PORT = 7777
server.listen(PORT)
server.on('listening', async () => {
  console.log(`Listening on port ${PORT}`) /* eslint-disable-line */
  dbConnect()
})

/* Turn on the socket! */
export const io = initSocket(server)
