import React from 'react'
import styled from 'styled-components/macro'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppState } from '../../store'

const Container = styled('div')`
  text-align: left;
  color: white;
  margin-bottom: 4em;
  h1 {
    margin-top: 2rem;
    font-style: italic;
    line-height: 0.5;
  }
  h1 {
    color: ${(props) => props.theme.black};
  }
`

const Scoreboard = () => {
  const game = useSelector((state: AppState) => state.game)

  if (!game) return <div />

  return (
    <Container>
      <h4>
        <FontAwesomeIcon icon={['fas', 'salad']} />&nbsp;&nbsp;
        {game.unsolvedPhraseIds.length} more phrase{game.unsolvedPhraseIds.length !== 1 ? 's' : ''} are up for grabs
      </h4>
      {game.teams.map((t) => (
        <h1 key={t._id}>{t.name}: {t.score}</h1>
      ))}
    </Container>
  )
}

export default Scoreboard
