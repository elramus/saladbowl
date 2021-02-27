import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCurrentPrompter } from '../../../hooks/useCurrentPrompter'
import { useCurrentTurn } from '../../../hooks/useCurrentTurn'
import Modal from '../../Modal'
import TextButton from '../../TextButton'

const VoteControlContainer = styled('div')`
  margin-top: 5rem;
  text-align: center;
  p {
    opacity: 0.5;
    font-weight: bold;
    text-transform: uppercase;
    svg {
      margin-right: 0.25rem;
    }
  }
`

interface SkipTurnModalProps {
  onVote(): void
  onClose(): void
  hasVoted: boolean
}

const SkipTurnModal: React.FC<SkipTurnModalProps> = ({
  onVote,
  onClose,
  hasVoted,
}) => {
  const turn = useCurrentTurn()
  const currentPrompter = useCurrentPrompter()

  return (
    <Modal onClose={onClose}>
      <strong>
        If three players agree, we'll skip {currentPrompter.name} and the next
        player on their team will go instead.
      </strong>
      <hr style={{ opacity: 0.25 }} />
      <strong>
        {turn.votesToSkip.length} vote{turn.votesToSkip.length === 1 ? '' : 's'}
        .
      </strong>

      <VoteControlContainer>
        {hasVoted ? (
          <p>
            <FontAwesomeIcon icon={['fas', 'check']} />
            Voted
          </p>
        ) : (
          <TextButton text="Skip?" onClick={onVote} variant="big" />
        )}
      </VoteControlContainer>
    </Modal>
  )
}

export default SkipTurnModal
