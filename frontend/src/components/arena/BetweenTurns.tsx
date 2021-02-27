import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import SkipTurnModal from './skip-turn-modal'
import { useCurrentTurn } from '../../hooks/useCurrentTurn'
import { usePrevious } from '../../hooks/usePrevious'
import { useAuth } from '../../hooks/useAuth'
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
  isYourTurn: boolean
}

const BetweenTurns = ({ isYourTurn }: Props) => {
  const game = useGame()
  const user = useAuth()
  const turn = useCurrentTurn()
  const [showSkipPrompt, setShowSkipPrompt] = useState(false)
  const [showVotingModal, setShowVotingModal] = useState(false)
  const [timer, setTimer] = useState(0)

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

  const hasVoted = useMemo(() => {
    return !!user && turn.votesToSkip.includes(user._id)
  }, [user, turn.votesToSkip])

  const onClose = () => {
    setShowVotingModal(false)
  }

  const onOpen = () => {
    setShowVotingModal(true)
  }

  const onVote = () => {
    api.voteToSkip(game._id)
  }

  const reset = () => {
    setShowVotingModal(false)
    setShowSkipPrompt(false)
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
      {showVotingModal && (
        <SkipTurnModal onClose={onClose} onVote={onVote} hasVoted={hasVoted} />
      )}
    </Container>
  )
}

export default BetweenTurns
