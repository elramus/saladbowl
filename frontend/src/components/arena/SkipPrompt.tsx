import React from 'react'
import styled from 'styled-components'
import { useCurrentPrompter } from '../../hooks/useCurrentPrompter'
import animateEntrance from '../../lib/animateEntrance'

const Container = styled('button')`
  position: fixed;
  bottom: 2rem;
  left: 1rem;
  right: 1rem;
  padding: 1rem;
  margin: auto;
  max-width: 30rem;
  border-radius: 15px;
  text-align: center;
  background: rgba(0, 0, 0, 0.015);
  ${animateEntrance('fadeSlideUp')}
  span {
    font-weight: bold;
    opacity: 0.75;
  }
`

interface SkipPromptProps {
  onOpen(): void
}

const SkipPrompt: React.FC<SkipPromptProps> = ({ onOpen }) => {
  const currentPrompter = useCurrentPrompter()

  const onClick = () => {
    onOpen()
  }

  return (
    <Container type="button" onClick={onClick}>
      <span>Did {currentPrompter.name} step away from the game?</span>
    </Container>
  )
}

export default SkipPrompt
