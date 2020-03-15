import http from 'http'
import { app } from './app'
import { MongoHelper } from './mongo.helper'

require('dotenv').config()

const PORT = 8080
const server = http.createServer(app)
server.listen(PORT)
server.on('listening', async () => {
  console.log(`Listening on port ${PORT}`)
  const url = process.env.DB_URL
  console.log(url)
  if(url) {
    try {
      await MongoHelper.connect(url)
    } catch(err) {
      console.error(err)
    }
  } else {
    console.error('DB URL not found in env')
  }
})
