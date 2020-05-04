import React, { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Modal from '../Modal'
import TextButton from '../TextButton'
import TeamNamesForm from './TeamNamesForm'
import { enterOrSpace } from '../../utils/enterOrSpace'
import { createGame } from '../../store/game/actions'
import { Game } from '../../store/game/types'

const Container = styled('div')`
  .auto-teams-checkbox {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 0.75em;
    cursor: pointer;
    border-radius: 3px;
    svg {
      margin-top: 0.15em;
      color: ${props => props.theme.darkGreen};
    }
    p {
      margin-bottom: 0;
    }
    &:focus {
      outline: 1px solid ${props => props.theme.lightGreen};
    }
  }
  .text-button {
    margin-top: 4em;
  }
`

interface Props {
  onClose: () => void;
}

const CreateGameModal = ({
  onClose,
}: Props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [autoTeams, setAutoTeams] = useState(true)
  const [teamNames, setTeamNames] = useState<(string | null)[]>([null, null])
  const [loading, setLoading] = useState(false)

  const formValid = useMemo(() => {
    return autoTeams || teamNames.every(name => name && name.length >= 3)
  }, [autoTeams, teamNames])

  function handleCreate() {
    setLoading(true)
    if (formValid) {
      // We know the teams are good to go from formValid.
      dispatch(createGame(teamNames as [string, string], (newGame: Game) => {
        // Head on over to the new game.
        history.push(`/games/${newGame._id}/lobby`)
      }))
    }
  }

  return (
    <Modal onClose={onClose}>
      <Container>
        <h5>Game Options</h5>
        <div
          className="auto-teams-checkbox"
          onClick={() => setAutoTeams(!autoTeams)}
          onKeyDown={e => enterOrSpace(e, () => setAutoTeams(!autoTeams))}
          role="button"
          aria-pressed={autoTeams}
          tabIndex={0}
        >
          {autoTeams && <FontAwesomeIcon icon={['fas', 'check-square']} />}
          {!autoTeams && <FontAwesomeIcon icon={['far', 'square']} />}
          <p>Randomly divide players into teams automatically (recommended)</p>
        </div>
        {!autoTeams && (
          <TeamNamesForm setTeamNames={setTeamNames} />
        )}
        <TextButton
          text="Make It So"
          trailingIcon={['fas', 'hand-spock']}
          variant="big"
          onClick={handleCreate}
          showLoading={loading}
          disabled={!formValid}
        />
      </Container>
    </Modal>
  )
}

export default CreateGameModal
