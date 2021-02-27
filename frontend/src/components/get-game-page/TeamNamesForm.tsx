import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TextInput from '../TextInput'
import animateEntrance from '../../lib/animateEntrance'

const Container = styled('div')`
  margin-top: 2em;
  ${animateEntrance('fadeSlideUp', 100)}
  .team-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1em 0;
    .text-input {
      flex-grow: 1;
    }
    .fa-check-circle {
      color: ${props => props.theme.green};
      margin-left: 1em;
      ${animateEntrance('slideLeft', 100)}
    }
  }
`

interface Props {
  setTeamNames: (names: (string | null)[]) => void
}

const TeamNamesForm = ({ setTeamNames }: Props) => {
  const [team1, setTeam1] = useState('')
  const [team2, setTeam2] = useState('')

  useEffect(() => {
    setTeamNames([team1, team2])
  }, [setTeamNames, team1, team2])

  return (
    <Container>
      <p>What are the teams called?</p>
      <div className="team-row">
        <TextInput
          value={team1}
          onChange={e => setTeam1(e.target.value)}
          placeholder="Team Dumb..."
          focusOnMount
        />
        {team1.length > 2 && <FontAwesomeIcon icon={['fas', 'check-circle']} />}
      </div>
      <div className="team-row">
        <TextInput
          value={team2}
          onChange={e => setTeam2(e.target.value)}
          placeholder="Team Smart..."
        />
        {team2.length > 2 && <FontAwesomeIcon icon={['fas', 'check-circle']} />}
      </div>
    </Container>
  )
}

export default TeamNamesForm
