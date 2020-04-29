import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Modal from './Modal'
import { AppState } from '../store/index'
import TextButton from './TextButton'

const BigNumbers = styled('h1')`
  font-size: ${props => props.theme.ms(5)};
  font-weight: normal;
  color: ${props => props.theme.darkGreen};
  margin-bottom: 2rem;
`

interface Props {
  onClose: () => void;
}

const CreatorWelcomeModal = ({
  onClose,
}: Props) => {
  const game = useSelector((state: AppState) => state.game)

  return (
    <Modal onClose={onClose} style={{ textAlign: 'center' }}>
      <h5>Game created!</h5>
      <p>Welcome! Tell you friends to join game #{game?.shortId}.</p>
      <BigNumbers>{game?.shortId}</BigNumbers>
      <TextButton
        text="Okay, I told 'em"
        onClick={() => onClose()}
        variant="big"
      />
    </Modal>
  )
}

export default CreatorWelcomeModal
