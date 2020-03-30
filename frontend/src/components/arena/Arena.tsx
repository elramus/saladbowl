import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import { useSelector } from 'react-redux'
import { AppState } from '../../store'
import RoundInfo from './RoundInfo'
import GetReady from './GetReady'
import animateEntrance from '../../lib/animateEntrance'
import Prompter from './Prompter'
import Scoreboard from './Scoreboard'
import WaitingOn from './WaitingOn'
import Promptee from './Promptee'

const Container = styled('div')`
  background: ${(props) => props.theme.green};
  min-height: 100vh;
  padding: 0 2em;
  ${animateEntrance('fade', 1000)}
  .wrapped {
    max-width: 30em;
    margin: auto;
  }
  .waiting {
    border-top: 1px solid ${(props) => props.theme.darkGreen};
  }
`

const Arena = () => {
  const authedUser = useSelector((state: AppState) => state.authedUser)
  const game = useSelector((state: AppState) => state.game)

  const yourTurn = useMemo(() => {
    return game?.turns[0].userId === authedUser?._id
  }, [authedUser, game])

  if (!game) return <div />

  return (
    <Container>
      <div className="wrapped">
        {yourTurn && !game.turns[0].startTime && (
          <GetReady />
        )}
        {!yourTurn && !game.turns[0].startTime && (
          <>
            <RoundInfo />
            <Scoreboard />
            <WaitingOn />
          </>
        )}
        {yourTurn && game.turns[0].startTime && (
          <Prompter />
        )}
        {!yourTurn && game.turns[0].startTime && (
          <Promptee />
        )}
      </div>
    </Container>
  )
}

export default Arena
