import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { AppState } from '../../store'

const Container = styled('div')`
  margin-top: 2em;
  padding-top: 1em;
  border-top: 1px solid ${props => props.theme.lightGray};
  .phrases {
    li {
      display: inline-flex;
      align-items: center;
      margin: 0.25em 0.25em 0.25em 0;
      padding: 0.25em 0.25em 0.25em 1.25em;
      border-radius: 30px;
      border: 1px solid ${props => props.theme.lightGreen};
      span {
        margin-right: 0.5em;
      }
      button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        height: 2.5rem;
        width: 2.5rem;
        font-size: ${props => props.theme.ms(1)};
        border-radius: 100%;
        &:hover {
          background: ${props => props.theme.lightGray};
        }
      }
    }
  }
`

interface Props {
  handlePhraseDelete: (phraseId: string) => void;
}

const MyPhrases = ({
  handlePhraseDelete,
}: Props) => {
  const user = useSelector((state: AppState) => state.user)
  const game = useSelector((state: AppState) => state.game)

  if (!game || !user) return <div />

  return (
    <Container>
      {game.phrases.length > 0 && (
        <ul className="phrases">
          {game.phrases
            .filter(p => p.authorId === user._id)
            .reverse()
            .map(p => (
              <li key={p._id}>
                <span>{p.text}</span>
                <button
                  type="button"
                  onClick={() => handlePhraseDelete(p._id)}
                >
                  &times;
                </button>
              </li>
            ))}
        </ul>
      )}
    </Container>
  )
}

export default MyPhrases
