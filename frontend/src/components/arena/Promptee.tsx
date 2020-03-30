import React from 'react'
import styled from 'styled-components/macro'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppState } from '../../store'
import Clock from './Clock'

const Container = styled('div')`
  text-align: center;
  color: white;
  padding-top: 1em;
  border-top: 1px solid ${(props) => props.theme.darkGreen};
  h1 {
    margin-top: 2rem;
    font-style: italic;
  }
  .results {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top :1px solid ${(props) => props.theme.darkGreen};
    svg {
      margin-right: 0.5em;
    }
  }
  h2 {
    margin-top: 1rem;
    text-align: left;
    color: ${(props) => props.theme.black};
  }
`

const Promptee = () => {
  const game = useSelector((state: AppState) => state.game)
  const prompter = game?.players.find((p) => p.user._id === game?.turns[0].userId)?.user

  if (!game || !prompter) return <div />

  const prompterTeam = game.teams.find((t) => t.userIds.includes(prompter._id))
  const { solvedPhraseIds } = game.turns[0]

  return (
    <Container>
      <Clock
        startTime={game.turns[0].startTime ?? 0}
        countdownFrom={game.turns[0].turnLength}
      />
      <h1>{prompter.name} is prompting for {prompterTeam?.name}...</h1>
      <div className="results">
        <FontAwesomeIcon icon={['fas', 'salad']} />
        <h4>{solvedPhraseIds.length} phrase{solvedPhraseIds.length === 1 ? '' : 's'} solved this turn</h4>
      </div>
      {solvedPhraseIds.map((sPI) => {
        const phrase = game.phrases.find((p) => p._id === sPI)
        return <h2 key={sPI}>{phrase?.text}</h2>
      })}
    </Container>
  )
}

export default Promptee
