import React from 'react'
import { Route } from 'react-router-dom'
import SelectGame from './SelectGame'
import GameWrapper from './GameWrapper'

const MainContentRouter = () => {
  return (
    <div>
      <Route exact path="/">
        <SelectGame />
      </Route>
      <Route exact path="/games">
        <SelectGame />
      </Route>
      <Route path="/games/:gameId">
        <GameWrapper />
      </Route>
    </div>
  )
}

export default MainContentRouter
