import React, { useState } from 'react'
import styled from 'styled-components/macro'
import MakeEntriesTab from './MakeEntriesTab'
import PickTeamsTab from './PickTeamsTab'

const Container = styled('div')`
  >.tab-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 1em 0 2em 0;
    border-bottom: 1px solid ${(props) => props.theme.lightGray};
    h5 {
      margin: 0;
      font-size: ${(props) => props.theme.ms(0)};
      transition: color 150ms ease-out;
    }
    button {
      color: ${(props) => props.theme.middleGray};
      padding-bottom: 0.75rem;
      border-bottom: 4px solid transparent;
      &.active {
        color: ${(props) => props.theme.black};
        border-bottom: 4px solid ${(props) => props.theme.darkGreen};
      }
      &:hover h5 {
        color: ${(props) => props.theme.darkGray};
      }
    }
  }
`

const LobbyTabs = () => {
  const [currentTab, setCurrentTab] = useState(0)

  return (
    <Container>
      <div className="tab-controls">
        <button
          type="button"
          onClick={() => setCurrentTab(0)}
          className={currentTab === 0 ? 'active' : ''}
        >
          <h5>Make Entries</h5>
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab(1)}
          className={currentTab === 1 ? 'active' : ''}
        >
          <h5>Pick Teams</h5>
        </button>
      </div>
      {currentTab === 0 && (
        <MakeEntriesTab
          setCurrentTab={setCurrentTab}
        />
      )}
      {currentTab === 1 && (
        <PickTeamsTab />
      )}
    </Container>
  )
}

export default LobbyTabs
