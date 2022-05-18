import { Server } from 'http'
import socketIo from 'socket.io'

import {
  IUser,
  User,
} from './users/users.model'

export enum SocketMessages {
  PlayersUpdate = 'players-update',
  GameUpdate = 'game-update',
}

function initSocket(server: Server) {
  const io = socketIo(server)

  // Keep track of who's who here.
  // Not currently used, but maybe it'll be useful one day.
  const playersIndex: {
    [gameId: string]: {
      user: IUser
      socketId: string | null
    }[]
  } = {}

  io.on('connection', async socket => {
    const { gameId, userId } = socket.handshake.query

    if (gameId && userId) {
      // Add this person to their game's room.
      socket.join(gameId)

      // Now update the game w/ their socket id and broadcast the update.
      const user = await User.findById(userId)
      if (!user) throw new Error('User not found')

      // If this is the first person in the game, instantiate the game as a property.
      if (!playersIndex[gameId]) playersIndex[gameId] = []

      // The player might already be on there, so clear them out first so we don't duplicate.
      const updatedPlayers = playersIndex[gameId].filter(
        p => p.user._id.toString() !== userId,
      )

      // Update the index.
      updatedPlayers.push({
        user,
        socketId: socket.id,
      })
      playersIndex[gameId] = updatedPlayers

      // Now broadcast an update of the players in the game.
      console.log('Player has joined: ', user.name) /*eslint-disable-line*/
      // io.to(gameId).emit(SocketMessages.PlayersUpdate, playersIndex[gameId])
    }

    socket.on('disconnect', async () => {
      // Remove that person from the players index and broadcast an update.

      const updatedPlayers = playersIndex[gameId].filter(
        p => p.user._id.toString() !== userId,
      )
      playersIndex[gameId] = updatedPlayers

      const user = await User.findById(userId)
      if (!user) throw new Error('User not found')

      // Now broadcast an update of the players in the game.
      console.log('Player has left: ', user.name) /*eslint-disable-line*/

      // io.to(gameId).emit(SocketMessages.PlayersUpdate, playersIndex[gameId])
    })
  })

  return io
}

export { initSocket }
