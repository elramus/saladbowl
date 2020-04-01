import React from 'react'
import styled from 'styled-components/macro'
import Scoreboard from './arena/Scoreboard'

const Container = styled('div')`
  text-align: center;
  h1 {
    color: white;
  }
  p {
    font-weight: 900;
  }
  .scoreboard {
    text-align: center;
    h1 {
      color: ${(props) => props.theme.black};
      font-style: normal;
    }
  }
`

const GameOver = () => (
  <Container>
    <h1 style={{ marginBottom: '2em' }}>Game over, man</h1>
    <p>The final score was</p>
    <Scoreboard />
  </Container>
)

export default GameOver
