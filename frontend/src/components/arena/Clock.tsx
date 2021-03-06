import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Container = styled('div')`
  position: relative;
  svg {
    position: relative;
    top: -1px;
    margin-right: 0.5em;
    font-size: ${props => props.theme.ms(1)};
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
  }
  span {
    font-size: ${props => props.theme.ms(2)};
    font-style: italic;
    font-weight: 900;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
  &.warn {
    animation: inflate 1000ms infinite ${props => props.theme.ease.bounce};
    svg,
    span {
      color: ${props => props.theme.red};
    }
  }
`

interface Props {
  seconds: number
}

const Clock = ({ seconds }: Props) => {
  function formatTime(t: number) {
    if (t < 10) {
      return `0${t}`
    }
    return t
  }

  return (
    <Container className={seconds <= 10 ? 'warn' : ''}>
      <FontAwesomeIcon icon={['fas', 'alarm-clock']} />
      <span>0:{formatTime(seconds)}</span>
    </Container>
  )
}

export default Clock
