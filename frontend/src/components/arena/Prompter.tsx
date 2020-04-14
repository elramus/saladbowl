import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../../store'
import BigArrow from './BigArrow'
import { solvePhrase, next, unsolvePhrase } from '../../store/game/actions'
import TextButton from '../TextButton'
import animateEntrance from '../../lib/animateEntrance'
import Clock from './Clock'
import { useTurnCountdown } from '../../hooks/useTurnCountdown'

const Container = styled('div')`
  display: grid;
  grid-template-rows: auto 1fr auto;
  color: white;
  height: 100vh;
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      position: relative;
      top: 3px;
      ${animateEntrance('fade', 200)}
    }
  }
  .phrase {
    padding-top: 3em;
    color: ${(props) => props.theme.black};
    ${animateEntrance('slideRight', 500)}
  }
  .controls {
    text-align: center;
    margin: 2em 0;
  }
`

const Prompter = () => {
  const game = useSelector((state: AppState) => state.game)
  const dispatch = useDispatch()
  const [ready, setReady] = useState(true)
  const phrase = useMemo(() => {
    return game?.phrases.find((p) => p._id === game?.unsolvedPhraseIds[0])
  }, [game])

  function handleSolve() {
    if (ready && phrase && game && game.turns[0].startTime) {
      // Include the amount of time left in the turn in case it was the last phrase.
      const elapsed = Math.floor((Date.now() - game.turns[0].startTime) / 1000)
      const timeRemaining = game.turns[0].turnLength - elapsed

      dispatch(solvePhrase({
        phraseId: phrase._id,
        gameId: game._id,
        timeRemaining,
      }))
    }
    // Set ready to false, and then back again in a second to
    // prevent accidental spamming.
    setReady(false)
    setTimeout(() => {
      setReady(true)
    }, 750)
  }

  function handleUndo() {
    if (game) {
      dispatch(unsolvePhrase({
        gameId: game._id,
        phraseId: game.turns[0].solvedPhraseIds[game.turns[0].solvedPhraseIds.length - 1],
      }))
    }
  }

  function handleEnd() {
    if (game) {
      dispatch(next({ gameId: game._id }))
    }
  }

  const timeRemaining = useTurnCountdown({ game, onZero: handleEnd })

  if (!game || !phrase) return <div />

  return (
    <Container>
      <header>
        {game && game.turns[0].solvedPhraseIds.length > 0
          ? (
            <TextButton
              leadingIcon={['fas', 'long-arrow-left']}
              text="Undo last phrase"
              onClick={handleUndo}
              color="white"
              variant="simple"
            />
          ) : (
            <div />
          )}
        <Clock time={timeRemaining} />
      </header>
      <div className="phrase">
        <h1>{phrase.text}</h1>
      </div>
      <div className="controls">
        <BigArrow onClick={handleSolve} />
      </div>
    </Container>
  )
}

export default Prompter
