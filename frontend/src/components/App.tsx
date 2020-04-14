import React from 'react'
import { hot } from 'react-hot-loader'
import MainContentRouter from './MainContentRouter'
import Login from './Login'

const App = () => {
  return (
    <div>
      <Login>
        <MainContentRouter />
      </Login>
    </div>
  )
}

export default hot(module)(App)
