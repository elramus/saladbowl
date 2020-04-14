import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Modal from '../Modal'
import { fetchGame } from '../../store/game/actions'
import { Game } from '../../store/game/types'
import animateEntrance from '../../lib/animateEntrance'

const Container = styled('div')`
  text-align: center;
  padding-bottom: 3em;
  p {
    font-weight: 900;
    margin-bottom: 3em;
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 7em;
    .icon-container {
      ${animateEntrance('slideRight', 200)};
    }
    .svg-inline--fa {
      font-size: ${props => props.theme.ms(2)};
      color: ${props => props.theme.middleGray};
      &.fa-check-circle {
        color: ${props => props.theme.darkGreen};
      }
    }
  }
  input {
    font-size: ${props => props.theme.ms(4)};
    width:14.5rem;
    letter-spacing: 0.75rem;
    border: 0;
    border-radius: 10px;
    padding: 1rem 2rem;
    box-shadow: 0 2px 23px ${props => props.theme.lightGreen};
    color: ${props => props.theme.darkGreen};
    &::placeholder {
      color: ${props => props.theme.middleGray};
    }
    &:disabled {
      opacity: 0.5;
    }
  }
`

interface Props {
  onClose: () => void;
}

const JoinGameModal = ({
  onClose,
}: Props) => {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [foundGame, setFoundGame] = useState(false)
  const [badAttempt, setBadAttempt] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  })

  function attemptFind(inputCode: string) {
    setIsLoading(true)
    dispatch(fetchGame(inputCode, (game: Game | null) => {
      setIsLoading(false)
      if (game) {
        setFoundGame(true)
        setTimeout(() => {
          history.push(`/games/${game._id}/lobby`)
        }, 500) // Wait for a second to show a nice, green check mark.
      } else {
        setBadAttempt(inputCode)
        setCode('')
      }
    }))
  }

  function handleChangeCode(inputCode: string) {
    if (inputCode.length <= 4) {
      setCode(inputCode)
    }
    if (inputCode.length === 4) {
      attemptFind(inputCode)
    }
  }

  return (
    <Modal onClose={onClose}>
      <Container>
        <div className="top">
          {!isLoading && !badAttempt && !foundGame && (
            <p>Ask the salad tosser for the game's four digit code:</p>
          )}
          {badAttempt && !foundGame && !isLoading && (
            <p>Nothing found with "{badAttempt}". Try again:</p>
          )}
          <div className="icon-container">
            {foundGame && (
              <FontAwesomeIcon icon={['fas', 'check-circle']} />
            )}
            {isLoading && (
              <FontAwesomeIcon icon={['fas', 'spinner-third']} spin />
            )}
          </div>
        </div>
        <input
          ref={ref}
          pattern="[0-9]*"
          type="number"
          placeholder="0000"
          value={code}
          onChange={e => handleChangeCode(e.target.value)}
          disabled={isLoading}
        />
      </Container>
    </Modal>
  )
}

export default JoinGameModal
