import React from 'react'
import styled from 'styled-components/macro'
import { useSelector } from 'react-redux'
import { AppState } from '../../store'

const Container = styled('div')`
  color: white;
  padding-top: 1em;
  border-top: 1px solid ${(props) => props.theme.middleGreen};
`

const WaitingOn = () => {
  const game = useSelector((state: AppState) => state.game)
  const player = game?.players.find((p) => p.user._id === game?.turns[0].userId)
  const user = player ? player.user : null

  if (!game || !user) return <div />

  return (
    <Container>
      <h4>Waiting on {user.name} to start their turn...</h4>
    </Container>
  )
}

export default WaitingOn
