import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import Modal from '../../Modal'
import { AppState } from '../../../store'
import PlayedPhraseRow from './PlayedPhraseRow'
import TextButton from '../../TextButton'
import { PlayedPhrase } from '../../../store/game/types'

const PhraseList = styled('ul')<{ showLoading: boolean }>`
  margin-bottom: 2rem;
  ${props =>
    props.showLoading &&
    `
    opacity: 0.5;
    pointer-events: none;
  `};
`

interface Props {
  onClose: () => void
  onSubmit: (playedPhrases: PlayedPhrase[]) => void
}

const TurnReviewModal = ({ onClose, onSubmit }: Props) => {
  const game = useSelector((state: AppState) => state.game)

  const [loading, setLoading] = useState(false)

  const [playedPhrases, setPlayedPhrases] = useState(() => {
    return game?.turns[0].playedPhrases ?? []
  })

  function handlePhraseToggle(phraseTimestamp: number, status: boolean) {
    // We're using timestamp instead of ID because you can have the same phrase
    // on this array multiple times, if it was skipped and then encountered
    // again. Timestamp will always be unique.
    setPlayedPhrases(
      playedPhrases.map(p => {
        if (p.timestamp === phraseTimestamp) {
          return { ...p, solved: status }
        }
        return p
      }),
    )
  }

  function handleSubmit() {
    // submit updated played phrases array.
    if (game) {
      setLoading(true)
      onSubmit(playedPhrases)
    }
  }

  if (!game) return <Modal onClose={onClose} />

  return (
    <Modal onClose={onClose}>
      <p>
        Which phrases did your team solve? Be honest. With great power comes
        great responsibility...
      </p>
      <PhraseList showLoading={loading}>
        {playedPhrases.map(playedPhrase => (
          <PlayedPhraseRow
            key={playedPhrase.timestamp}
            playedPhrase={playedPhrase}
            onToggle={handlePhraseToggle}
          />
        ))}
      </PhraseList>
      <TextButton
        text="Submit Results"
        trailingIcon={['fas', 'check']}
        variant="big"
        onClick={handleSubmit}
        showLoading={loading}
      />
    </Modal>
  )
}

export default TurnReviewModal
