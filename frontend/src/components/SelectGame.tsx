import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components/macro'
import { useHistory } from 'react-router-dom'
import { AppState } from '../store'
import TextButton from './TextButton'
import { HelperText } from './styled/HelperText'
import { createGame } from '../store/game/actions'
import { Game } from '../store/game/types'
import LogoHeader from './LogoHeader'
import JoinGameModal from './JoinGameModal'

const Container = styled('div')`
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

const SelectGame = () => {
  const authedUser = useSelector((state: AppState) => state.authedUser)
  const [isJoining, setIsJoining] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  function handleJoin() {
    setIsJoining(true)
  }

  function handleCreate() {
    if (authedUser?._id) {
      dispatch(createGame(authedUser._id, (newGame: Game) => {
        // This pushes you to the page area, and to the setup page.
        history.push(`/games/${newGame._id}/setup`)
      }))
    }
  }

  return (
    <Container>
      <LogoHeader />
      {authedUser && (
        <div className="welcome">
          <HelperText>Nice hat, {authedUser.name}.</HelperText>
        </div>
      )}
      <div className="controls">
        <TextButton
          text="Join Game"
          onClick={handleJoin}
          variant="big"
        />
        <TextButton
          text="Create Game"
          onClick={handleCreate}
          variant="big"
        />
      </div>
      {isJoining && (
        <JoinGameModal onClose={() => setIsJoining(false)} />
      )}
    </Container>
  )
}

export default SelectGame
