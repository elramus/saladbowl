import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import Modal from '../Modal'
import { Game } from '../../store/game/types'
import { undoPhrase, failPhrase } from '../../store/game/actions'

const List = styled('ul')`
  margin: -2em;
  li {
    border-bottom: 1px solid ${props => props.theme.middleGray};
    button {
      width: 100%;
      padding: 2em 1.5em;
      color: ${props => props.theme.black};
      font-weight: bold;
      text-align: left;
      &:hover {
        background: ${props => props.theme.offWhite};
      }
    }
  }
`

interface Props {
  onClose: () => void
  game: Game
}

const PrompterMenu = ({ onClose, game }: Props) => {
  const dispatch = useDispatch()

  function handleUndo() {
    const turn = game.turns[0]

    // We want to undo the last thing on the played phrases array.
    if (turn.playedPhrases.length >= 1) {
      dispatch(
        undoPhrase({
          gameId: game._id,
          phraseId: turn.playedPhrases[turn.playedPhrases.length - 1].phraseId,
        }),
      )
    }
    onClose()
  }

  function handleSkip() {
    // The prompter is looking at the first phrase in the unsolved array, so
    // that's what we are skipping.
    dispatch(
      failPhrase({
        gameId: game._id,
        phraseId: game.unsolvedPhraseIds[0],
      }),
    )
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <List>
        <li>
          <button
            type="button"
            onClick={handleUndo}
            disabled={game.turns[0].playedPhrases.length === 0}
          >
            Undo last phrase
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={handleSkip}
            disabled={game.unsolvedPhraseIds.length === 1}
          >
            Skip this phrase
          </button>
        </li>
        <li>
          <button type="button" onClick={onClose}>
            Return to game
          </button>
        </li>
      </List>
    </Modal>
  )
}

export default PrompterMenu
