import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PlayedPhrase } from '../../../store/game/types'
import { AppState } from '../../../store'

const Container = styled('li')`
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 -2rem;
  padding: 0.5rem 1rem 0.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.lightGray};
  .text {
    margin-right: auto;
    &.failed {
      opacity: 0.25;
      text-decoration: line-through;
    }
  }
  .controls {
    display: flex;
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 0.5em;
      width: 3em;
      height: 3em;
      border-radius: 100%;
      font-weight: bold;
      color: ${props => props.theme.middleGray};
      background: ${props => props.theme.lightGray};
      &.solved.active {
        color: ${props => props.theme.darkGreen};
        background: ${props => props.theme.lightGreen};
      }
      &.failed.active {
        color: ${props => props.theme.red};
        background: ${props => props.theme.lightRed};
      }
    }
  }
`

interface Props {
  playedPhrase: PlayedPhrase;
  onToggle: (phraseTimestamp: number, status: boolean) => void;
}

const PlayedPhraseRow = ({
  playedPhrase,
  onToggle,
}: Props) => {
  const game = useSelector((state: AppState) => state.game)
  const phrase = game?.phrases.find(p => p._id === playedPhrase.phraseId)

  if (!game || !phrase) return <div />

  function handleSolve() {
    if (phrase) {
      onToggle(playedPhrase.timestamp, true)
    }
  }

  function handleFail() {
    if (phrase) {
      onToggle(playedPhrase.timestamp, false)
    }
  }

  return (
    <Container>
      <h4 className={`text ${!playedPhrase.solved ? 'failed' : ''}`}>{phrase.text}</h4>
      <div className="controls">
        {playedPhrase.solved && (
          <>
            <button type="button" className="solved active" onClick={handleSolve}>
              +1
            </button>
            <button type="button" className="failed" onClick={handleFail}>
              <FontAwesomeIcon icon={['fas', 'ban']} />
            </button>
          </>
        )}
        {!playedPhrase.solved && (
          <>
            <button type="button" className="solved" onClick={handleSolve}>
              +0
            </button>
            <button type="button" className="failed active" onClick={handleFail}>
              <FontAwesomeIcon icon={['fas', 'ban']} />
            </button>
          </>
        )}
      </div>
    </Container>
  )
}

export default PlayedPhraseRow
