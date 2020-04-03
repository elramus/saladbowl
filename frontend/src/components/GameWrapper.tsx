import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import {
  useParams, Route, useHistory,
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Lobby from './lobby'
import { fetchGame } from '../store/game/actions'
import { AppState } from '../store'
import TosserSetup from './TosserSetup'
import GameSocket from './GameSocket'
import Arena from './arena'
import PreGamePreRoll from './PreRoll'

const Container = styled('div')`
  min-height: 100vh;
`

const GameWrapper = () => {
  const { gameId } = useParams<{ gameId: string }>()
  const game = useSelector((state: AppState) => state.game)
  const [inGame, setInGame] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    // We should have the game already from the select game process, where
    // you either join or create. But we'll try again here just in case.
    dispatch(fetchGame(gameId))
  }, [dispatch, gameId])

  useEffect(() => {
    // When preroll comes back as ready, redirect us out of the lobby.
    if (!inGame && game?.preRoll.show) {
      setInGame(true)
      history.replace(`/games/${gameId}`)
    }
  }, [game, gameId, history, inGame])

  if (!game) return <p>Loading...</p>

  return (
    <GameSocket>
      <Container>
        <Route path="/games/:gameId/setup">
          <TosserSetup />
        </Route>
        <Route path="/games/:gameId/lobby">
          <Lobby />
        </Route>
        <Route exact path="/games/:gameId">
          {game.preRoll.show && game.turns.length === 0 && (
            <PreGamePreRoll />
          )}
          {game.turns[0] && game.turns[0].round > 0 && (
            <Arena />
          )}
        </Route>
      </Container>
    </GameSocket>
  )
}

export default GameWrapper
