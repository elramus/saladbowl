import React, { useEffect } from 'react'
import { hot } from 'react-hot-loader'
import ReactGA from 'react-ga'
import MainContentRouter from './MainContentRouter'
import Login from './Login'
import useGaPageview from '../hooks/useGaPageview'

const App = () => {
  useEffect(() => {
    ReactGA.initialize('UA-49704731-8')
  }, [])

  useGaPageview()

  return (
    <div>
      <Login>
        <MainContentRouter />
      </Login>
    </div>
  )
}

export default hot(module)(App)
