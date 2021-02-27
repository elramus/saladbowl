import React, { useMemo, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { AppState } from '../../store'
import Prompter from './Prompter'
import Promptee from './Promptee'
import GameOver from '../GameOver'
import TurnCountdown from './TurnCountdown'
import { isFirstTurnOfRound } from '../../lib/isFirstTurnOfRound'
import NewRoundSplash from './NewRoundSplash'
import BetweenTurns from './BetweenTurns'
import useGaPageview from '../../hooks/useGaPageview'

const Container = styled('div')`
  background: ${props => props.theme.green};
  min-height: 100vh;
  .wrapped {
    max-width: 30em;
    height: inherit;
    margin: auto;
  }
`

const Arena = () => {
  useGaPageview()

  const user = useSelector((state: AppState) => state.user)
  const game = useSelector((state: AppState) => state.game)

  const [showNewRoundScreen, setShowNewRoundScreen] = useState(
    isFirstTurnOfRound(game),
  )
  const roundsSplashed = useRef<number[]>([])

  const isYourTurn = useMemo(() => {
    return game?.turns[0].userId === user?._id
  }, [user, game])

  const isYourTeam = useMemo(() => {
    const promptingId = game?.turns[0].userId
    const promptingTeam = game?.teams.find(t =>
      t.userIds.includes(promptingId ?? ''),
    )
    return promptingTeam?.userIds.includes(user?._id ?? '') ?? false
  }, [user, game])

  useEffect(() => {
    // If we haven't splashed this round yet, do it now.
    if (
      game &&
      game.turns[0].round > 0 &&
      roundsSplashed.current &&
      !roundsSplashed.current.includes(game.turns[0].round)
    ) {
      // Show splash and mark that we've shown it.
      setShowNewRoundScreen(true)
      roundsSplashed.current.push(game.turns[0].round)
    }
  }, [game])

  useEffect(() => {
    if (showNewRoundScreen) {
      setTimeout(() => {
        setShowNewRoundScreen(false)
      }, 4500) // The duration of the NewRoundSplash animations are 5s.
    }
  }, [showNewRoundScreen])

  function getMainContent() {
    if (!game) {
      return <div />
    }
    if (game.gameOver) {
      return <GameOver />
    }
    if (showNewRoundScreen) {
      return <NewRoundSplash roundNum={game.turns[0].round} />
    }
    if (game.turns[0].showCountdown) {
      return <TurnCountdown />
    }
    if (!game.turns[0].startTime) {
      return <BetweenTurns isYourTurn={isYourTurn} />
    }
    if (game.turns[0].startTime && isYourTurn) {
      return <Prompter />
    }
    if (game.turns[0].startTime && !isYourTurn) {
      return <Promptee isYourTeam={isYourTeam} />
    }
    return <div />
  }

  return (
    <Container>
      <div className="wrapped">{getMainContent()}</div>
    </Container>
  )
}

export default Arena
