import React from 'react'
import { Route } from 'react-router-dom'
import GameWrapper from './GameWrapper'
import GetGamePage from './get-game-page'

const MainContentRouter = () => {
  return (
    <div>
      <Route exact path="/">
        <GetGamePage />
      </Route>
      <Route exact path="/games">
        <GetGamePage />
      </Route>
      <Route path="/games/:gameId">
        <GameWrapper />
      </Route>
    </div>
  )
}

export default MainContentRouter
