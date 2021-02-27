import React from 'react'
import styled from 'styled-components'

const Container = styled('div')`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  overflow: hidden;
  height: 100%;
  width: 100%;
  color: white;
  font-style: italic;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  h1,
  h2 {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
  }
  h1 {
    font-size: ${props => props.theme.ms(7)};
  }
  h2 {
    top: 2rem;
    animation-name: bigLeftToRight;
    animation-duration: 5s;
    animation-timing-function: cubic-bezier(0, 0, 0.35, 1.04);
    animation-fill-mode: forwards;
  }
  h1 {
    top: 5rem;
    animation-name: bigRightToLeft;
    animation-duration: 5s;
    animation-timing-function: cubic-bezier(0, 0, 0.35, 1.04);
    animation-fill-mode: forwards;
  }
`

interface Props {
  roundNum: number
}

const NewRoundSplash = ({ roundNum }: Props) => {
  return (
    <Container>
      <h2>Round</h2>
      <h1>{roundNum}</h1>
    </Container>
  )
}

export default NewRoundSplash
