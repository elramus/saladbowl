import React, { useMemo } from 'react'
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
  const prevTurn = useMemo(() => {
    if (game && game.turns.length > 1) {
      return game.turns[1]
    }
    return null
  }, [game])
  const prevPrompter = useMemo(() => {
    if (game && game.turns.length > 1) {
      return game.players.find((p) => p.user._id === game.turns[1].userId)
    }
    return null
  }, [game])

  if (!game) return <div />

  return (
    <Container className="scoreboard">
      {!game.gameOver && (
        <h4>
          <FontAwesomeIcon icon={['fas', 'salad']} />&nbsp;&nbsp;
          {prevTurn && prevPrompter && (
            <>{prevPrompter.user.name} just got {prevTurn.solvedPhraseIds.length} phrase{prevTurn.solvedPhraseIds.length === 1 ? '' : 's'}. </>
          )}
          {game.unsolvedPhraseIds.length} more phrase{game.unsolvedPhraseIds.length !== 1 ? 's' : ''} are up for grabs.
        </h4>
      )}
      {game.teams.map((t) => (
        <h1 key={t._id}>{t.name}: {t.score}</h1>
      ))}
    </Container>
  )
}

export default Scoreboard
