import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { AppState } from '../../store'

const Container = styled('div')`
  color: white;
  padding: 1em 0;
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
