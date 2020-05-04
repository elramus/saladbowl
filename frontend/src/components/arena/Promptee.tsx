import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppState } from '../../store'
import Clock from './Clock'
import { useTurnCountdown } from '../../hooks/useTurnCountdown'
import TimesUp from './TimesUp'

const Container = styled('div')`
  text-align: center;
  color: white;
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.darkGreen};
  h1 {
    margin-top: 1rem;
    line-height: 1.25;
    text-align: left;
    font-size: ${props => props.theme.ms(2)};
  }
  .results {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top :1px solid ${props => props.theme.darkGreen};
    svg {
      margin-right: 0.5em;
    }
  }
  h2 {
    margin-top: 1rem;
    text-align: left;
    color: ${props => props.theme.black};
    line-height: 1em;
  }
`

interface Props {
  isYourTeam: boolean;
}

const Promptee = ({
  isYourTeam,
}: Props) => {
  const game = useSelector((state: AppState) => state.game)
  const prompter = game?.players.find(p => p.user._id === game?.turns[0].userId)?.user

  const timeRemaining = useTurnCountdown({ game })

  const solvedPhraseIds = useMemo(() => {
    return game?.turns[0].playedPhrases
      .filter(phrase => phrase.solved)
      .map(phrase => phrase.phraseId)
      .reverse() ?? []
  }, [game])

  if (!game || !prompter) return <div />

  if (timeRemaining === 0) {
    return <TimesUp />
  }

  return (
    <Container>
      <Clock time={timeRemaining} />
      {isYourTeam && (
        <h1>{prompter.name} is prompting for your team...</h1>
      )}
      {!isYourTeam && (
        <h1>{prompter.name} is prompting for the other team...</h1>
      )}
      <div className="results">
        <FontAwesomeIcon icon={['fas', 'salad']} />
        <h4>{solvedPhraseIds.length} phrase{solvedPhraseIds.length === 1 ? '' : 's'} solved this turn.</h4>
      </div>
      {solvedPhraseIds.map(sPI => {
        const phrase = game.phrases.find(p => p._id === sPI)
        return <h2 key={sPI}>{phrase?.text}</h2>
      })}
    </Container>
  )
}

export default Promptee
