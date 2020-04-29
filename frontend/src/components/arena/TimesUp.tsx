import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppState } from '../../store'
import { submitPlayedPhrases } from '../../store/game/actions'
import TextButton from '../TextButton'
import TurnReviewModal from './turn-review-modal'
import { PlayedPhrase } from '../../store/game/types'

const Container = styled('div')`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 3em;
  background: ${props => props.theme.green};
  color: white;
  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    svg {
      font-size: ${props => props.theme.ms(5)};
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
    }
  }
`

interface Props {
  isPrompter?: boolean;
}

const TimesUp = ({
  isPrompter = false,
}: Props) => {
  const dispatch = useDispatch()
  const game = useSelector((state: AppState) => state.game)

  const [exclamations, setExclamations] = useState(['!'])
  const [showTurnReview, setShowTurnReview] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      if (exclamations.length < 15) {
        setExclamations([...exclamations, '!'])
      }
    }, 100)
  }, [exclamations])

  function submitResults(playedPhrases: PlayedPhrase[]) {
    if (game) {
      dispatch(submitPlayedPhrases({
        gameId: game._id,
        playedPhrases,
      }))
    }
  }

  function handleNextTurn() {
    if (game) submitResults(game.turns[0].playedPhrases)
  }

  if (!game) return <div />

  return (
    <>
      <Container>
        <header>
          <FontAwesomeIcon icon={['fas', 'siren-on']} />
          <h1>TIME{exclamations.join('')}</h1>
        </header>
        {isPrompter && (
          <div className="controls">
            <TextButton
              text="Next Turn"
              trailingIcon={['fas', 'long-arrow-right']}
              onClick={handleNextTurn}
            />
            <span>or</span>
            <TextButton
              text="Change Results"
              trailingIcon={['fas', 'undo']}
              onClick={() => setShowTurnReview(true)}
            />
          </div>
        )}
      </Container>
      {showTurnReview && (
        <TurnReviewModal
          onClose={() => setShowTurnReview(false)}
          onSubmit={submitResults}
        />
      )}
    </>
  )
}

export default TimesUp
