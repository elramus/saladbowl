import socketIo from 'socket.io'
import { Server } from 'http'
import { User, IUser } from './models/user'
import { Game } from './models/game'

export enum SocketMessages {
  PlayersUpdate = 'players-update',
  GameUpdate = 'game-update',
}

function initSocket(server: Server) {
  const io = socketIo(server)

  const playersIndex: {
    [gameId: string]: {
      user: IUser,
      socketId: string | null,
    }[]
  } = {}

  io.on('connection', async (socket) => {
    const { gameId, userId } = socket.handshake.query
    // Do two things:
    // 1. Put the player in the game room.
    // 2. Update the player in our players index.
    // 3. Push out the players index.

    if (gameId && userId) {
      // Add this person to their game's room.
      socket.join(gameId)

      // Now update the game w/ their socket id and broadcast the update.
      try {
        const user = await User.findById(userId)
        if (!user) throw new Error(`No user with ID ${userId}`)

        // If this is the first person in the game, instantiate the game as a property.
        if (!playersIndex[gameId]) playersIndex[gameId] = []

        // The player might already be on there, so clear them out first.
        const updatedPlayers = playersIndex[gameId].filter((p) => p.user._id.toString() !== userId)

        // Update the index.
        updatedPlayers.push({
          user,
          socketId: socket.id,
        })
        playersIndex[gameId] = updatedPlayers

        // Now broadcast an update of the players in the game.
        io.to(gameId).emit(SocketMessages.PlayersUpdate, playersIndex[gameId])
      } catch (e) {
        throw new Error(e)
      }
    }

    socket.on('disconnect', async () => {
      // Remove that person from the players index and broadcast an update.

      const updatedPlayers = playersIndex[gameId].filter((p) => p.user._id.toString() !== userId)
      playersIndex[gameId] = updatedPlayers

      // Now broadcast an update of the players in the game.
      io.to(gameId).emit(SocketMessages.PlayersUpdate, playersIndex[gameId])
    })
  })

  return io
}

export { initSocket }
