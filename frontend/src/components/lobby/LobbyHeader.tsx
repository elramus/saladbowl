import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import { AppState } from '../../store'

const Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em 0;
  line-height: 1.3;
  .left,
  .right {
    display: flex;
    align-items: center;
    small {
      font-weight: bold;
    }
  }
  .stacked {
    display: flex;
    flex-direction: column;
  }
  .fa-salad {
    color: ${props => props.theme.darkGreen};
    font-size: ${props => props.theme.ms(3)};
    margin-right: 0.5rem;
  }
  .stats {
    display: flex;
    flex-direction: column;
    span {
      font-size: ${props => props.theme.ms(-1)};
      color: ${props => props.theme.darkGray};
    }
  }
  .ready-button {
    margin-left: auto;
    .flex-container {
      position: relative;
      display: flex;
      align-items: center;
      color: ${props => props.theme.darkGreen};
    }
    .icon-container {
      position: absolute;
      top: 4px;
      right: 115%;
      animation: pulseRight 1100ms cubic-bezier(0.18, 0.89, 0.32, 1.28) infinite;
    }
    h3 {
      font-style: italic;
    }
  }
`

interface Props {
  shouldAskIfReady: boolean
  changeReadyStatus: (status: boolean) => void
}

const LobbyHeader = ({ shouldAskIfReady, changeReadyStatus }: Props) => {
  const game = useSelector((state: AppState) => state.game)

  if (!game) {
    return <p>No game found</p>
  }

  return (
    <Container>
      <div className="left">
        <FontAwesomeIcon icon={['fas', 'salad']} />
        <div className="stacked">
          <span>
            <small>Salad Bowl</small>
          </span>
          <span>
            Game <strong>#{game.shortId}</strong>
          </span>
        </div>
      </div>
      <div className="right" style={{ textAlign: 'right' }}>
        {shouldAskIfReady && (
          <button
            type="button"
            className="ready-button"
            onClick={() => changeReadyStatus(true)}
          >
            <span className="flex-container">
              <span className="icon-container">
                <FontAwesomeIcon icon={['fas', 'arrow-alt-circle-right']} />
              </span>
              <h3>Ready?</h3>
            </span>
          </button>
        )}
        {!shouldAskIfReady && (
          <div className="stacked">
            <span>
              <strong>{game.players.length ?? 0}</strong> player
              {game.players.length === 1 ? '' : 's'}
            </span>
            <span>
              <strong>{game.phrases.length ?? 0}</strong> phrase
              {game.phrases.length === 1 ? '' : 's'}
            </span>
          </div>
        )}
      </div>
    </Container>
  )
}

export default LobbyHeader
