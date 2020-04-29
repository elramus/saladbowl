import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import Scoreboard from './arena/Scoreboard'
import useScrollToTop from '../hooks/useScrollToTop'

const Container = styled('div')`
  text-align: center;
  color: white;
  padding: 2em;
  a {
    margin-bottom: 1rem;
    color: white;
    font-size: ${props => props.theme.ms(5)};
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
  }
  h4 {
    margin-bottom: 2em;
  }
`

const GameOver = () => {
  useScrollToTop()

  return (
    <Container>
      <Link to="/">
        <FontAwesomeIcon icon={['fas', 'salad']} />
      </Link>
      <h3 style={{ marginBottom: '2em' }}>Game over, man!</h3>
      <h4>The final score was:</h4>
      <Scoreboard expandable={false} final />
    </Container>
  )
}

export default GameOver
