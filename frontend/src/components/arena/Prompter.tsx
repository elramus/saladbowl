import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppState } from '../../store'
import BigArrow from './BigArrow'
import { solvePhrase, failPhrase } from '../../store/game/actions'
import animateEntrance from '../../lib/animateEntrance'
import Clock from './Clock'
import { useTurnCountdown } from '../../hooks/useTurnCountdown'
import PrompterMenu from './PrompterMenu'
import TimesUp from './TimesUp'
import useScrollToTop from '../../hooks/useScrollToTop'

const Container = styled('div')`
  display: grid;
  grid-template-rows: auto minmax(15em, auto) auto;
  color: white;
  padding: 1em 2em;
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      position: relative;
      top: 5px;
      padding: 0;
      ${animateEntrance('fade', 200)}
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2em;
        width: 2em;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 100%;
      }
    }
  }
  .phrase {
    padding-top: 3em;
    color: ${props => props.theme.black};
    ${animateEntrance('slideRight', 500)}
    margin-bottom: auto;
  }
  .controls {
    text-align: center;
    margin: 2em 0;
  }
`

const Prompter = () => {
  useScrollToTop()
  const dispatch = useDispatch()
  const game = useSelector((state: AppState) => state.game)

  const [ready, setReady] = useState(true)
  const [showPrompterMenu, setShowPrompterMenu] = useState(false)

  const currentPhrase = useMemo(() => {
    return game?.phrases.find(p => p._id === game?.unsolvedPhraseIds[0])
  }, [game])

  function handleSolve() {
    if (ready && currentPhrase && game && game.turns[0].startTime) {
      // Include the amount of time left in the turn in case it was the last phrase.
      const elapsed = Math.floor((Date.now() - game.turns[0].startTime) / 1000)
      const timeRemaining = game.turns[0].turnLength - elapsed

      dispatch(
        solvePhrase({
          gameId: game._id,
          phraseId: currentPhrase._id,
          timeRemaining,
        }),
      )
    }
    // Set ready to false, and then back again in a second to
    // prevent accidental spamming.
    setReady(false)
    setTimeout(() => {
      setReady(true)
    }, 750)
  }

  function handlePrompterMenuClose() {
    setShowPrompterMenu(false)
  }

  function handleEndOfTurn() {
    // Add the phrase the player ran out on as a failed phrase.

    // Note that if the player refreshes here, they will keep sending
    // more phrases as "failed". TODO: Fix that.
    if (game && currentPhrase) {
      dispatch(
        failPhrase({
          gameId: game._id,
          phraseId: currentPhrase._id,
        }),
      )
    }
  }

  const timeRemaining = useTurnCountdown({
    game,
    onZero: handleEndOfTurn,
  })

  if (!game || !currentPhrase) return <div />

  if (timeRemaining === 0) {
    return <TimesUp isPrompter />
  }

  return (
    <>
      <Container>
        <header>
          <button
            type="button"
            onClick={() => setShowPrompterMenu(!showPrompterMenu)}
          >
            <span>
              <FontAwesomeIcon icon={['fas', 'caret-down']} />
            </span>
          </button>
          <Clock seconds={timeRemaining} />
        </header>
        <div className="phrase">
          <h1>{currentPhrase.text}</h1>
        </div>
        <div className="controls">
          <BigArrow onClick={handleSolve} />
        </div>
      </Container>
      {showPrompterMenu && (
        <PrompterMenu onClose={handlePrompterMenuClose} game={game} />
      )}
    </>
  )
}

export default Prompter
