import React from 'react'
import styled from 'styled-components'
import Scoreboard from './Scoreboard'
import UpNext from './UpNext'
import BeginPromptingButton from './BeginPromptingButton'

const Container = styled('div')`
  padding: 1rem;
`

interface Props {
  isYourTurn: boolean;
}

const BetweenTurns = ({
  isYourTurn,
}: Props) => {
  return (
    <Container>
      <Scoreboard />
      <UpNext />
      {isYourTurn && (
        <BeginPromptingButton />
      )}
    </Container>
  )
}

export default BetweenTurns
