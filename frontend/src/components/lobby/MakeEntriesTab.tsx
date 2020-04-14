import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { HelperText } from '../styled/HelperText'
import animateEntrance from '../../lib/animateEntrance'
import MyPhrases from './MyPhrases'
import TextButton from '../TextButton'
import { AppState } from '../../store'
import { createPhrase, deletePhrase } from '../../store/game/actions'
import useScrollToTop from '../../hooks/useScrollToTop'

const Container = styled('div')`
  ${animateEntrance('fadeSlideUp', 500)};
  >textarea {
    width: 100%;
    height: 3.25em;
    margin: 0.75em 0 1em 0;
  }
  >.controls {
    display: flex;
    justify-content: space-between;
  }
`

interface Props {
  setCurrentTab: (tab: number) => void;
}

const MakeEntriesTab = ({
  setCurrentTab,
}: Props) => {
  const [entry, setEntry] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  const dispatch = useDispatch()
  const game = useSelector((state: AppState) => state.game)

  useScrollToTop()

  function handleAdd() {
    if (entry.length > 1 && game) {
      setIsSubmitting(true)
      dispatch(createPhrase(entry, game._id, () => {
        setIsSubmitting(false)
        setEntry('')
        // We're gonna blur the input field so user sees them
        // populate beneath the form.
        if (ref.current) ref.current.blur()
      }))
    }
  }

  function handleKeyPress(key: string) {
    if (key === 'Enter') {
      handleAdd()
    }
  }

  function handleDone() {
    setCurrentTab(1)
  }

  function handlePhraseClick(phraseId: string) {
    if (game) {
      dispatch(deletePhrase(game._id, phraseId))
    }
  }

  return (
    <Container>
      <HelperText>Ask your deepest, darkest self "What stupid things should I make my friends say?"</HelperText>
      <textarea
        onChange={(e) => setEntry(e.target.value)}
        ref={ref}
        placeholder="Let your freak flag fly..."
        value={entry}
        onKeyPress={(e) => handleKeyPress(e.key)}
      />
      <div className="controls">
        <TextButton
          text={isSubmitting ? 'Adding...' : 'Add'}
          trailingIcon={['fas', 'plus-circle']}
          variant="cta"
          onClick={handleAdd}
        />
        <TextButton
          text="I'm Done"
          trailingIcon={['fas', 'long-arrow-right']}
          onClick={handleDone}
        />
      </div>
      <MyPhrases handlePhraseClick={handlePhraseClick} />
    </Container>
  )
}

export default MakeEntriesTab
