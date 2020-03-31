import React from 'react'
import socketIOClient from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import useMountEffect from '../hooks/useMountEffect'
import { AppState } from '../store'
import { SocketMessages } from '../lib/socketTypes'
import { Game } from '../store/game/types'
import { receiveGame } from '../store/game/actions'
import { receiveUsers } from '../store/users/actions'
import { UsersState } from '../store/users/types'

const GameSocket: React.FC = ({
  children,
}) => {
  const { gameId } = useParams<{ gameId: string }>()
  const authedUser = useSelector((state: AppState) => state.authedUser)
  const dispatch = useDispatch()

  useMountEffect(() => {
    if (gameId && authedUser) {
      // Open a connection to the websocket and tell it what user is in which game.
      const socket = socketIOClient({
        query: {
          gameId,
          userId: authedUser._id,
        },
      })

      // Listen for players updates.
      socket.on(SocketMessages.PlayersUpdate, (data: UsersState) => {
        console.log('Websocket players update received:', data) /* eslint-disable-line */
        dispatch(receiveUsers(data))
      })

      // Listen for game updates.
      socket.on(SocketMessages.GameUpdate, (data: Game) => {
        console.log('Websocket game update received:', data) /* eslint-disable-line */
        dispatch(receiveGame(data))
      })
    }
  })

  return <>{children}</>
}

export default GameSocket
