import React, { useState } from 'react'
import styled from 'styled-components/macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import LogoHeader from './LogoHeader'
import TextInput from './TextInput'
import animateEntrance from '../lib/animateEntrance'
import TextButton from './TextButton'
import { AppState } from '../store'
import { createTeams } from '../store/game/actions'

const Container = styled('div')`
  max-width: 40em;
  margin: auto;
  padding: 0 1em;
  .step-container {
    ${animateEntrance('fadeSlideUp', 100)}
  }
  p {
    font-weight: bold;
  }
  .team-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 2em 0;
    .text-input {
      flex-grow: 1;
    }
    .fa-check-circle {
      color: ${(props) => props.theme.green};
      margin-left: 1em;
      ${animateEntrance('slideLeft', 100)}
    }
  }
  .game-id {
    text-align: center;
    font-size: ${(props) => props.theme.ms(4)};
    color: ${(props) => props.theme.darkGreen};
    letter-spacing: 5px;
  }
`

const TosserSetup = () => {
  const [team1, setTeam1] = useState('')
  const [team2, setTeam2] = useState('')
  const [step, setStep] = useState(1)
  const game = useSelector((state: AppState) => state.game)
  const history = useHistory()
  const dispatch = useDispatch()

  function handleFinish() {
    if (game) {
      dispatch(createTeams(game._id, [team1, team2]))
      history.push(`/games/${game._id}/lobby`)
    }
  }

  if (!game) return <div />

  return (
    <Container>
      <LogoHeader />
      {step === 1 && (
        <div className="step-container">
          <p>You are the tosser! With great power comes great responsibility</p>
          <p>What are the teams called?</p>
          <div className="team-row">
            <TextInput
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              placeholder="Team Dumb..."
              focusOnMount
            />
            {team1.length > 2 && (
              <FontAwesomeIcon icon={['fas', 'check-circle']} />
            )}
          </div>
          <div className="team-row">
            <TextInput
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              placeholder="Team Smart..."
              onReturn={() => setStep(2)}
            />
            {team2.length > 2 && (
              <FontAwesomeIcon icon={['fas', 'check-circle']} />
            )}
          </div>
          <TextButton
            text="Next"
            trailingIcon={['fas', 'long-arrow-right']}
            onClick={() => setStep(2)}
            variant="big"
            disabled={team1.length < 3 || team2.length < 3}
          />
        </div>
      )}
      {step === 2 && (
        <div className="step-container">
          <p>Looks good. Now just tell your friends to join game {game.shortId}.</p>
          <div className="game-id">
            <span>{game.shortId}</span>
          </div>
          <div style={{ margin: '3em' }} />
          <TextButton
            text="I'm Ready To Rock"
            trailingIcon={['fas', 'fist-raised']}
            onClick={handleFinish}
            variant="big"
          />
        </div>
      )}
    </Container>
  )
}

export default TosserSetup
