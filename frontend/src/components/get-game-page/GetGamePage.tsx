import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { AppState } from '../../store/index'
import useScrollToTop from '../../hooks/useScrollToTop'
import LogoHeader from '../LogoHeader'
import TextButton from '../TextButton'
import CreateGameModal from './CreateGameModal'
import JoinGameModal from './JoinGameModal'
import { HelperText } from '../styled/HelperText'

const Container = styled('div')`
  padding: 0 1em;
  .welcome {
    text-align: center;
    margin-bottom: 3em;
  }
  .controls {
    display: grid;
    grid-template-rows: auto auto;
    grid-gap: 2em;
    max-width: 20em;
    margin: auto;
  }
`

const GetGamePage = () => {
  const user = useSelector((state: AppState) => state.user)

  const [isJoining, setIsJoining] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  useScrollToTop()

  if (!user) return <div />

  return (
    <Container>
      <LogoHeader />
      <div className="welcome">
        <HelperText>Nice hat, {user.name}.</HelperText>
      </div>
      <div className="controls">
        <TextButton
          text="Join Game"
          onClick={() => setIsJoining(true)}
          variant="big"
        />
        <TextButton
          text="Create Game"
          onClick={() => setIsCreating(true)}
          variant="big"
        />
      </div>
      {isJoining && (
        <JoinGameModal onClose={() => setIsJoining(false)} />
      )}
      {isCreating && (
        <CreateGameModal onClose={() => setIsCreating(false)} />
      )}
    </Container>
  )
}

export default GetGamePage
