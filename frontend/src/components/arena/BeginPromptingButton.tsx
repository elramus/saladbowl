import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import BigArrow from './BigArrow'
import { nextAction } from '../../store/game/actions'
import { AppState } from '../../store'

const Container = styled('div')`
  text-align: center;
  max-width: 20em;
  margin: 2rem auto;
  p {
    color: white;
    font-weight: bold;
    font-style: italic;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    margin-bottom: 2rem;
  }
  button {
    color: white;
  }
`

const BeginPromptingButton = () => {
  const dispatch = useDispatch()
  const game = useSelector((state: AppState) => state.game)
  const user = useSelector((state: AppState) => state.user)

  function handleStart() {
    if (game && user) {
      dispatch(nextAction({
        gameId: game._id,
        userId: user._id,
      }))
    }
  }

  return (
    <Container>
      <p>Hit the arrow or press SPACE when you're ready to begin.</p>
      <BigArrow onClick={handleStart} />
    </Container>
  )
}

export default BeginPromptingButton
