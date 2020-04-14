import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import LogoHeader from './LogoHeader'
import { AppState } from '../store'

const Container = styled('div')`
  text-align: center;
  p {
    font-weight: bold;
  }
`

const CreatorLanding = () => {
  const { gameId } = useParams<{ gameId: string }>()
  const game = useSelector((state: AppState) => state.game)

  if (gameId && !game) {
    // We should gave a game ID from the URL. If the store doesn't have a game,
    // go ahead and fetch it.

  }

  return (
    <Container>
      <LogoHeader />
      <p>You are the salad tosser! With great power comes great responsibility.</p>
      <p>Tell your friends join game:</p>
      <span className="short-id">{game?.shortId}</span>
    </Container>
  )
}

export default CreatorLanding
