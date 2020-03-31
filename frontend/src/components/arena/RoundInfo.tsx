import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { AppState } from '../../store'

const Container = styled('div')`
  padding-top: 1em;
  border-bottom: 1px solid ${(props) => props.theme.middleGreen};
  margin-bottom: 1em;
  text-align: center;
  font-style: italic;
  p {
    margin: 1em auto 2em auto;
    max-width: 15em;
    color: white;
  }
`

const RoundInfo = () => {
  const game = useSelector((state: AppState) => state.game)

  if (!game) return <div />

  return (
    <Container>
      <h1>Round {game.turns[0].round}</h1>
      {game.turns[0].round === 1 && (
        <p>Use any words OTHER than what's on the phrase to prompt your teammates.</p>
      )}
      {game.turns[0].round === 2 && (
        <p>MIME and use SOUND EFFECTS to prompt your teammates. No words!</p>
      )}
      {game.turns[0].round === 3 && (
        <p>You get ONE WORD to prompt your teammates. Choose wisely.</p>
      )}
    </Container>
  )
}

export default RoundInfo
