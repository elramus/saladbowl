import React from 'react'
import styled from 'styled-components/macro'
import { hot } from 'react-hot-loader'
import MainContentRouter from './MainContentRouter'
import Login from './Login'

const Container = styled('div')`
`

const App = () => {
  return (
    <Container>
      <Login>
        <MainContentRouter />
      </Login>
    </Container>
  )
}

export default hot(module)(App)
