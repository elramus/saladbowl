import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactGA from 'react-ga'
// import { hot } from 'react-hot-loader'
import MainContentRouter from './MainContentRouter'
import Login from './Login'
import useGaPageview from '../hooks/useGaPageview'
import { fetchGame } from '../store/game/actions'
import { AppState } from '../store'

const App: React.FC = () => {
  const dispatch = useDispatch()
  const game = useSelector((state: AppState) => state.game)

  useEffect(() => {
    ReactGA.initialize('UA-49704731-8')
  }, [])

  useGaPageview()

  const onFocus = useCallback(() => {
    // Whenever the browser comes back into focus, fetch the latest copy of the game.
    if (game?._id) {
      dispatch(fetchGame(game._id))
    }
  }, [dispatch, game])

  useEffect(() => {
    window.addEventListener('focus', onFocus)

    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [onFocus])

  return (
    <div>
      <Login>
        <MainContentRouter />
      </Login>
    </div>
  )
}

// export default hot(module)(App)
export default App
