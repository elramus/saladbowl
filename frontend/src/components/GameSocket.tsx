import React from 'react'
import socketIOClient from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import useMountEffect from '../hooks/useMountEffect'
import { AppState } from '../store'
import { SocketMessages } from '../lib/socketTypes'
import { Game } from '../store/game/types'
import { receiveGame } from '../store/game/actions'

const GameSocket: React.FC = ({
  children,
}) => {
  const { gameId } = useParams<{ gameId: string }>()
  const user = useSelector((state: AppState) => state.user)
  const dispatch = useDispatch()

  useMountEffect(() => {
    if (gameId && user) {
      // Open a connection to the websocket and tell it what user is in which game.
      const socket = socketIOClient({
        query: {
          gameId,
          userId: user._id,
        },
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
