import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const Container = styled('div')`
  text-align: center;
  padding-top: 5em;
  color: white;
  h4 {
    margin-bottom: 2em;
  }
  h1 {
    font-size: ${props => props.theme.ms(4)};
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
`

const TurnCountdown = () => {
  const [count, setCount] = useState(3)

  useEffect(() => {
    setTimeout(() => {
      if (count > 0) {
        setCount(count - 1)
      }
    }, 1000)
  }, [count])

  return (
    <Container>
      <h4>Turn begins in...</h4>
      <h1>{count > 0 && count}</h1>
    </Container>
  )
}

export default TurnCountdown
