import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Container = styled('div')`
  svg {
    position: relative;
    top: -1px;
    margin-right: 0.5em;
    font-size: ${(props) => props.theme.ms(1)};
  }
  span {
    font-size: ${(props) => props.theme.ms(2)};
    font-style: italic;
    font-weight: 900;
  }
  &.warn svg, &.warn span {
    color: ${(props) => props.theme.red};
  }
`

interface Props {
  startTime: number;
  countdownFrom: number;
  onFinish?: () => void;
}

const Clock = ({
  startTime,
  countdownFrom,
  onFinish,
}: Props) => {
  const [remainingTime, setRemainingTime] = useState(countdownFrom)

  useEffect(() => {
    if (remainingTime > 0) {
      setTimeout(() => {
        // Round up so that we always have 1 second... if this calcs to 60,
        // and we just set state to 60 again, it doesn't trigger a refresh.
        const elapsed = Math.ceil((Date.now() - startTime) / 1000)
        const remaining = countdownFrom - elapsed
        setRemainingTime(remaining < 0 ? 0 : remaining)
      }, 1000)
    } else if (onFinish) onFinish()
  }, [onFinish, remainingTime, startTime, countdownFrom])

  function formatTime(time: number) {
    if (time < 10) {
      return `0${time}`
    }
    return time
  }

  return (
    <Container className={remainingTime <= 10 ? 'warn' : ''}>
      <FontAwesomeIcon icon={['fas', 'alarm-clock']} />
      <span>0:{formatTime(remainingTime)}</span>
    </Container>
  )
}

export default Clock
