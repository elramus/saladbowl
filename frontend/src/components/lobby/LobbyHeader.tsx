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
  .fa-salad {
    color: ${(props) => props.theme.darkGreen};
    font-size: ${(props) => props.theme.ms(2)};
    margin-right: 0.5rem;
  }
  .stats {
    display: flex;
    flex-direction: column;
    span {
      font-size: ${(props) => props.theme.ms(-1)};
      color: ${(props) => props.theme.darkGray};
    }
  }
  .ready-button {
    margin-left: auto;
    .flex-container {
      position: relative;
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.darkGreen};
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
  shouldAskIfReady: boolean;
  changeReadyStatus: (status: boolean) => void;
}

const LobbyHeader = ({
  shouldAskIfReady,
  changeReadyStatus,
}: Props) => {
  const game = useSelector((state: AppState) => state.game)
  const users = useSelector((state: AppState) => state.users)

  if (!game) {
    return <p>No game found</p>
  }

  return (
    <Container>
      <FontAwesomeIcon icon={['fas', 'salad']} />
      <div className="stats">
        <span>Game <strong>#{game.shortId}</strong></span>
        <span>Players <strong>{users.length ?? 0}</strong></span>
      </div>
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
      {!shouldAskIfReady && <div style={{ marginLeft: 'auto' }} />}
    </Container>
  )
}

export default LobbyHeader
