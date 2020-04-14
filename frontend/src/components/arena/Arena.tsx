import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { AppState } from '../../store'
import RoundInfo from './RoundInfo'
import GetReady from './GetReady'
import animateEntrance from '../../lib/animateEntrance'
import Prompter from './Prompter'
import Scoreboard from './Scoreboard'
import WaitingOn from './WaitingOn'
import Promptee from './Promptee'
import GameOver from '../GameOver'
import TurnCountdown from '../TurnCountdown'

const Container = styled('div')`
  background: ${(props) => props.theme.green};
  min-height: 100vh;
  padding: 0 2em;
  ${animateEntrance('fade', 1000)}
  .wrapped {
    min-height: 100vh;
    max-width: 30em;
    margin: auto;
  }
`

const Arena = () => {
  const authedUser = useSelector((state: AppState) => state.authedUser)
  const game = useSelector((state: AppState) => state.game)

  const yourTurn = useMemo(() => {
    return game?.turns[0].userId === authedUser?._id
  }, [authedUser, game])

  function getMainContent() {
    if (!game) return <div />
    if (game.gameOver) return <GameOver />
    if (game.turns[0].showCountdown) return <TurnCountdown />
    if (yourTurn && !game.turns[0].startTime) {
      return <GetReady />
    }
    if (!yourTurn && !game.turns[0].startTime) {
      return (
        <>
          <RoundInfo />
          <Scoreboard />
          <WaitingOn />
        </>
      )
    }
    if (yourTurn && game.turns[0].startTime) {
      return <Prompter />
    }
    if (!yourTurn && game.turns[0].startTime) {
      return <Promptee />
    }
    return <div />
  }

  return (
    <Container>
      <div className="wrapped">
        {getMainContent()}
      </div>
    </Container>
  )
}

export default Arena
