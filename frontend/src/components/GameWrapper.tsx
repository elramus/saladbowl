import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams, Route, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAndJoinGame } from '../store/game/actions'
import { AppState } from '../store'
import Lobby from './lobby'
import GameSocket from './GameSocket'
import Arena from './arena'
import PreRoll from './PreRoll'

const Container = styled('div')`
  min-height: 100vh;
`

const GameWrapper: React.FC = () => {
  const dispatch = useDispatch()
  const game = useSelector((state: AppState) => state.game)
  const user = useSelector((state: AppState) => state.user)

  const history = useHistory()
  const { gameId } = useParams<{ gameId: string }>()

  const [inGame, setInGame] = useState(false)

  useEffect(() => {
    // We should have the game already from the select game process, where
    // you either join or create. But we'll try again here just in case.
    dispatch(fetchAndJoinGame(gameId))
  }, [dispatch, gameId])

  useEffect(() => {
    // When preroll comes back as ready, redirect us out of the lobby.
    if (!inGame && game?.preRoll.show) {
      setInGame(true)
      history.replace(`/games/${gameId}`)
    }
  }, [game, gameId, history, inGame])

  if (!game || !user) return <p>Loading...</p>

  // If you're not in this game, then bugger off, mang.
  if (!game.players.some(p => p.user._id === user._id)) {
    return (
      <div>
        <p>This game has already started.</p>
      </div>
    )
  }

  return (
    <GameSocket>
      <Container>
        <Route path="/games/:gameId/lobby">
          <Lobby />
        </Route>
        <Route exact path="/games/:gameId">
          {game.preRoll.show && game.turns.length === 0 && <PreRoll />}
          {game.turns[0] && game.turns[0].round > 0 && <Arena />}
        </Route>
      </Container>
    </GameSocket>
  )
}

export default GameWrapper
