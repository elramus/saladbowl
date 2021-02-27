import React, { useState } from 'react'
import styled from 'styled-components'
import MakeEntriesTab from './MakeEntriesTab'
import PickTeamsTab from './PickTeamsTab'

interface StyleProps {
  isPickingTeams: boolean
}

const Container = styled('div')<StyleProps>`
  > .tab-controls {
    display: grid;
    grid-template-columns: ${props =>
      props.isPickingTeams ? '1fr 1fr' : 'auto'};
    margin: 1em 0 2em 0;
    ${props =>
      props.isPickingTeams &&
      `
      border-bottom: 1px solid ${props.theme.lightGray};
    `}
    h5 {
      text-align: center;
      margin: 0;
      padding-bottom: 0.75rem;
      font-size: ${props => props.theme.ms(0)};
      transition: color 150ms ease-out;
    }
    button {
      color: ${props => props.theme.middleGray};
      border-bottom: 4px solid transparent;
      &.active {
        color: ${props => props.theme.black};
        border-bottom: 4px solid ${props => props.theme.darkGreen};
      }
      &:hover h5 {
        color: ${props => props.theme.darkGray};
      }
    }
  }
`

interface Props {
  isPickingTeams: boolean
  setAskIfReady: (status: boolean) => void
  changeReadyStatus: (status: boolean) => void
}

const LobbyTabs = ({
  isPickingTeams,
  setAskIfReady,
  changeReadyStatus,
}: Props) => {
  const [currentTab, setCurrentTab] = useState(0)

  function handleFinishedEntries() {
    if (isPickingTeams) {
      setCurrentTab(1)
    } else {
      changeReadyStatus(true)
    }
  }

  function handleTeamChosen() {
    setAskIfReady(true)
  }

  return (
    <Container isPickingTeams={isPickingTeams}>
      <div className="tab-controls">
        {isPickingTeams && (
          <>
            <button
              type="button"
              onClick={() => setCurrentTab(0)}
              className={currentTab === 0 ? 'active' : ''}
            >
              <h5>Write Phrases</h5>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab(1)}
              className={currentTab === 1 ? 'active' : ''}
            >
              <h5>Pick Teams</h5>
            </button>
          </>
        )}
        {!isPickingTeams && <h5>Write Your Phrases</h5>}
      </div>
      {currentTab === 0 && (
        <MakeEntriesTab onFinished={handleFinishedEntries} />
      )}
      {currentTab === 1 && <PickTeamsTab onChooseTeam={handleTeamChosen} />}
    </Container>
  )
}

export default LobbyTabs
