import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import SkipTurnModal from './skip-turn-modal'
import { useCurrentTurn } from '../../hooks/useCurrentTurn'
import { usePrevious } from '../../hooks/usePrevious'
import api from '../../lib/api'
import { useGame } from '../../hooks/useGame'
import Scoreboard from './Scoreboard'
import UpNext from './UpNext'
import BeginPromptingButton from './BeginPromptingButton'
import SkipPrompt from './SkipPrompt'

const Container = styled('div')`
  padding: 1rem;
`

export const TIME_BEFORE_PROMPTING = 15

interface Props {
  isYourTurn: boolean;
}

const BetweenTurns = ({
  isYourTurn,
}: Props) => {
  const game = useGame()
  const turn = useCurrentTurn()
  const [showSkipPrompt, setShowSkipPrompt] = useState(false)
  const [showVotingModal, setShowVotingModal] = useState(false)
  const [timer, setTimer] = useState(0)
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    if (timer === TIME_BEFORE_PROMPTING) {
      setShowSkipPrompt(true)
    }
    if (timer < TIME_BEFORE_PROMPTING) {
      setTimeout(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
  }, [timer])

  const onClose = () => {
    setShowVotingModal(false)
  }

  const onOpen = () => {
    setShowVotingModal(true)
  }

  const onVote = () => {
    setHasVoted(true)
    api.voteToSkip(game._id)
  }

  const reset = () => {
    setShowVotingModal(false)
    setShowSkipPrompt(false)
    setHasVoted(false)
    setTimer(0)
  }

  // If we go from three votes to 0, that means the player just got booted.
  const prevVoteTally = usePrevious(turn.votesToSkip.length)
  useEffect(() => {
    if (prevVoteTally === 3 && turn.votesToSkip.length === 0) {
      reset()
    }
  }, [prevVoteTally, turn.votesToSkip])

  return (
    <Container>
      <Scoreboard />
      <UpNext />
      {isYourTurn && <BeginPromptingButton />}
      {showSkipPrompt && <SkipPrompt onOpen={onOpen} />}
      {showVotingModal && <SkipTurnModal onClose={onClose} onVote={onVote} hasVoted={hasVoted} />}
    </Container>
  )
}

export default BetweenTurns
